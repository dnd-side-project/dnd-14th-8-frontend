import { describe, expect, it } from "vitest";
import {
  getParticipantCountHelperText,
  getSelectableParticipantCountMin,
} from "@/domains/meeting/utils/participant-count-limit";

describe("getSelectableParticipantCountMin", () => {
  it("never goes below the smallest meeting size", () => {
    expect(getSelectableParticipantCountMin(0)).toBe(2);
    expect(getSelectableParticipantCountMin(1)).toBe(2);
    expect(getSelectableParticipantCountMin(2)).toBe(2);
  });

  it("follows the number of people who joined", () => {
    expect(getSelectableParticipantCountMin(4)).toBe(4);
  });
});

describe("getParticipantCountHelperText", () => {
  it("shows the full range while nothing is blocked", () => {
    expect(getParticipantCountHelperText(2)).toBe(
      "2명부터 20명까지 고를 수 있어요",
    );
  });

  it("explains the limit when joined people block some counts", () => {
    expect(getParticipantCountHelperText(4)).toBe(
      "지금 참여한 4명부터 20명까지 고를 수 있어요",
    );
  });
});
