import { useMemo } from "react";
import { Outlet, useNavigate, useParams, useSearchParams } from "react-router";
import { ScheduleMainView } from "@/domains/schedule/views/schedule-main-view";
import { MobileLayout } from "@/shared/components/mobile-layout";

export function ScheduleMainPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { meetingId } = useParams() as { meetingId: string };

  const tab = useMemo(
    () => (searchParams.get("tab") === "optimal" ? "optimal" : "vote"),
    [searchParams],
  );

  const handleAddVote = () => {
    navigate(`/meetings/${meetingId}/schedule/votes`);
  };

  const handleTabChange = (nextTab: "optimal" | "vote") => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("tab", nextTab);
    setSearchParams(nextSearchParams, { replace: true });
  };

  return (
    <MobileLayout>
      <ScheduleMainView
        meetingId={meetingId}
        tab={tab}
        onAddVote={handleAddVote}
        onEditSchedule={() => navigate("edit/dates")}
        onParticipantEdit={() =>
          navigate(`/meetings/${meetingId}/schedule/edit/participants`)
        }
        onTabChange={handleTabChange}
      />
      <Outlet />
    </MobileLayout>
  );
}
