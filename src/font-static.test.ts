import { existsSync, readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const fontCss = readFileSync(
  join(process.cwd(), "src/font-system.css"),
  "utf8",
);
const fontFaces = fontCss.match(/@font-face\s*{[^}]*}/g) ?? [];

function designSystemFirstFamily() {
  const stylesPath = createRequire(import.meta.url).resolve(
    "@moyeorak/design-system/styles.css",
  );
  const styles = readFileSync(stylesPath, "utf8");
  const value = styles.match(/--fonts-sans:\s*([^;]+);/)?.[1] ?? "";
  return value.split(",")[0].trim();
}

describe("font static configuration", () => {
  it("loads the font under the first family name the design system asks for", () => {
    const firstFamily = designSystemFirstFamily();
    const families = fontFaces.map((face) =>
      face.match(/font-family:\s*([^;]+);/)?.[1].trim(),
    );

    expect(firstFamily).not.toBe("");
    expect(fontFaces.length).toBeGreaterThan(0);
    expect(new Set(families)).toEqual(new Set([firstFamily]));
  });

  it("points every font source to a file in public/fonts and leaves no unused file", () => {
    const sources = fontFaces.flatMap((face) =>
      [...face.matchAll(/url\("([^"]+)"\)/g)].map((match) => match[1]),
    );
    const files = readdirSync(join(process.cwd(), "public/fonts")).filter(
      (file) => file.endsWith(".woff2"),
    );

    expect(sources.length).toBe(fontFaces.length);
    for (const source of sources) {
      expect(source.startsWith("/fonts/")).toBe(true);
      expect(existsSync(join(process.cwd(), "public", source))).toBe(true);
    }
    expect(new Set(sources)).toEqual(new Set(files.map((f) => `/fonts/${f}`)));
  });
});
