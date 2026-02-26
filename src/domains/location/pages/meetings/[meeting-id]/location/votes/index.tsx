import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ButtonSubStroke } from "@/domains/location/components/button-sub-stroke";
import { DepartureItem } from "@/domains/location/components/departure-item";
import { useDeleteDeparture } from "@/domains/location/hooks/use-delete-departure";
import {
  getDeparturesQueryKey,
  useGetDepartures,
} from "@/domains/location/hooks/use-get-departures";
import { ButtonBottom } from "@/shared/components/button-bottom";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { Modal } from "@/shared/components/modal";
import { PageHeader } from "@/shared/components/page-header";
import { toast } from "@/shared/components/toast";

export function DepartureListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { meetingId } = useParams() as { meetingId: string };

  const [selectedLocationVoteId, setSelectedLocationVoteId] = useState<
    number | null
  >(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: departures, isLoading } = useGetDepartures({ meetingId });
  const { mutate: deleteDeparture } = useDeleteDeparture();

  const handleGoToResult = () => {
    if ((departures?.length ?? 0) < 2) {
      toast.error("최소 2개 이상의 출발지가 필요해요");
      return;
    }

    // 메인 페이지로 이동 - 해당 페이지에서 useGetMidpointRecommendations를 호출하여 데이터 보여주기
    navigate(`/meetings/${meetingId}/location/stations`);
  };

  const handleDelete = () => {
    if (selectedLocationVoteId === null) return;

    deleteDeparture(
      { locationVoteId: selectedLocationVoteId },
      {
        onSuccess: () => {
          // 목록 새로고침
          queryClient.invalidateQueries({
            queryKey: getDeparturesQueryKey({ meetingId }),
          });
          setIsDeleteModalOpen(false);
          toast.success("출발지가 삭제되었어요");
        },
      },
    );
  };

  if (isLoading) return null;

  return (
    <MobileLayout>
      <section className="flex min-h-dvh flex-col px-5 pb-5">
        <PageHeader title="출발지 관리" onBack={() => navigate(-1)} />
        <ButtonSubStroke onClick={() => navigate("new")} className="mt-3 mb-3">
          출발지 추가하기
        </ButtonSubStroke>

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

        <div className="mt-auto">
          <ButtonBottom variant="black" onClick={handleGoToResult}>
            중간지점 결과 보러가기
          </ButtonBottom>
        </div>
      </section>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="해당 출발지를 삭제할까요?"
        caption="삭제 후에는 복구할 수 없어요."
        secondaryButton={{
          label: "취소",
          color: "gray",
          onClick: () => setIsDeleteModalOpen(false),
        }}
        primaryButton={{
          label: "삭제하기",
          color: "blue",
          onClick: handleDelete,
        }}
      />
    </MobileLayout>
  );
}
