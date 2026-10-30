import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const srcDir = join(process.cwd(), "src");

// 토스트는 디자인 시스템 Toast로 교체할 때, 관리자 화면은 범위 밖이라 기존 체계를 유지한다.
const allowed = [
  "src/domains/admin/",
  "src/shared/components/toast/index.tsx",
  "src/shared/utils/tw-merge.ts",
];

const legacyColorClass =
  /(?<![\w-])(?:[\w[\]&-]+:)*(?:text|bg|border(?:-[trblxy])?|caret|fill|stroke|ring|outline|divide)-(?:k-\d+|p-\d+|primary-main|sub-main|action-(?:red|green))(?![\w-])/g;
const legacyColorVariable = /var\(--color-(?:k|p|sb|red|green)[\w-]*\)/g;
const legacyTextClass =
  /(?<![\w-])text-(?:h[1-3]|t[1-2]|b[1-5]|c[1-3])(?![\w-])/g;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx)$/.test(entry.name) ? [path] : [];
  });
}

function findLegacyUsages(pattern: RegExp) {
  return sourceFiles(srcDir).flatMap((file) => {
    const path = relative(process.cwd(), file);
    if (allowed.some((prefix) => path.startsWith(prefix))) return [];
    const matches = readFileSync(file, "utf8").match(pattern) ?? [];
    return matches.map((match) => `${path}: ${match}`);
  });
}

describe("design system foundations", () => {
  it("uses semantic color tokens instead of palette classes", () => {
    expect(findLegacyUsages(legacyColorClass)).toEqual([]);
  });

  it("uses semantic color variables instead of palette variables", () => {
    expect(findLegacyUsages(legacyColorVariable)).toEqual([]);
  });

  it("uses design system text styles instead of legacy text classes", () => {
    expect(findLegacyUsages(legacyTextClass)).toEqual([]);
  });
});
