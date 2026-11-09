// 위치 권한을 거부했을 때 다시 허용하는 방법은 환경마다 다르다.
// 아이폰 카카오톡은 거부한 뒤 같은 화면에서는 다시 묻지 않고, 새로고침하면 다시 묻는다(실기기 확인, #236).
// 확인하지 못한 환경(안드로이드 카카오톡, 일반 브라우저)은 설정 안내를 그대로 둔다.
export function getLocationPermissionDeniedMessage(userAgent: string) {
  const isIos = /iPhone|iPad|iPod/i.test(userAgent);
  const isKakaoTalk = /KAKAOTALK/i.test(userAgent);

  return isIos && isKakaoTalk
    ? "새로고침한 뒤 다시 눌러 위치를 허용해주세요"
    : "설정에서 위치 권한을 허용해주세요";
}
