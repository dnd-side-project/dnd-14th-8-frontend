export function shareKakao(requestUrl: string): boolean {
  if (!window.Kakao?.Share?.sendDefault) {
    return false;
  }

  try {
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "일정 조율하러 모여락!",
        description: "모임 일정과 장소를 쉽고 빠르게 정하는 모여락",
        imageUrl: "https://moyeorak.site/static/images/share.png",
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
