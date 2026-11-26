import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  checkCopies,
  checkRule,
  type Rule,
  type RuleException,
  suggestFix,
  type Violation,
  violationKey,
} from "./ux-writing/check";
import {
  type Copy,
  collectCopies,
  collectFromSource,
  type Scope,
  type Where,
} from "./ux-writing/collect";
import {
  toastChromeWidth,
  toastTextWidthRange,
} from "./ux-writing/toast-width";

/**
 * 화면 문구가 `ux-writing/rules.json`의 규칙을 지키는지 검사한다.
 *
 * - 예전 위반은 `ux-writing/baseline.json`에 적혀 있고 통과한다. 목록에 없는 위반이 나오면 실패한다.
 * - 목록에 있는 위반을 고쳤으면 목록에서도 지워야 한다. 지우지 않으면 실패한다.
 * - 목록을 다시 만들 때: `UX_WRITING_UPDATE_BASELINE=1 pnpm test:unit src/ux-writing.test.ts`
 *   목록은 줄이기만 한다. 새 위반을 목록에 더하지 않는다.
 * - 규칙별 위반 수를 볼 때: `UX_WRITING_REPORT=1 pnpm test:unit src/ux-writing.test.ts`
 */
const root = process.cwd();
const BASELINE_PATH = "ux-writing/baseline.json";

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(join(root, path), "utf8")) as T;
}

interface RulesFile {
  scope: Scope;
  rules: (Rule & { checkedBy?: string })[];
  exceptions: RuleException[];
}
interface BaselineEntry {
  rule: string;
  file: string;
  text: string;
  count: number;
}
interface BaselineFile {
  about: string;
  violations: BaselineEntry[];
}

const { scope, rules, exceptions } = readJson<RulesFile>(
  "ux-writing/rules.json",
);
const ruleById = new Map(rules.map((rule) => [rule.id, rule]));

