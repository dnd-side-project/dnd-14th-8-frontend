import { Route, Routes } from "react-router";
import { MapDefaultPage } from "@/domains/location/pages/meetings/[meeting-id]/location";
import { NearbySearchPage } from "@/domains/location/pages/meetings/[meeting-id]/location/nearby/[coords]";
import { PlaceDetailPage } from "@/domains/location/pages/meetings/[meeting-id]/location/nearby/[coords]/places/[place-id]";
import { LocationMainPage } from "@/domains/location/pages/meetings/[meeting-id]/location/stations";
import { RouteDetailPage } from "@/domains/location/pages/meetings/[meeting-id]/location/stations/[station-id]/participants/[participant-id]";
import { DepartureListPage } from "@/domains/location/pages/meetings/[meeting-id]/location/votes";
import { DepartureEditPage } from "@/domains/location/pages/meetings/[meeting-id]/location/votes/[location-vote-id]";
import { DepartureEditSearchPage } from "@/domains/location/pages/meetings/[meeting-id]/location/votes/[location-vote-id]/search";
import { DepartureNewPage } from "@/domains/location/pages/meetings/[meeting-id]/location/votes/new";
import { DepartureNewSearchPage } from "@/domains/location/pages/meetings/[meeting-id]/location/votes/new/search";
import { MeetingGuard } from "@/domains/meeting/components/meeting-guard";
import { LandingPage } from "@/domains/meeting/pages";
import { MeetingEditParticipantsPage } from "@/domains/meeting/pages/meetings/[meeting-id]/[flow]/edit/participants";
import { NewMeetingPage } from "@/domains/meeting/pages/new";
import { ScheduleMainPage } from "@/domains/schedule/pages/meetings/[meeting-id]/schedule";
import { ScheduleEditDatesPage } from "@/domains/schedule/pages/meetings/[meeting-id]/schedule/edit/dates";
import { ScheduleVotesPage } from "@/domains/schedule/pages/meetings/[meeting-id]/schedule/votes";

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
        element={
          <MeetingGuard>
            <ScheduleMainPage />
          </MeetingGuard>
        }
      >
        <Route path="edit/dates" element={<ScheduleEditDatesPage />} />
      </Route>
      <Route
        path="/meetings/:meetingId/schedule/votes"
        element={<ScheduleVotesPage />}
      />

      <Route
        path="/meetings/:meetingId/location"
        element={
          <MeetingGuard>
            <MapDefaultPage />
          </MeetingGuard>
        }
      >
        <Route path="stations" element={<LocationMainPage />} />
        <Route
          path="stations/:stationId/participants/:participantId"
          element={<RouteDetailPage />}
        />
        <Route path="nearby/:coords" element={<NearbySearchPage />} />
        <Route
          path="nearby/:coords/places/:placeId"
          element={<PlaceDetailPage />}
        />
      </Route>

      <Route path="/meetings/:meetingId/location/votes">
        <Route index element={<DepartureListPage />} />
        <Route path="new">
          <Route index element={<DepartureNewPage />} />
          <Route path="search" element={<DepartureNewSearchPage />} />
        </Route>
        <Route path=":locationVoteId">
          <Route index element={<DepartureEditPage />} />
          <Route path="search" element={<DepartureEditSearchPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
