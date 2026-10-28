import { describe, expect, it } from "vitest";
import { hasVoteId } from "@/domains/meeting/utils/vote-id";

describe("hasVoteId", () => {
  it("양수 id는 등록으로 본다", () => {
    expect(hasVoteId(12)).toBe(true);
  });

  it("null은 미등록으로 본다", () => {
    expect(hasVoteId(null)).toBe(false);
  });

  it("값이 없으면 미등록으로 본다", () => {
    expect(hasVoteId(undefined)).toBe(false);
  });

  it("0은 서버의 미등록 sentinel이므로 등록으로 치지 않는다", () => {
    expect(hasVoteId(0)).toBe(false);
  });

  it("음수는 등록으로 치지 않는다", () => {
    expect(hasVoteId(-1)).toBe(false);
  });

  it("NaN은 등록으로 치지 않는다", () => {
    expect(hasVoteId(Number.NaN)).toBe(false);
  });
});