function countByKey(items: Omit<Violation, "line">[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = violationKey(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function toBaseline(violations: Violation[]): BaselineFile {
  const entries = [...countByKey(violations)].map(([key, count]) => {
    const [rule, file, text] = key.split("\t");
    return { rule, file, text, count };
  });
  entries.sort(
    (a, b) =>
      a.rule.localeCompare(b.rule) ||
      a.file.localeCompare(b.file) ||
      a.text.localeCompare(b.text),
  );
  return {
    about:
      "자동 검사를 처음 넣을 때 이미 규칙을 어기고 있던 문구다. 문구를 고치면 여기서도 지운다. 새 위반은 더하지 않는다.",
    violations: entries,
  };
}

function describeViolation(violation: Violation): string {
  const rule = ruleById.get(violation.rule);
  const guide = rule?.rule ?? `"${rule?.avoid}" 대신 "${rule?.use}"`;
  const fix = violation.fix ? ` → "${violation.fix}"` : "";
  return `${violation.rule} ${violation.file}:${violation.line} "${violation.text}"${fix} (${guide})`;
}

const example = (
  text: string,
  where: Where,
  extra: Partial<Copy> = {},
): Copy => ({
  text,
  where,
  file: "example.tsx",
  line: 1,
  ...extra,
});

describe("문구 규칙 파일", () => {
  it("규칙 번호가 겹치지 않고, 규칙마다 이유와 근거가 있다", () => {
    expect(new Set(rules.map((rule) => rule.id)).size).toBe(rules.length);
    for (const rule of rules) {
      expect(rule.why, rule.id).not.toBe("");
      expect(rule.source.length, rule.id).toBeGreaterThan(0);
    }
  });

  it("자동 검사가 확인한다고 적은 규칙에는 검사가 있고, 확인하지 못한다고 적은 규칙에는 없다", () => {
    for (const rule of rules) {
      const hasCheck = Boolean(rule.check ?? rule.checkedBy);
      expect(hasCheck, rule.id).toBe(rule.auto !== "none");
    }
  });
});

describe("규칙별 검사", () => {
  const withExamples = rules.filter((rule) => rule.check && rule.examples);

  it.each(
    withExamples.map((rule) => [rule.id, rule] as const),
  )("%s: 어긴 예시는 잡고 지킨 예시는 통과시킨다", (_id, rule) => {
    for (const bad of rule.examples?.bad ?? []) {
      const found = checkRule(
        rule,
        [example(bad.text, bad.where)],
        exceptions,
        root,
      );
      expect(found.length, `어긴 예시 "${bad.text}"`).toBeGreaterThan(0);
    }
    for (const good of rule.examples?.good ?? []) {
      const found = checkRule(
        rule,
        [example(good.text, good.where)],
        exceptions,
        root,
      );
      expect(found, `지킨 예시 "${good.text}"`).toEqual([]);
    }
  });

  it.each(
    rules
      .filter((rule) => rule.fixes && rule.examples)
      .map((rule) => [rule.id, rule] as const),
  )("%s: 고칠 말을 적용한 어긴 예시는 그 규칙을 통과한다", (_id, rule) => {
    for (const bad of rule.examples?.bad ?? []) {
      const fixed = suggestFix(rule, bad.text);
      expect(fixed, `"${bad.text}"에 고칠 말이 적용된다`).not.toBeNull();
      const found = checkRule(
        rule,
        [example(fixed as string, bad.where)],
        exceptions,
        root,
      );
      expect(found, `"${bad.text}" → "${fixed}"`).toEqual([]);
    }
  });

  it("P09: 추가하거나 수정하는 화면의 아래 버튼이 '완료'가 아니면 잡는다", () => {
    const rule = ruleById.get("P09") as Rule;
    const title = example("출발지 추가", "text", { screenTitle: true });
    const check = (button: string, copies: Copy[] = [title]) =>
      checkRule(
        rule,
        [...copies, example(button, "bottomButton")],
        exceptions,
        root,
      ).map((violation) => violation.text);

    expect(check("출발지 추가하기")).toEqual(["출발지 추가하기"]);
    expect(check("저장하기")).toEqual(["저장하기"]);
    expect(check("완료")).toEqual([]);
    // 제목이 "추가"나 "수정"으로 끝나지 않는 화면의 들어가는 버튼은 잡지 않는다.
    const listTitle = example("출발지 관리", "text", { screenTitle: true });
    expect(check("출발지 추가하기", [listTitle])).toEqual([]);
  });

  it("예외에 적은 느낌표 문구는 통과시킨다", () => {
    const rule = ruleById.get("S09") as Rule;
    const allowed = exceptions.find((item) => item.id === "X4")?.allow ?? [];
    expect(allowed.length).toBe(3);
    const copies = allowed.map((item) =>
      example(item.text, "text", { file: item.file }),
    );
    expect(checkRule(rule, copies, exceptions, root)).toEqual([]);
  });
});

describe("문구의 위치 읽기", () => {
  const source = `
    const SAVE_FAILED_MESSAGE = "저장하지 못했어요";
    const getDeniedMessage = () => "권한을 허용해주세요";
    export function Page() {
      const save = () => {
        toast.success("저장했어요");
        toast.error(failed ? SAVE_FAILED_MESSAGE : getDeniedMessage());
        toast.message("버튼을 눌러주세요");
      };
      return (
        <>
          <Header title="출발지 추가" />
          <h2>시간표 수정</h2>
          <p>설명 {count}개</p>
          <p>{stationName} 근처에 장소가 없어요</p>
          <p>
            {name}
            님의 모임
          </p>
          <IconButton aria-label="공유하기 닫기" />
          <ToastProvider label="알림" />
          <Modal title="삭제할까요?" body="복구할 수 없어요" mainLabel="삭제" alternativeLabel="취소" />
          <ActionArea main={<Button>{pending ? "수정하는 중" : "완료"}</Button>} />
          <BottomActionBarWithButtonAndShare>일정 추가하기</BottomActionBarWithButtonAndShare>
          {kind === "식당" ? null : null}
        </>
      );
    }
  `;
  const toastOwners = new Map<string, Where>();
  const found = collectFromSource(
    "example.tsx",
    source,
    { bottomButtonLabelFiles: [], screenReaderProps: ["ToastProvider.label"] },
    toastOwners,
  );
  const whereOf = (text: string) =>
    found.find((copy) => copy.text === text)?.where;

  it("토스트, 모달, 화면 아래 버튼, 화면 읽기 프로그램용 이름을 구분한다", () => {
    expect(whereOf("저장했어요")).toBe("toast.success");
    expect(whereOf("버튼을 눌러주세요")).toBe("toast.message");
    expect(whereOf("삭제할까요?")).toBe("modal.title");
    expect(whereOf("복구할 수 없어요")).toBe("modal.body");
    expect(whereOf("삭제")).toBe("modal.mainLabel");
    expect(whereOf("취소")).toBe("modal.alternativeLabel");
    expect(whereOf("완료")).toBe("bottomButton");
    expect(whereOf("수정하는 중")).toBe("bottomButton");
    expect(whereOf("일정 추가하기")).toBe("bottomButton");
    expect(whereOf("공유하기 닫기")).toBe("ariaLabel");
    expect(whereOf("알림")).toBe("ariaLabel");
    expect(whereOf("설명 {count}개")).toBe("text");
  });

  it("변수 뒤의 띄어쓰기는 화면에 나오는 대로 읽는다", () => {
    expect(whereOf("{stationName} 근처에 장소가 없어요")).toBe("text");
    // 줄을 바꿔 쓴 JSX는 화면에서 붙어 나온다.
    expect(whereOf("{name}님의 모임")).toBe("text");
  });

  it("토스트에 상수나 함수로 넘긴 문구의 이름을 적어 둔다", () => {
    expect(toastOwners.get("SAVE_FAILED_MESSAGE")).toBe("toast.error");
    expect(toastOwners.get("getDeniedMessage")).toBe("toast.error");
  });

  it("제목을 표시하고, 비교에 쓰는 값은 문구로 읽지 않는다", () => {
    const titles = found
      .filter((copy) => copy.screenTitle)
      .map((copy) => copy.text);
    expect(titles).toEqual(["출발지 추가", "시간표 수정"]);
    expect(whereOf("식당")).toBeUndefined();
  });
});

describe("토스트 너비 계산", () => {
  const measured = readJson<{
    browsers: {
      browser: string;
      rows: {
        text: string;
        textWidth: number;
        boxWidth?: number;
        icon?: boolean;
      }[];
    }[];
  }>("ux-writing/toast-width-measured.json");

  it("브라우저 8곳에서 잰 글자 너비가 모두 계산한 두 값 사이에 있다", () => {
    expect(measured.browsers.length).toBe(8);
    for (const { browser, rows } of measured.browsers) {
      expect(rows.length, browser).toBeGreaterThan(90);
      for (const row of rows) {
        const { narrow, wide } = toastTextWidthRange(root, row.text);
        const label = `${browser}: ${row.text}`;
        expect(row.textWidth, label).toBeGreaterThanOrEqual(narrow - 0.25);
        expect(row.textWidth, label).toBeLessThanOrEqual(wide);
      }
    }
  });

  it("데스크톱 Chromium에서는 자간을 모두 적용한 계산값과 0.25px 안으로 같다", () => {
    for (const row of measured.browsers[0].rows) {
      const { narrow } = toastTextWidthRange(root, row.text);
      expect(Math.abs(row.textWidth - narrow), row.text).toBeLessThanOrEqual(
        0.25,
      );
    }
  });

  it("실제 토스트 상자는 글자에 여백과 아이콘을 더한 너비다", () => {
    for (const row of measured.browsers[0].rows) {
      if (row.boxWidth === undefined) continue;
      expect(
        Math.abs(
          row.boxWidth - row.textWidth - toastChromeWidth(row.icon === true),
        ),
        row.text,
      ).toBeLessThanOrEqual(0.1);
    }
  });
});

describe("서비스 문구", () => {
  const copies = collectCopies(root, scope);
  const violations = checkCopies(rules, copies, exceptions, root);

  if (process.env.UX_WRITING_UPDATE_BASELINE === "1") {
    writeFileSync(
      join(root, BASELINE_PATH),
      `${JSON.stringify(toBaseline(violations), null, 2)}\n`,
    );
  }
  if (process.env.UX_WRITING_REPORT === "1") {
    const counts = new Map<string, number>();
    for (const violation of violations) {
      counts.set(violation.rule, (counts.get(violation.rule) ?? 0) + 1);
    }
    console.log(
      `문구 ${copies.length}개, 위반 ${violations.length}개\n${[...counts]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([rule, count]) => `${rule}\t${count}`)
        .join("\n")}`,
    );
  }

  const baseline = readJson<BaselineFile>(BASELINE_PATH);
  const allowed = new Map(
    baseline.violations.map((entry) => [violationKey(entry), entry.count]),
  );
  const current = countByKey(violations);

  it("검사할 문구를 읽는다", () => {
    expect(copies.length).toBeGreaterThan(200);
  });

  it("예전 위반 목록에 없는 위반이 없다", () => {
    const seen = new Map<string, number>();
    const fresh = violations.filter((violation) => {
      const key = violationKey(violation);
      const order = (seen.get(key) ?? 0) + 1;
      seen.set(key, order);
      return order > (allowed.get(key) ?? 0);
    });
    expect(fresh.map(describeViolation)).toEqual([]);
  });

  it("고친 위반은 예전 위반 목록에서 지운다", () => {
    const stale = baseline.violations
      .filter((entry) => (current.get(violationKey(entry)) ?? 0) < entry.count)
      .map((entry) => `${entry.rule} ${entry.file} "${entry.text}"`);
    expect(stale).toEqual([]);
  });
});
