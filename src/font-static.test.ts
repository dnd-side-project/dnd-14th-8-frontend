import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const fontImport =
  "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";

const appFontCss = readFileSync(
  join(process.cwd(), "src/font-system.css"),
  "utf8",
);
const packageCssPath = require.resolve(fontImport);
const fontFaces =
  readFileSync(packageCssPath, "utf8").match(/@font-face\s*{[^}]*}/g) ?? [];

function designSystemFirstFamily() {
  const styles = readFileSync(
    require.resolve("@moyeorak/design-system/styles.css"),
    "utf8",
  );
  const value = styles.match(/--fonts-sans:\s*([^;]+);/)?.[1] ?? "";
  return value.split(",")[0].trim();
}

describe("font static configuration", () => {
  it("imports the Pretendard variable dynamic subset from the npm package", () => {
    expect(appFontCss).toContain(`@import "${fontImport}";`);
    expect(appFontCss).not.toMatch(/@font-face/);
  });

  it("loads the font under the first family name the design system asks for", () => {
    const firstFamily = designSystemFirstFamily();
    const families = fontFaces.map((face) =>
      face
        .match(/font-family:\s*([^;]+);/)?.[1]
        .trim()
        .replaceAll("'", '"'),
    );

    expect(firstFamily).not.toBe("");
    expect(fontFaces.length).toBeGreaterThan(0);
    expect(new Set(families)).toEqual(new Set([firstFamily]));
  });

  it("points every font source in the package CSS to a file in the package", () => {
    const sources = fontFaces.flatMap((face) =>
      [...face.matchAll(/url\(([^)]+)\)/g)].map((match) => match[1]),
    );

    expect(sources.length).toBe(fontFaces.length);
    for (const source of sources) {
      expect(existsSync(join(dirname(packageCssPath), source))).toBe(true);
    }
  });
});
