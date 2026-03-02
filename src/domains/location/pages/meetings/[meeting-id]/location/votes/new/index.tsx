import { useEffect, useMemo } from "react";
import { Controller } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";
import { useCreateDepartureForm } from "@/domains/location/hooks/use-create-departure-form";
import { useGetMyParticipant } from "@/domains/schedule/hooks/use-get-my-participant";
import { useListParticipants } from "@/domains/schedule/hooks/use-list-participants";
import { ButtonBottom } from "@/shared/components/button-bottom";
import { SearchIcon } from "@/shared/components/icons";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { PageHeader } from "@/shared/components/page-header";
import { Select } from "@/shared/components/select";
import { TextField } from "@/shared/components/text-field";

interface VoteSearchLocationState {
  address?: string;
  coords?: [number, number];
  name?: string;
  selectedParticipantId?: string;
}

export function DepartureNewPage() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: VoteSearchLocationState | null };
  const { meetingId } = useParams() as { meetingId: string };

  const { data: myInfo } = useGetMyParticipant({ meetingId });
  const { data: participantsData } = useListParticipants({ meetingId });

  const {
    control,
    errors,
    canSubmit,
    isSubmitPending,
    maxNameLength,
    onSubmit,
    watch,
    setValue,
  } = useCreateDepartureForm(meetingId, {
    departureLocation: state?.address,
    departureLat: state?.coords ? String(state.coords[0]) : undefined,
    departureLng: state?.coords ? String(state.coords[1]) : undefined,
    participantName: state?.name,
    participantId: state?.selectedParticipantId,
  });

  useEffect(() => {
    if (state?.address) {
      setValue("departureLocation", state.address);
    }

    if (state?.coords && Array.isArray(state.coords)) {
      const [lat, lng] = state.coords;
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        setValue("departureLat", String(lat));
        setValue("departureLng", String(lng));
      }
    }

    if (state?.name) {
      setValue("participantName", state.name);
    }
    if (state?.selectedParticipantId) {
      setValue("participantId", state.selectedParticipantId);
    }
  }, [state, setValue]);

  const hasParticipants = useMemo(
    () =>
      myInfo?.scheduleVoteId !== null && myInfo?.scheduleVoteId !== undefined,
    [myInfo],
  );

  const participantOptions = useMemo(() => {
    if (!participantsData?.participants) return [];
    return participantsData.participants.map((p) => ({
      label: p.name,
      value: String(p.participantId),
    }));
  }, [participantsData]);
  const handleSearchNavigate = () => {
    const currentValues = watch();
    navigate("search", {
      state: {
        address: currentValues.departureLocation,
        selectedParticipantId: currentValues.participantId,
        name: currentValues.participantName,
      },
    });
  };

  return (
    <MobileLayout>
      <section className="flex min-h-dvh flex-col px-5 pb-5">
        <PageHeader title="출발지 추가" onBack={() => navigate(-1)} />

        <div className="mt-3 flex flex-col gap-6">
          {hasParticipants ? (
            <Controller
              control={control}
              name="participantId"
              render={({ field }) => (
                <Select
                  {...field}
                  label="이름"
                  placeholder="이름을 선택해주세요"
                  options={participantOptions}
                  className="mb-6"
                  onChange={(val) => {
                    field.onChange(val);
                    const label = participantOptions.find(
                      (opt) => opt.value === val,
                    )?.label;
                    setValue("participantName", label || "");
                  }}
                />
              )}
            />
          ) : (
            <Controller
              control={control}
              name="participantName"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="이름"
                  placeholder="이름을 입력해주세요"
                  maxLength={maxNameLength}
                  status={errors.participantName ? "error" : "default"}
                  onClear={() => field.onChange("")}
                  helperText={
                    errors.participantName?.message ||
                    `최대 ${maxNameLength}자까지 적을 수 있어요`
                  }
                />
              )}
            />
          )}

          <Controller
            control={control}
            name="departureLocation"
            render={({ field }) => (
              <TextField
                {...field}
                label="출발지"
                placeholder="출발장소"
                readOnly
                rightIcon={SearchIcon}
                onClick={handleSearchNavigate}
                status={errors.departureLocation ? "error" : "default"}
                helperText={errors.departureLocation?.message}
              />
            )}
          />
        </div>

        <div className="mt-auto">
          <ButtonBottom
            variant="black"
            disabled={!canSubmit || isSubmitPending}
            onClick={onSubmit}
          >
            출발지 추가하기
          </ButtonBottom>
        </div>
      </section>
    </MobileLayout>
  );
}
