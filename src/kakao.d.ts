declare global {
  interface Window {
    // Kakao Maps SDK v2
    kakao: unknown;

    // Kakao JS SDK (Share API)
    Kakao?: {
      Share: {
        // ref. https://developers.kakao.com/tool/demo/message/kakaolink?method=send&default_template=feed
        sendDefault: (payload: Record<string, unknown>) => void;
      };
    };
  }
}

export {};
