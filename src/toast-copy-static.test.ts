import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const srcDir = join(process.cwd(), "src");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx)$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)
      ? [path]
      : [];
  });
}

// toast.success/error/message( 뒤의 괄호 안을 끝까지 읽는다. 삼항식으로 고르는 문구도 함께 잡힌다.
function toastCallArguments(source: string) {
  const calls: string[] = [];
  for (const match of source.matchAll(/toast\.(?:success|error|message)\(/g)) {
    let depth = 1;
    let end = match.index + match[0].length;
    while (depth > 0 && end < source.length) {
      if (source[end] === "(") depth += 1;
      if (source[end] === ")") depth -= 1;
      end += 1;
    }
    calls.push(source.slice(match.index + match[0].length, end - 1));
  }
  return calls;
}

// 토스트로 쓰이는 문구 상수 (예: OUT_OF_SERVICE_AREA_MESSAGE)
function messageConstants(source: string) {
  return [...source.matchAll(/const \w+_MESSAGE\s*=\s*("[^"]*")/g)].map(
    (match) => match[1],
  );
}

function findToastCopies() {
  return sourceFiles(srcDir).flatMap((file) => {
    const source = readFileSync(file, "utf8");
    const path = relative(process.cwd(), file);
    return [...toastCallArguments(source), ...messageConstants(source)]
      .flatMap((text) => [...text.matchAll(/"([^"]*[가-힣][^"]*)"/g)])
      .map((match) => ({ path, copy: match[1] }));
  });
}

describe("toast copy", () => {
  it("finds the toast copies to check", () => {
    expect(findToastCopies().length).toBeGreaterThan(20);
  });

  it("does not end with a period", () => {
    const withPeriod = findToastCopies()
      .filter(({ copy }) => copy.trim().endsWith("."))
      .map(({ path, copy }) => `${path}: ${copy}`);

    expect(withPeriod).toEqual([]);
  });

  it("does not use a middle dot", () => {
    const withMiddleDot = findToastCopies()
      .filter(({ copy }) => copy.includes("·"))
      .map(({ path, copy }) => `${path}: ${copy}`);

    expect(withMiddleDot).toEqual([]);
  });
});
