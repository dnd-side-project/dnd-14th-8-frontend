import { describe, expect, it } from "vitest";
import { canOpenKakaoShare } from "@/shared/providers/share-sheet-provider/kakao-share-availability";

describe("canOpenKakaoShare", () => {
  it("allows mobile browsers to launch KakaoTalk share", () => {
    const iphoneSafari =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
    const androidChrome =
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";

    expect(canOpenKakaoShare(iphoneSafari)).toBe(true);
    expect(canOpenKakaoShare(androidChrome)).toBe(true);
  });

  it("does not try KakaoTalk app share from desktop browsers", () => {
    const desktopChrome =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

    expect(canOpenKakaoShare(desktopChrome)).toBe(false);
  });
});
