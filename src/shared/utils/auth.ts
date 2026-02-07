const SESSION_KEY = "moyeorak.session";

export function getGuestId(): string {
  let guestId = localStorage.getItem(SESSION_KEY);

  if (!guestId) {
    guestId = self.crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, guestId);
  }

  return guestId;
}

export function setMeetingSession(meetingId: string, name: string): void {
  const key = `moyeorak.session.meetings.${meetingId}`;
  const data = { name };

  localStorage.setItem(key, JSON.stringify(data));
}
