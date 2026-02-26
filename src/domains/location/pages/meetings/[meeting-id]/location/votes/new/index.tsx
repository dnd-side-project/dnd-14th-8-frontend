import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useGetMyParticipant } from "@/domains/schedule/hooks/use-get-my-participant";
import { useListParticipants } from "@/domains/schedule/hooks/use-list-participants";
import { ButtonBottom } from "@/shared/components/button-bottom";
import { SearchIcon } from "@/shared/components/icons";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { PageHeader } from "@/shared/components/page-header";
import { Select, type SelectOption } from "@/shared/components/select";
import { TextField } from "@/shared/components/text-field";
import { getGuestId } from "@/shared/utils/auth";

export function DepartureNewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { meetingId } = useParams() as { meetingId: string };
  const _localStorageKey = getGuestId();

  const [name, setName] = useState("");
  const [selectedParticipantId, setSelectedParticipantId] = useState("");
  const [departure, setDeparture] = useState("");

  const { data: myInfo } = useGetMyParticipant({ meetingId });
  const { data: participantsData } = useListParticipants({ meetingId }); // 참여자 이름 뽑기
  console.log(myInfo);
  console.log(participantsData);

  const hasParticipants = useMemo(
    () =>
      myInfo?.scheduleVoteId !== null && myInfo?.scheduleVoteId !== undefined,
    [myInfo],
  );

  const participantOptions = useMemo<SelectOption[]>(() => {
    if (!participantsData?.participants) return [];

    return participantsData.participants.map((p) => ({
      label: p.name,
      value: String(p.participantId), // value는 string이어야 하므로 형변환
    }));
  }, [participantsData]);

  useEffect(() => {
    if (location.state?.address) {
      setDeparture(location.state.address);
    }

    if (location.state?.selectedParticipantId) {
      setSelectedParticipantId(location.state.selectedParticipantId);
    }

    if (location.state?.name) {
      setName(location.state.name);
    }
  }, [location.state]);

  const handleSearchNavigate = () => {
    navigate("search", {
      state: {
        address: departure,
        selectedParticipantId,
        name,
      },
    });
  };

  return (
    <MobileLayout>
      <section className="flex min-h-dvh flex-col px-5 pb-5">
        <PageHeader title="출발지 추가" onBack={() => navigate(-1)} />
        {hasParticipants ? (
          <Select
            label="이름"
            placeholder="이름을 선택해주세요"
            options={participantOptions}
            value={selectedParticipantId}
            onChange={(val) => setSelectedParticipantId(val)}
            className="mt-3 mb-12"
          />
        ) : (
          <TextField
            label="이름"
            placeholder="이름을 입력해주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            hidePlaceholderOnFocus={true}
            helperText="최대 4자까지 적을 수 있어요"
            maxLength={4}
            className="mt-3 mb-6"
          />
        )}
        <TextField
          label="출발지"
          placeholder="출발장소"
          value={departure}
          readOnly
          rightIcon={SearchIcon}
          onClick={handleSearchNavigate}
        />
        <div className="mt-auto">
          <ButtonBottom
            variant="black"
            // disabled={!canSubmit || isSubmitPending}
            // onClick={onSubmit}
          >
            출발지 추가하기
          </ButtonBottom>
        </div>
      </section>
    </MobileLayout>
  );
}
