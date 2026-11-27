/**
 * 후보 문구를 규칙에 대 본다. 문구를 고르기 전에 대안마다 돌려 결과를 함께 보여 준다.
 * 실행: pnpm ux-writing:try --where toast.error "후보 1" "후보 2"
 * --where는 문구가 놓일 자리다(ux-writing/rules.json의 legend.where). 빼면 "text"(그 밖의 문구)다.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { checkCopies, type Rule, type RuleException } from "./check";
import type { Copy, Where } from "./collect";
import { toastWidth } from "./toast-width";

const root = process.cwd();
const args = process.argv.slice(2).filter((arg) => arg !== "--");
const whereIndex = args.indexOf("--where");
const where = (whereIndex >= 0 ? args[whereIndex + 1] : "text") as Where;
const candidates =
  whereIndex >= 0
    ? args.filter(
        (_, index) => index !== whereIndex && index !== whereIndex + 1,
      )
    : args;
if (candidates.length === 0) {
  console.error(
    '사용: pnpm ux-writing:try --where toast.error "후보 1" "후보 2"',
  );
  process.exit(1);
}

const { rules, exceptions, legend } = JSON.parse(
  readFileSync(join(root, "ux-writing/rules.json"), "utf8"),
) as {
  rules: Rule[];
  exceptions: RuleException[];
  legend: { where: Record<string, string> };
};
if (!legend.where[where]) {
  console.error(
    `--where는 다음 가운데 하나여야 합니다: ${Object.keys(legend.where).join(", ")}`,
  );
  process.exit(1);
}
const byId = new Map(rules.map((rule) => [rule.id, rule]));

console.log(`자리: ${where} (${legend.where[where]})`);
candidates.forEach((text, index) => {
  const copy: Copy = { text, where, file: "후보", line: index + 1 };
  const violations = checkCopies(rules, [copy], exceptions, root);
  console.log(`\n${index + 1}. "${text}"`);
  if (where.startsWith("toast.")) {
    const width = toastWidth(root, text, where !== "toast.message");
    console.log(
      `   토스트 너비 ${width.toFixed(1)}px / 335px${width > 335 ? " (넘침)" : ""}`,
    );
  }
  if (violations.length === 0) console.log("   자동 검사: 위반 없음");
  for (const violation of violations) {
    const rule = byId.get(violation.rule);
    const guide = rule?.rule ?? `"${rule?.avoid}" 대신 "${rule?.use}"`;
    const fix = violation.fix ? ` → "${violation.fix}"` : "";
    console.log(`   위반 ${violation.rule}: ${guide}${fix}`);
  }
});
const manual = rules.filter(
  (rule) => rule.auto === "none" || rule.auto === "partial",
);
console.log(
  `\n자동 검사가 다 보지 못하는 규칙은 직접 확인한다: ${manual.map((rule) => rule.id).join(", ")}`,
);
