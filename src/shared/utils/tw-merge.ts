import { extendTailwindMerge } from "tailwind-merge";

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
    classGroups: { "text-style": textStyle },
    conflictingClassGroups: {
      "text-style": ["font-size", "leading", "font-weight", "tracking"],
    },
  },
});
