const SESSION_KEY = "moyeorak.session";

// 브라우저에 저장된 UUID를 가져오거나 없으면 새로 생성하여 저장
export function getGuestId(): string {
  let guestId = localStorage.getItem(SESSION_KEY);

  if (!guestId) {
    guestId = self.crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, guestId);
  }

  return guestId;
}

// 특정 모임별 정보 저장
// @param meetingId 생성된 모임의 고유 ID
// @param name 해당 모임에서 사용할 사용자 이름
export function setMeetingSession(meetingId: string, name: string): void {
  const key = `moyeorak.session.meetings.${meetingId}`;
  const data = { name: name };

  localStorage.setItem(key, JSON.stringify(data));
}
