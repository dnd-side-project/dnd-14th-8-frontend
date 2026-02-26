import { useNavigate, useParams } from "react-router";
import { ButtonSubStroke } from "@/domains/location/components/button-sub-stroke";
import { ItemSavedplace } from "@/domains/location/components/item-savedplace";
import { useGetMyParticipant } from "@/domains/schedule/hooks/use-get-my-participant";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { PageHeader } from "@/shared/components/page-header";

export function DepartureListPage() {
  const navigate = useNavigate();
  const { meetingId } = useParams() as { meetingId: string };
  const { data: myInfo } = useGetMyParticipant({ meetingId });
  console.log(myInfo);

  return (
    <MobileLayout>
      <section className="flex min-h-dvh flex-col px-5 pb-5">
        <PageHeader title="출발지 관리" onBack={() => navigate(-1)} />
        <ButtonSubStroke onClick={() => navigate("new")} className="mt-3 mb-3">
          출발지 추가하기
        </ButtonSubStroke>
        <ItemSavedplace
          name="김혜인"
          location="홍대입구역"
          address="서울특별시 마포구 서교동"
          onEdit={() => navigate(":locationVoteId")}
          // onDelete={fn()}
        />
      </section>
    </MobileLayout>
  );
}
