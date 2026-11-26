import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

/** 문구가 화면의 어디에 나오는지. `ux-writing/rules.json`의 legend.where와 같다. */
export type Where =
  | "toast.success"
  | "toast.error"
  | "toast.message"
  | "modal.title"
  | "modal.body"
  | "modal.mainLabel"
  | "modal.alternativeLabel"
  | "bottomButton"
  | "ariaLabel"
  | "pageTitle"
  | "text";

export interface Copy {
  text: string;
  file: string;
  line: number;
  where: Where;
  /** 화면이나 창의 제목(Header의 title, h1, h2). "추가하거나 수정하는 화면"인지 볼 때 쓴다. */
  screenTitle?: boolean;
  /** 소스에서 문구가 차지하는 자리(글자 위치). 편집기에 밑줄을 긋고 고칠 때 쓴다. 따옴표도 들어간다. */
  start?: number;
  end?: number;
}

export interface Scope {
  include: string[];
  exclude: string[];
  bottomButtonLabelFiles: string[];
  /** aria-label로 쓰이는 컴포넌트 속성. "ToastProvider.label"처럼 적는다. */
  screenReaderProps: string[];
  notCopy: { file: string; text: string; why: string }[];
}

const HANGUL = /[ㄱ-ㆎ가-힣]/;
/**
 * 페이지 제목 자리. 내용이 아니라 위치로 정한다.
 * - index.html: <title>과, 제목을 담는 meta(속성 이름으로 정함)
 * - vite.config.ts: 앱 매니페스트의 name(홈 화면에 추가한 앱의 이름)
 */
const PAGE_TITLE_META = new Set([
  "og:title",
  "og:image:alt",
  "twitter:title",
  "apple-mobile-web-app-title",
  "application-name",
]);
const APP_NAME_FILE = "vite.config.ts";
const MODAL_PROPS: Record<string, Where> = {
  title: "modal.title",
  body: "modal.body",
  mainLabel: "modal.mainLabel",
  alternativeLabel: "modal.alternativeLabel",
};

const normalize = (text: string) => text.replace(/\s+/g, " ").trim();

function tagNameOf(node: ts.Node): string {
  if (ts.isJsxElement(node)) return node.openingElement.tagName.getText();
  if (ts.isJsxSelfClosingElement(node)) return node.tagName.getText();
  return "";
}

function templateText(node: ts.TemplateExpression): string {
  let out = node.head.text;
  for (const span of node.templateSpans) {
    out += `{${span.expression.getText().replace(/\s+/g, " ")}}${span.literal.text}`;
  }
  return out;
}

/**
 * JSX 글자가 화면에 나오는 모양대로 읽는다. 같은 줄의 공백은 남고, 줄바꿈이 낀 공백은 사라진다.
 * `getText()`는 앞쪽 공백을 빼고 돌려줘서 `{name} 님`이 `{name}님`으로 읽혔다(#284).
 */
function jsxTextValue(node: ts.JsxText): string {
  const lines = node.getFullText().split("\n");
  return lines
    .map((line, index) => {
      let value = line;
      if (index > 0) value = value.trimStart();
      if (index < lines.length - 1) value = value.trimEnd();
      return value;
    })
    .filter((line) => line !== "")
    .join(" ");
}

/** 글자가 직접 들어 있는 JSX 요소를 한 덩어리 문구로 합친다. 변수 자리는 {이름}으로 남긴다. */
function composeChildren(children: readonly ts.JsxChild[]): string {
  let out = "";
  for (const child of children) {
    if (ts.isJsxText(child)) {
      out += jsxTextValue(child);
    } else if (ts.isJsxExpression(child)) {
      const expression = child.expression;
      if (!expression) continue;
      if (
        ts.isStringLiteral(expression) ||
        ts.isNoSubstitutionTemplateLiteral(expression)
      ) {
        out += expression.text;
      } else if (ts.isTemplateExpression(expression)) {
        out += templateText(expression);
      } else {
        out += `{${expression.getText().replace(/\s+/g, " ")}}`;
      }
    } else if (ts.isJsxElement(child)) {
      out += composeChildren(child.children);
    } else if (ts.isJsxFragment(child)) {
      out += composeChildren(child.children);
    }
  }
  return out;
}

