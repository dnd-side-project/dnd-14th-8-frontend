import { Route, Routes } from "react-router";
import { LandingPage } from "@/domains/meeting/pages";
import { MeetingEditParticipantsPage } from "@/domains/meeting/pages/meetings/[meeting-id]/[flow]/edit/participants";
import { NewMeetingPage } from "@/domains/meeting/pages/new";
import { ScheduleMainPage } from "@/domains/schedule/pages/meetings/[meeting-id]/schedule";
import { ScheduleEditDatesPage } from "@/domains/schedule/pages/meetings/[meeting-id]/schedule/edit/dates";
import { ScheduleVotesPage } from "@/domains/schedule/pages/meetings/[meeting-id]/schedule/votes";
import { ScheduleVotesEditPage } from "@/domains/schedule/pages/meetings/[meeting-id]/schedule/votes/[schedule-vote-id]";

export function CustomRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/new/:flow" element={<NewMeetingPage />} />
      <Route
        path="/meetings/:meetingId/:flow/edit/participants"
        element={<MeetingEditParticipantsPage />}
      />
      <Route
        path="/meetings/:meetingId/schedule"
        element={<ScheduleMainPage />}
      >
        <Route path="edit/dates" element={<ScheduleEditDatesPage />} />
      </Route>
      <Route
        path="/meetings/:meetingId/schedule/votes"
        element={<ScheduleVotesPage />}
      />
    </Routes>
  );
}
