import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { ButtonBottom } from "@/shared/components/button-bottom";
import { SearchIcon } from "@/shared/components/icons";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { PageHeader } from "@/shared/components/page-header";
import { TextField } from "@/shared/components/text-field";

export function DepartureNewPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [departure, setDeparture] = useState("");

  useEffect(() => {
    if (location.state?.address) {
      setDeparture(location.state.address);
    }
  }, [location.state]);

  return (
    <MobileLayout>
      <section className="flex min-h-dvh flex-col px-5 pb-5">
        <PageHeader title="출발지 추가" onBack={() => navigate(-1)} />
        <TextField
          label="이름"
          placeholder="이름을 입력해주세요"
          hidePlaceholderOnFocus={true}
          helperText="최대 4자까지 적을 수 있어요"
          maxLength={4}
          className="mt-3 mb-3"
        />
        <TextField
          label="출발지"
          placeholder="출발장소"
          value={departure}
          readOnly
          rightIcon={SearchIcon}
          onClick={() =>
            navigate("search", {
              state: { address: departure },
            })
          }
        />
        <div className="mt-auto">
          <ButtonBottom
            variant="black"
            // disabled={!canSubmit || isSubmitPending}
            // onClick={onSubmit}
          >
            모임 생성하기
          </ButtonBottom>
        </div>
      </section>
    </MobileLayout>
  );
}
