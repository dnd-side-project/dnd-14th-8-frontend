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
const PAGE_TITLE = /^모여락 \|/;
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
 * 토스트에 변수로 넘긴 문구는 `toastVariables`에 이름과 토스트 종류를 적어 둔다.
 */
export function collectFromSource(
  file: string,
  source: string,
  scope: Pick<Scope, "bottomButtonLabelFiles" | "screenReaderProps">,
  toastOwners: Map<string, Where>,
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
    const screenTitle =
      (ts.isJsxAttribute(parent) &&
        parent.name.getText() === "title" &&
        (parent.parent.parent as ts.JsxOpeningLikeElement).tagName.getText() ===
          "Header") ||
      (ts.isJsxElement(parent) && /^h[12]$/.test(tagNameOf(parent)));
    found.push({
      text: clean,
      file,
      line: lineOf(position),
      where: PAGE_TITLE.test(clean) ? "pageTitle" : where,
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
        for (const name of names) {
          toastOwners.set(name, `toast.${match[1]}` as Where);
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

/** index.html의 제목과 meta 내용을 읽는다. */
function collectFromHtml(file: string, source: string): Found[] {
  const found: Found[] = [];
  const lines = source.split("\n");
  lines.forEach((line, index) => {
    const match =
      /<title>([^<]+)<\/title>/.exec(line) ?? /content="([^"]+)"/.exec(line);
    if (!match || !HANGUL.test(match[1])) return;
    const text = normalize(match[1]);
    found.push({
      text,
      file,
      line: index + 1,
      where: PAGE_TITLE.test(text) ? "pageTitle" : "text",
      owners: [],
    });
  });
  return found;
}

/** 검사 범위의 모든 문구를 위치와 함께 읽는다. */
export function collectCopies(root: string, scope: Scope): Copy[] {
  const toastOwners = new Map<string, Where>();
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
          : collectFromSource(file, source, scope, toastOwners)),
      );
    }
  }

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
