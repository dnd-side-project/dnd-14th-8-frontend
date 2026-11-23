/**
 * 새 결과를 받는 동안 남겨 둔 이전 핀과 카드에 붙이는 클래스(#275). 0.2초 기다렸다가 0.2초 동안 흐려진다.
 * 바로 흐리게 하면 결과가 빨리 올 때(카카오 검색 중앙값 200ms) 진함, 흐림, 진함으로 깜빡여 보인다.
 * 새 결과를 받아 클래스를 떼면 전환도 함께 없어져, 새 핀과 카드는 바로 진하게 보인다.
 */
export const UPDATING_CLASS =
  "opacity-40 transition-opacity delay-200 duration-200 ease-linear";
