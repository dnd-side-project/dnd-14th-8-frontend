export function openKakaoAppScheme(text: string): boolean {
  if (!/Android|iPhone|iPad/i.test(navigator.userAgent)) {
    return false;
  }

  const encodedText = encodeURIComponent(text);

  // Android
  if (/Android/i.test(navigator.userAgent)) {
    window.location.href = `intent://send?text=${encodedText}#Intent;package=com.kakao.talk;scheme=kakaolink;end`;
    return true;
  }

  // iOS
  window.location.href = `kakaolink://send?text=${encodedText}`;
  return true;
}
