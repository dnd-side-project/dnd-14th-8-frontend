import { ActionArea, Button, Header, Modal } from "@moyeorak/design-system";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { DepartureItem } from "@/domains/location/components/departure-item";
import { LOCATION_DEPARTURE_LIST_LIVE_QUERY_OPTIONS } from "@/domains/location/constants/live-query-options";
import { useDeleteDeparture } from "@/domains/location/hooks/use-delete-departure";
import {
  getDeparturesQueryKey,
  useGetDepartures,
} from "@/domains/location/hooks/use-get-departures";
import { getMidpointRecommendationsQueryKey } from "@/domains/location/hooks/use-get-midpoint-recommendations";
import { hasEnoughDepartures } from "@/domains/location/utils/insufficient-departures";
import { getMyParticipantQueryKey } from "@/domains/schedule/hooks/use-get-my-participant";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { toast } from "@/shared/components/toast";
import { getGuestId } from "@/shared/utils/auth";

export function DepartureListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { meetingId } = useParams() as { meetingId: string };

  const [selectedLocationVoteId, setSelectedLocationVoteId] = useState<
    number | null
  >(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: departures, isLoading } = useGetDepartures({
    meetingId,
    ...LOCATION_DEPARTURE_LIST_LIVE_QUERY_OPTIONS,
  });
  const { mutate: deleteDeparture } = useDeleteDeparture();

  const handleDelete = () => {
    if (selectedLocationVoteId === null) return;

    deleteDeparture(
      { locationVoteId: selectedLocationVoteId },
      {
        onSuccess: () => {
          // 목록 새로고침. 내 참여 정보도 다시 받는다. 내 출발지를 지웠는데
          // 예전 locationVoteId가 캐시(30초)에 남으면, 장소 화면이 "출발지 추가하기"
          // 대신 "출발지 관리하기"를 띄운다. 출발지 추가 화면과 같은 처리다.
          void Promise.all([
            queryClient.invalidateQueries({
              queryKey: getDeparturesQueryKey({ meetingId }),
            }),
            queryClient.invalidateQueries({
              queryKey: getMidpointRecommendationsQueryKey({ meetingId }),
            }),
            queryClient.invalidateQueries({
              queryKey: getMyParticipantQueryKey({
                localStorageKey: getGuestId(),
                meetingId,
              }),
            }),
          ]);
          setIsDeleteModalOpen(false);
          toast.success("출발지가 삭제되었어요");
        },
      },
    );
  };

  if (isLoading) return null;

  // 출발지가 2개 미만이면 결과 화면에 가도 "출발지가 하나 더 필요해요"만 보인다.
  // 목록을 5초마다 다시 받으므로 다른 참여자가 추가하면 버튼이 저절로 켜진다.
  const canViewMidpoint = hasEnoughDepartures(departures?.length ?? 0);

  return (
    <MobileLayout>
      <section className="flex min-h-dvh flex-col px-5">
        <Header
          title="출발지 관리"
          onBack={() => navigate(-1)}
          className="-mx-5 w-auto"
        />
        <Button
          variant="outline"
          size="lg"
          display="full"
          onClick={() => navigate("new")}
          className="mt-3 mb-3"
        >
          출발지 추가하기
        </Button>

        <div className="flex flex-col">
          {departures?.map((item) => (
            <DepartureItem
              key={item.locationVoteId}
              item={item}
              onEdit={() => navigate(`${item.locationVoteId}`)}
              onDelete={() => {
                setSelectedLocationVoteId(item.locationVoteId);
                setIsDeleteModalOpen(true);
              }}
            />
          ))}
        </div>

        <ActionArea
          type="single"
          className="-mx-5 mt-auto w-auto"
          main={
            <Button
              size="xl"
              display="full"
              variant="default"
              disabled={!canViewMidpoint}
              onClick={() =>
                navigate(`/meetings/${meetingId}/location/stations`)
              }
            >
              중간지점 결과 보러 가기
            </Button>
          }
        />
      </section>

      <Modal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="해당 출발지를 삭제할까요?"
        body="삭제 후에는 복구할 수 없어요"
        mainLabel="삭제"
        onMain={handleDelete}
        alternativeLabel="취소"
        onAlternative={() => setIsDeleteModalOpen(false)}
      />
    </MobileLayout>
  );
}
