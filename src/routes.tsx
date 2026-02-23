import { Route, Routes } from "react-router";
import { LandingPage } from "@/domains/meeting/pages";
import { EditParticipantCountPage } from "@/domains/meeting/pages/edit-participant-count";
import { NewMeetingPage } from "@/domains/meeting/pages/new";
import { ScheduleMainPage } from "@/domains/schedule/pages/meetings/[meeting-id]/schedule";
import { ScheduleEditDatesPage } from "@/domains/schedule/pages/meetings/[meeting-id]/schedule/edit/dates";
import { ScheduleVotesNewPage } from "@/domains/schedule/pages/meetings/[meeting-id]/schedule/votes";
import { ScheduleVotesEditPage } from "@/domains/schedule/pages/meetings/[meeting-id]/schedule/votes/[schedule-vote-id]";

export function CustomRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/new" element={<NewMeetingPage />} />
      <Route
        path="/meetings/:meetingId/:flow/edit/participantCount"
        element={<EditParticipantCountPage />}
      />
      <Route
        path="/meetings/:meetingId/schedule"
        element={<ScheduleMainPage />}
      >
        <Route path="edit/dates" element={<ScheduleEditDatesPage />} />
      </Route>
      <Route
        path="/meetings/:meetingId/schedule/votes"
        element={<ScheduleVotesNewPage />}
      />
      <Route
        path="/meetings/:meetingId/schedule/votes/:scheduleVoteId"
        element={<ScheduleVotesEditPage />}
      />
    </Routes>
  );
}
