import { join } from "node:path";
import * as fontkit from "fontkit";

/**
 * 토스트 한 줄의 너비(px)를 글꼴 파일에 적힌 글자 폭으로 계산한다.
 *
 * 디자인 시스템 Toast의 글자는 body4(14px, 굵기 500, 자간 -0.01em)이고,
 * 양옆 여백이 16px씩, 아이콘(20px)과 간격(4px)이 붙는다.
 *
 * 서비스는 가변 글꼴을 굵기 500으로 그리지만, 계산은 같은 패키지의 굵기 500 일반 판으로 한다.
 * fontkit으로 가변 글꼴의 굵기를 바꿔 계산하면 브라우저에서 잰 값보다 최대 0.76px 넓게 나온다.
 *
 * 너비는 두 값으로 낸다. `narrow`는 자간을 모두 적용한 값이고 `wide`는 자간을 뺀 값이다.
 * 브라우저 8곳에서 잰 값은 모두 `narrow`와 0.06px 안으로 같았다(`ux-writing/toast-width-measured.json`).
 * 한 줄에 들어가는지는 `narrow`보다 넓은 `wide`로 본다.
 */
const FONT_SIZE = 14;
const LETTER_SPACING = -0.01 * FONT_SIZE;
const PADDING = 32;
const ICON_AND_GAP = 24;

let font: fontkit.Font | undefined;

function loadFont(root: string): fontkit.Font {
  font ??= fontkit.openSync(
    join(
      root,
      "node_modules/pretendard/dist/web/static/woff2/Pretendard-Medium.woff2",
    ),
  ) as fontkit.Font;
  return font;
}

export interface WidthRange {
  narrow: number;
  wide: number;
}

/** 토스트 글자만의 너비. */
export function toastTextWidthRange(root: string, text: string): WidthRange {
  const loaded = loadFont(root);
  const run = loaded.layout(text);
  const advance = run.positions.reduce(
    (sum, position) => sum + position.xAdvance,
    0,
  );
  const wide = (advance / loaded.unitsPerEm) * FONT_SIZE;
  return { narrow: wide + LETTER_SPACING * [...text].length, wide };
}

/** 토스트 상자에서 글자를 뺀 너비. 아이콘이 있는 토스트(성공, 실패)와 없는 토스트(안내)가 다르다. */
export const toastChromeWidth = (hasIcon: boolean) =>
  PADDING + (hasIcon ? ICON_AND_GAP : 0);

/** 어느 기기에서도 넘지 않은 토스트 전체 너비. */
export function toastWidth(root: string, text: string, hasIcon: boolean) {
  return toastTextWidthRange(root, text).wide + toastChromeWidth(hasIcon);
}
