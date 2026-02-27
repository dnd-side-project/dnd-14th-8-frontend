export function shareKakao(requestUrl: string): boolean {
  if (!window.Kakao?.Share?.sendDefault) {
    return false;
  }

  try {
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "즐겁고 효율적인 모임 준비 할 사람, 여기 모여락!",
        description:
          "모임원들의 일정 조율과 중간 지점 탐색을 한 번에 할 수 있어요",
        imageUrl: "https://moyeorak.site/static/images/share-1.png",
        link: { mobileWebUrl: requestUrl, webUrl: requestUrl },
      },
      buttons: [
        {
          title: "웹으로 보기",
          link: { mobileWebUrl: requestUrl, webUrl: requestUrl },
        },
      ],
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