function isComparison(node: ts.Node): boolean {
  const parent = node.parent;
  if (ts.isCaseClause(parent)) return true;
  if (!ts.isBinaryExpression(parent)) return false;
  const kind = parent.operatorToken.kind;
  return (
    kind === ts.SyntaxKind.EqualsEqualsEqualsToken ||
    kind === ts.SyntaxKind.ExclamationEqualsEqualsToken ||
    kind === ts.SyntaxKind.EqualsEqualsToken ||
    kind === ts.SyntaxKind.ExclamationEqualsToken
  );
}

interface Found extends Copy {
  /** 문구를 담은 변수나 함수의 이름. 토스트에 변수나 함수 호출로 넘긴 문구를 찾을 때 쓴다. */
  owners: string[];
}

/** 토스트에 넘긴 식에서 문구 상수(대문자 이름)와 호출한 함수의 이름을 모은다. */
function namesIn(expression: ts.Node, names: Set<string>) {
  if (
    ts.isIdentifier(expression) &&
    /^[A-Z][A-Z0-9_]+$/.test(expression.text)
  ) {
    names.add(expression.text);
  }
  if (
    ts.isCallExpression(expression) &&
    ts.isIdentifier(expression.expression)
  ) {
    names.add(expression.expression.text);
  }
  ts.forEachChild(expression, (child) => namesIn(child, names));
}

/**
 * 소스 한 개에서 한글 문구와 그 위치를 읽는다.
 * 토스트에 상수나 함수로 넘긴 문구는 `toastOwners`에 이름과 토스트 종류를 적어 둔다.
 * `toastUses`를 넘기면 이름마다 쓰인 토스트 종류를 모두 모은다(이름이 겹치는지 볼 때 쓴다).
 */
