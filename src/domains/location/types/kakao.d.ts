export {};

declare global {
  interface Window {
    /**
     * Kakao Maps SDK 객체
     * Biome의 any 사용 제한을 이 파일에서만 허용합니다.
     */
    // biome-ignore lint/suspicious/noExplicitAny: Kakao SDK is external library
    kakao: any;
  }
}
