import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, it } from "vitest";
import {
  buildCreateDepartureRequest,
  isDuplicateDepartureError,
} from "@/domains/location/utils/create-departure-request";

const baseParams = {
  departureLat: "37.5145430",
  departureLng: "127.1058860",
  departureLocation: "서울시 송파구",
  guestId: "guest-uuid-123",
  hasMyLocationVote: false,
  meetingId: "meeting-abc",
  participantName: "친구",
};

function createAxiosError(code: string, status = 409) {
  const config = { headers: new AxiosHeaders() };
  return new AxiosError("Request failed", "ERR_BAD_REQUEST", config, null, {
    config,
    data: { code },
    headers: {},
    status,
    statusText: "Conflict",
  });
}

describe("buildCreateDepartureRequest", () => {
  it("기존 참여자를 선택하면 participantId를 숫자로 담고 localStorageKey는 보내지 않는다", () => {
    const request = buildCreateDepartureRequest({
      ...baseParams,
      participantId: "10",
    });

    expect(request.participantId).toBe(10);
    expect(request.localStorageKey).toBeUndefined();
  });

  it("참여자 미선택 + 내 출발지가 이미 있으면 대리 추가로 localStorageKey 없이 보낸다", () => {
    const request = buildCreateDepartureRequest({
      ...baseParams,
      hasMyLocationVote: true,
    });

    expect(request.participantId).toBeUndefined();
    expect(request.localStorageKey).toBeUndefined();
  });

  it("참여자 미선택 + 내 출발지가 없으면 본인 등록으로 localStorageKey를 보낸다", () => {
    const request = buildCreateDepartureRequest(baseParams);

    expect(request.participantId).toBeUndefined();
    expect(request.localStorageKey).toBe("guest-uuid-123");
  });

  it("participantId가 빈 문자열이면 미선택으로 처리한다", () => {
    const request = buildCreateDepartureRequest({
      ...baseParams,
      participantId: "",
    });

    expect(request.participantId).toBeUndefined();
    expect(request.localStorageKey).toBe("guest-uuid-123");
  });

  it("공통 필드(meetingId, 이름, 출발지 정보)를 그대로 담는다", () => {
    const request = buildCreateDepartureRequest(baseParams);

    expect(request.meetingId).toBe("meeting-abc");
    expect(request.participantName).toBe("친구");
    expect(request.departureLocation).toBe("서울시 송파구");
    expect(request.departureLat).toBe("37.5145430");
    expect(request.departureLng).toBe("127.1058860");
  });
});

describe("isDuplicateDepartureError", () => {
  it("E413(localStorageKey 중복) 응답이면 true", () => {
    expect(isDuplicateDepartureError(createAxiosError("E413"))).toBe(true);
  });

  it("E430(참여자 출발지 중복) 응답이면 true", () => {
    expect(isDuplicateDepartureError(createAxiosError("E430"))).toBe(true);
  });

  it("다른 에러 코드면 false", () => {
    expect(isDuplicateDepartureError(createAxiosError("E410", 404))).toBe(
      false,
    );
  });

  it("Axios 에러가 아니면 false", () => {
    expect(isDuplicateDepartureError(new Error("boom"))).toBe(false);
  });
});
