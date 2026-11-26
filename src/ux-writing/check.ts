import type { Copy, Where } from "./collect";
import { toastWidth } from "./toast-width";

interface AvoidCheck {
  type: "avoid";
  patterns: string[];
  where: string[];
  /** 이 예외의 allow에 적힌 문구는 통과시킨다. */
  exceptRef?: string;
}
interface MustMatchCheck {
  type: "mustMatch";
  pattern: string;
  where: string[];
}
interface AttachedAuxiliaryCheck {
  type: "attachedAuxiliary";
  where: string[];
}
interface MaxToastWidthCheck {
  type: "maxToastWidth";
  px: number;
  where: string[];
}
interface AddEditDoneCheck {
  type: "addEditDone";
  titlePattern: string;
  buttonPattern: string;
}
/** 고칠 말. find를 replace로 바꾸거나(정규식, $1 사용 가능), 띄어 쓴 "주세요", "보세요"를 붙인다. */
export type Fix = { find: string; replace: string } | { type: "joinAuxiliary" };

export type Check =
  | AvoidCheck
  | MustMatchCheck
  | AttachedAuxiliaryCheck
  | MaxToastWidthCheck
  | AddEditDoneCheck;

export interface Rule {
  id: string;
  group: string;
  rule?: string;
  use?: string;
  avoid?: string;
  why: string;
  source: string[];
  auto: "full" | "position" | "partial" | "none";
  example?: string;
  note?: string;
  check?: Check;
  fixes?: Fix[];
  examples?: {
    bad: { text: string; where: Where }[];
    good: { text: string; where: Where }[];
  };
}

export interface RuleException {
  id: string;
  text: string;
  why: string;
  source: string[];
  allow?: { file: string; text: string }[];
}

export interface Violation {
  rule: string;
  file: string;
  line: number;
  text: string;
  start?: number;
  end?: number;
  /** 규칙 파일의 fixes를 적용한 문구. 고칠 말이 없거나 바뀌지 않으면 없다. */
  fix?: string;
}

const inWhere = (copy: Copy, where: string[]) =>
  where.includes("*") || where.includes(copy.where);

/** "해 주세요", "기다려 보세요"처럼 본용언과 "주세요", "보세요"를 띄어 쓴 곳을 찾는다. */
function hasSpacedAuxiliary(text: string): boolean {
  for (const match of text.matchAll(/([가-힣]) (주세요|보세요)/g)) {
    const code = match[1].charCodeAt(0) - 0xac00;
    const hasFinal = code % 28 !== 0;
    const vowel = Math.floor(code / 28) % 21;
    // 받침 없이 ㅏ ㅐ ㅓ ㅔ ㅕ ㅘ ㅙ ㅝ ㅞ로 끝나는 말(해, 려, 와 등)은 연결어미 "-아/-어"가 붙은 꼴이다.
    // "이름을 주세요"처럼 조사 뒤에 온 "주세요"는 받침이 있어서 걸리지 않는다.
    if (!hasFinal && [0, 1, 4, 5, 6, 9, 10, 14, 15].includes(vowel))
      return true;
  }
  return false;
}

const SPACED_AUXILIARY = /([가-힣]) (주세요|보세요)/g;

/** 규칙의 fixes를 차례로 적용한다. 바뀌지 않으면 null이다. */
export function suggestFix(rule: Rule, text: string): string | null {
  if (!rule.fixes) return null;
  let next = text;
  for (const fix of rule.fixes) {
    if ("type" in fix) {
      next = next.replace(SPACED_AUXILIARY, (all, last: string, aux: string) =>
        hasSpacedAuxiliary(all) ? `${last}${aux}` : all,
      );
    } else {
      next = next.replace(new RegExp(fix.find, "g"), fix.replace);
    }
  }
  return next === text ? null : next;
}

/** 변수 자리가 있는 문구는 너비를 계산할 수 없다. */
const hasPlaceholder = (text: string) => /\{[^}]*\}/.test(text);

/** 규칙 하나로 문구들을 검사한다. */
export function checkRule(
  rule: Rule,
  copies: Copy[],
  exceptions: RuleException[],
  root: string,
): Violation[] {
  const check = rule.check;
  if (!check) return [];
  const violation = (copy: Copy): Violation => {
    const fix = suggestFix(rule, copy.text);
    return {
      rule: rule.id,
      file: copy.file,
      line: copy.line,
      text: copy.text,
      ...(copy.start !== undefined ? { start: copy.start, end: copy.end } : {}),
      ...(fix ? { fix } : {}),
    };
  };

  if (check.type === "addEditDone") {
    const title = new RegExp(check.titlePattern);
    const button = new RegExp(check.buttonPattern);
    const addEditFiles = new Set(
      copies
        .filter((copy) => copy.screenTitle && title.test(copy.text))
        .map((copy) => copy.file),
    );
    return copies
      .filter(
        (copy) =>
          copy.where === "bottomButton" &&
          addEditFiles.has(copy.file) &&
          button.test(copy.text),
      )
      .map(violation);
  }

  const targets = copies.filter((copy) => inWhere(copy, check.where));

  if (check.type === "avoid") {
    const patterns = check.patterns.map((pattern) => new RegExp(pattern));
    const allowed =
      exceptions.find((item) => item.id === check.exceptRef)?.allow ?? [];
    return targets
      .filter((copy) => patterns.some((pattern) => pattern.test(copy.text)))
      .filter(
        (copy) =>
          !allowed.some(
            (allow) => allow.file === copy.file && allow.text === copy.text,
          ),
      )
      .map(violation);
  }
  if (check.type === "mustMatch") {
    const pattern = new RegExp(check.pattern);
    return targets.filter((copy) => !pattern.test(copy.text)).map(violation);
  }
  if (check.type === "attachedAuxiliary") {
    return targets
      .filter((copy) => hasSpacedAuxiliary(copy.text))
      .map(violation);
  }
  return targets
    .filter((copy) => !hasPlaceholder(copy.text))
    .filter(
      (copy) =>
        toastWidth(root, copy.text, copy.where !== "toast.message") > check.px,
    )
    .map(violation);
}

/** 모든 규칙으로 문구들을 검사한다. */
export function checkCopies(
  rules: Rule[],
  copies: Copy[],
  exceptions: RuleException[],
  root: string,
): Violation[] {
  return rules.flatMap((rule) => checkRule(rule, copies, exceptions, root));
}

/** 예전 위반 목록과 비교할 때 쓰는 열쇠. 줄 번호는 코드가 움직이면 바뀌므로 넣지 않는다. */
export const violationKey = (item: Omit<Violation, "line">) =>
  `${item.rule}\t${item.file}\t${item.text}`;
