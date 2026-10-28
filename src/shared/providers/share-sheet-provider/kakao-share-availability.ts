export function canOpenKakaoShare(userAgent: string) {
  return /Android|iPhone|iPad|iPod/i.test(userAgent);
}