export function collectFromSource(
  file: string,
  source: string,
  scope: Pick<Scope, "bottomButtonLabelFiles" | "screenReaderProps">,
  toastOwners: Map<string, Where>,
  toastUses?: Map<string, Set<Where>>,
): Found[] {
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const lineOf = (position: number) =>
    sourceFile.getLineAndCharacterOfPosition(position).line + 1;
  const isLabelFile = scope.bottomButtonLabelFiles.includes(file);
  const found: Found[] = [];

  function describe(node: ts.Node): { where: Where; owners: string[] } {
    let where: Where = "text";
    const owners: string[] = [];
    let insideButton = false;

    for (
      let current: ts.Node | undefined = node.parent;
      current;
      current = current.parent
    ) {
      if (ts.isJsxElement(current)) {
        const tag = tagNameOf(current);
        if (tag === "Button") insideButton = true;
        if (tag === "BottomActionBarWithButtonAndShare" && where === "text") {
          where = "bottomButton";
        }
      } else if (ts.isJsxAttribute(current) && where === "text") {
        const attribute = current.name.getText();
        const owner = current.parent.parent;
        const tag =
          ts.isJsxOpeningElement(owner) || ts.isJsxSelfClosingElement(owner)
            ? owner.tagName.getText()
            : "";
        if (
          attribute === "aria-label" ||
          scope.screenReaderProps.includes(`${tag}.${attribute}`)
        ) {
          where = "ariaLabel";
        } else if (tag === "Modal" && MODAL_PROPS[attribute]) {
          where = MODAL_PROPS[attribute];
        } else if (
          tag === "ActionArea" &&
          attribute === "main" &&
          insideButton
        ) {
          where = "bottomButton";
        }
      } else if (ts.isCallExpression(current) && where === "text") {
        const callee = current.expression.getText();
        const match = /^toast\.(success|error|message)$/.exec(callee);
        if (match) where = `toast.${match[1]}` as Where;
      } else if (ts.isPropertyAssignment(current) && where === "text") {
        const name = current.name.getText().replace(/["']/g, "");
        if (name === "aria-label") where = "ariaLabel";
        else if (isLabelFile && name === "label") where = "bottomButton";
      } else if (
        (ts.isVariableDeclaration(current) ||
          ts.isFunctionDeclaration(current)) &&
        current.name
      ) {
        owners.push(current.name.getText());
      }
    }
    return { where, owners };
  }

  function add(
    node: ts.Node,
    text: string,
    position: number,
    span: [number, number] = [node.getStart(sourceFile), node.getEnd()],
  ) {
    const clean = normalize(text);
    if (!HANGUL.test(clean)) return;
    const { where, owners } = describe(node);
    const parent = node.parent;
    // title="..."와 title={"..."}를 같게 본다.
    const attribute = ts.isJsxExpression(parent) ? parent.parent : parent;
    const screenTitle =
      (ts.isJsxAttribute(attribute) &&
        attribute.name.getText() === "title" &&
        (
          attribute.parent.parent as ts.JsxOpeningLikeElement
        ).tagName.getText() === "Header") ||
      (ts.isJsxElement(parent) && /^h[12]$/.test(tagNameOf(parent)));
    const isAppName =
      file === APP_NAME_FILE &&
      ts.isPropertyAssignment(parent) &&
      parent.name.getText().replace(/["']/g, "") === "name";
    found.push({
      text: clean,
      file,
      line: lineOf(position),
      where: isAppName ? "pageTitle" : where,
      owners,
      start: span[0],
      end: span[1],
      ...(screenTitle ? { screenTitle: true } : {}),
    });
  }

  function visit(node: ts.Node) {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) return;
    if (ts.isTypeNode(node)) return;
    if (ts.isCallExpression(node)) {
      const callee = node.expression.getText();
      if (callee.startsWith("console.")) return;
      const match = /^toast\.(success|error|message)$/.exec(callee);
      const first = node.arguments[0];
      if (match && first) {
        const names = new Set<string>();
        namesIn(first, names);
        const kind = `toast.${match[1]}` as Where;
        for (const name of names) {
          toastOwners.set(name, kind);
          toastUses?.set(name, (toastUses.get(name) ?? new Set()).add(kind));
        }
      }
    }

    if (ts.isJsxElement(node) || ts.isJsxFragment(node)) {
      const direct = node.children.filter(
        (child) => ts.isJsxText(child) && normalize(child.getText()) !== "",
      );
      if (direct.length > 0) {
        const raw = direct[0].getText();
        const start =
          direct[0].getStart(sourceFile) +
          (raw.length - raw.trimStart().length);
        const children = node.children;
        add(direct[0], composeChildren(children), start, [
          start,
          children[children.length - 1].getEnd() -
            (children[children.length - 1].getFullText().length -
              children[children.length - 1].getFullText().trimEnd().length),
        ]);
      }
    }
    if (ts.isJsxText(node)) return;

    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      if (!isComparison(node)) add(node, node.text, node.getStart(sourceFile));
    } else if (ts.isTemplateExpression(node)) {
      add(node, templateText(node), node.getStart(sourceFile));
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return found;
}

function sourceFiles(root: string, dir: string): string[] {
  return readdirSync(join(root, dir), { withFileTypes: true }).flatMap(
    (entry) => {
      const path = `${dir}/${entry.name}`;
      if (entry.isDirectory()) return sourceFiles(root, path);
      const isSource = /\.(ts|tsx)$/.test(entry.name);
      const isTest = /\.(test|spec|stories)\.tsx?$/.test(entry.name);
      return isSource && !isTest ? [path] : [];
    },
  );
}

/**
 * index.html의 제목과 meta 내용을 읽는다. 태그 단위로 읽어서, 여러 줄에 걸친 meta도 속성 이름으로 자리를 정한다.
 * 줄 번호는 문구가 놓인 줄이다.
 */
export function collectFromHtml(file: string, source: string): Found[] {
  const found: Found[] = [];
  const lineAt = (index: number) => source.slice(0, index).split("\n").length;
  const push = (raw: string, index: number, where: Where) => {
    if (!HANGUL.test(raw)) return;
    found.push({
      text: normalize(raw),
      file,
      line: lineAt(index),
      where,
      owners: [],
    });
  };
  for (const match of source.matchAll(/<title>([^<]+)<\/title>/g)) {
    push(match[1], match.index + match[0].indexOf(match[1]), "pageTitle");
  }
  for (const match of source.matchAll(/<meta\b([^>]*)>/g)) {
    const content = /\bcontent="([^"]+)"/.exec(match[1]);
    if (!content) continue;
    const key = /\b(?:property|name)="([^"]+)"/.exec(match[1])?.[1] ?? "";
    push(
      content[1],
      match.index + match[0].indexOf(content[0]),
      PAGE_TITLE_META.has(key) ? "pageTitle" : "text",
    );
  }
  return found.sort((a, b) => a.line - b.line);
}

