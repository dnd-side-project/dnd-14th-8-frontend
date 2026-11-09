import { describe, expect, it } from "vitest";
import { getLocationPermissionDeniedMessage } from "@/domains/location/utils/location-permission-message";

const IOS_KAKAOTALK =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 KAKAOTALK/25.7.0 (INAPP)";
const ANDROID_KAKAOTALK =
  "Mozilla/5.0 (Linux; Android 14; SM-S921N Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/131.0.0.0 Mobile Safari/537.36;KAKAOTALK 2511020";
const IOS_SAFARI =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1";
const DESKTOP_CHROME =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

describe("getLocationPermissionDeniedMessage", () => {
  it("아이폰 카카오톡은 새로고침 뒤 다시 누르라고 안내한다", () => {
    expect(getLocationPermissionDeniedMessage(IOS_KAKAOTALK)).toBe(
      "새로고침한 뒤 다시 눌러 위치를 허용해주세요",
    );
  });

  it.each([
    ["안드로이드 카카오톡", ANDROID_KAKAOTALK],
    ["아이폰 사파리", IOS_SAFARI],
    ["데스크톱 크롬", DESKTOP_CHROME],
  ])("%s는 확인하지 못해 설정 안내를 그대로 둔다", (_, userAgent) => {
    expect(getLocationPermissionDeniedMessage(userAgent)).toBe(
      "설정에서 위치 권한을 허용해주세요",
    );
  });
});
