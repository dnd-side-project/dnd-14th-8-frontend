import { extendTailwindMerge } from "tailwind-merge";

const color = [
  "primary-main",
  "p-50",
  "p-100",
  "p-200",
  "p-300",
  "p-400",
  "p-450",
  "p-500",
  "p-600",
  "p-700",
  "p-800",
  "p-900",
  "sub-main",
  "sb-50",
  "sb-100",
  "sb-200",
  "sb-300",
  "sb-400",
  "sb-500",
  "sb-600",
  "sb-700",
  "k-5",
  "k-10",
  "k-50",
  "k-100",
  "k-200",
  "k-300",
  "k-400",
  "k-500",
  "k-600",
  "k-700",
  "k-750",
  "k-800",
  "k-900",
  "action-red",
  "action-green",
] as const;

// 디자인 시스템 Tailwind 플러그인의 글자 스타일. 함께 쓰면 뒤에 온 값만 남긴다.
const textStyle = [
  "head1",
  "head2",
  "head3",
  "head4",
  "title1",
  "title2",
  "title3",
  "body1",
  "body2",
  "body3",
  "body4",
  "body5",
  "caption1",
  "caption2",
  "caption3",
].map((name) => `textStyle_${name}`);

export const twMerge = extendTailwindMerge<"text-style">({
  extend: {
    theme: { color },
    classGroups: { "text-style": textStyle },
    conflictingClassGroups: {
      "text-style": ["font-size", "leading", "font-weight", "tracking"],
    },
  },
});
