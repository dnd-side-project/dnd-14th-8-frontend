import { Route, Routes } from "react-router";
import { LandingPage } from "@/domains/meeting/pages";
import { NewMeetingPage } from "@/domains/meeting/pages/new";
import { ScheduleMainPage } from "@/domains/schedule/pages/meetings/[meeting-id]/schedule";
import { ScheduleEditDatesPage } from "@/domains/schedule/pages/meetings/[meeting-id]/schedule/edit/dates";
import { ScheduleEditParticipantsPage } from "@/domains/schedule/pages/meetings/[meeting-id]/schedule/edit/participants";
import { ScheduleVotesPage } from "@/domains/schedule/pages/meetings/[meeting-id]/schedule/votes";

export function CustomRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/new" element={<NewMeetingPage />} />
      <Route
        path="/meetings/:meetingId/schedule"
        element={<ScheduleMainPage />}
      >
        <Route path="edit/dates" element={<ScheduleEditDatesPage />} />
      </Route>
      <Route
        path="/meetings/:meetingId/schedule/edit/participants"
        element={<ScheduleEditParticipantsPage />}
      />
      <Route
        path="/meetings/:meetingId/schedule/votes"
        element={<ScheduleVotesPage />}
      />
    </Routes>
  );
}
