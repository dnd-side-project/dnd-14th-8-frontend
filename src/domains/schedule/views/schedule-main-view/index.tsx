import type { HTMLAttributes } from "react";
import { ScheduleMainHero } from "@/domains/schedule/components/schedule-main-hero";
import { ScheduleMainOptimalContent } from "@/domains/schedule/components/schedule-main-optimal-content";
import { ScheduleMainVoteContent } from "@/domains/schedule/components/schedule-main-vote-content";
import { BottomActionBarWithButtonAndShare } from "@/shared/components/bottom-action-bar-with-button-and-share";
import { FloatingScrollTop } from "@/shared/components/floating-scroll-top";
import { Tab } from "@/shared/components/tab";
import { cn } from "@/shared/utils/cn";

export interface ScheduleMainViewProps extends HTMLAttributes<HTMLDivElement> {
  meetingId: string;
  tab: "optimal" | "vote";
  onAddVote: () => void;
  onEditSchedule: () => void;
  onParticipantEdit: () => void;
  onTabChange: (tab: "optimal" | "vote") => void;
}

export function ScheduleMainView({
  className,
  meetingId,
  onAddVote,
  onEditSchedule,
  onParticipantEdit,
  onTabChange,
  tab,
  ...props
}: ScheduleMainViewProps) {
  return (
    <div
      className={cn("relative flex min-h-dvh flex-col bg-k-5", className)}
      {...props}
    >
      <ScheduleMainHero meetingId={meetingId} onEditSchedule={onEditSchedule} />

      <section className="sticky top-0 z-30 shrink-0 bg-k-5">
        <Tab
          tabs={[
            { id: "vote", label: "시간표" },
            { id: "optimal", label: "최적일정" },
          ]}
          activeTabId={tab}
          onTabChange={(id) =>
            onTabChange(id === "optimal" ? "optimal" : "vote")
          }
        />
      </section>

      <section className="flex min-h-0 flex-1 flex-col px-5 py-3 pb-[106px]">
        {tab === "vote" && (
          <ScheduleMainVoteContent onParticipantEdit={onParticipantEdit} />
        )}
        {tab === "optimal" && <ScheduleMainOptimalContent />}
      </section>

      <FloatingScrollTop top={4} className="bottom-[92px]" />

      <BottomActionBarWithButtonAndShare
        onClick={onAddVote}
        onShare={() => console.log("TODO: share")}
      >
        일정 추가하기
      </BottomActionBarWithButtonAndShare>
    </div>
  );
}
