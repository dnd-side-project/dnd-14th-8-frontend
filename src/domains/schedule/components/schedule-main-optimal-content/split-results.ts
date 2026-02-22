import type { ScheduleVoteResult } from "@/domains/meeting/types/meeting-api-types";

export const splitResults = (results: ScheduleVoteResult[]) => {
  if (results.length <= 3) {
    return [results, []];
  }

  const count = Math.min(results.length, 3);
  const item = results[count - 1];
  return [
    results.filter((result) => result.voteCount >= item.voteCount),
    results.filter((result) => result.voteCount < item.voteCount),
  ];
};
