import { useNavigate } from "react-router";
import { ButtonSubStroke } from "@/domains/location/components/button-sub-stroke";
import { ItemSavedplace } from "@/domains/location/components/item-savedplace";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { PageHeader } from "@/shared/components/page-header";

export function DepartureListPage() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <section className="flex min-h-dvh flex-col px-5 pb-5">
        <PageHeader title="출발지 관리" onBack={() => navigate(-1)} />
        <ButtonSubStroke onClick={() => navigate("new")}>
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