/** 검사 범위의 모든 파일을 읽는다. 문구와, 토스트에 이름으로 넘긴 상수와 함수를 함께 모은다. */
function collectAll(root: string, scope: Scope) {
  const toastOwners = new Map<string, Where>();
  const toastUses = new Map<string, Set<Where>>();
  const found: Found[] = [];

  for (const entry of scope.include) {
    const files = /\.\w+$/.test(entry) ? [entry] : sourceFiles(root, entry);
    for (const file of files) {
      if (scope.exclude.some((prefix) => file.startsWith(prefix))) continue;
      if (file.startsWith("src/ux-writing/")) continue;
      const source = readFileSync(join(root, file), "utf8");
      found.push(
        ...(file.endsWith(".html")
          ? collectFromHtml(file, source)
          : collectFromSource(file, source, scope, toastOwners, toastUses)),
      );
    }
  }
  return { found, toastOwners, toastUses };
}

/** 검사 범위의 모든 문구를 위치와 함께 읽는다. */
export function collectCopies(root: string, scope: Scope): Copy[] {
  const { found, toastOwners } = collectAll(root, scope);
  return found
    .filter(
      (copy) =>
        !scope.notCopy.some(
          (skip) =>
            skip.file === copy.file &&
            (skip.text === "*" || skip.text === copy.text),
        ),
    )
    .map(({ owners, ...copy }) => {
      const owner = owners.find((name) => toastOwners.has(name));
      const toast = owner ? toastOwners.get(owner) : undefined;
      return copy.where === "text" && toast ? { ...copy, where: toast } : copy;
    });
}

/**
 * 토스트에 이름으로 넘긴 상수와 함수 가운데, 이름만으로는 어느 선언인지 정할 수 없는 것.
 * 검사기는 토스트 종류를 이름으로 문구에 붙이므로, 같은 이름을 두 파일 이상에서 선언했거나
 * 같은 이름이 서로 다른 토스트 종류로 쓰이면 다른 문구의 자리를 잘못 정할 수 있다(PR #286 리뷰).
 * 그런 이름이 생기면 이름을 바꾸거나, 검사기가 선언을 따라가게 고친다.
 */
export function toastOwnerConflicts(
  found: Pick<Found, "file" | "owners">[],
  toastUses: Map<string, Set<Where>>,
): string[] {
  const declaredIn = new Map<string, Set<string>>();
  for (const copy of found) {
    for (const name of copy.owners) {
      if (!toastUses.has(name)) continue;
      declaredIn.set(name, (declaredIn.get(name) ?? new Set()).add(copy.file));
    }
  }
  const conflicts: string[] = [];
  for (const [name, kinds] of toastUses) {
    const files = declaredIn.get(name) ?? new Set<string>();
    if (kinds.size > 1 || files.size > 1) {
      conflicts.push(
        `${name}: 토스트 ${[...kinds].join(", ")} / 선언한 파일 ${[...files].join(", ")}`,
      );
    }
  }
  return conflicts;
}

/** 검사 범위에서 이름만으로 선언을 정할 수 없는 토스트 상수와 함수를 찾는다. */
export function findToastOwnerConflicts(root: string, scope: Scope): string[] {
  const { found, toastUses } = collectAll(root, scope);
  return toastOwnerConflicts(found, toastUses);
}
