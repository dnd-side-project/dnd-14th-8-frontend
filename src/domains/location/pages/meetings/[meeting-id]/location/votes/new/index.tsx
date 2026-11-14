import {
  ActionArea,
  Button,
  FieldButton,
  Header,
  TextField,
} from "@moyeorak/design-system";
import { useEffect, useMemo } from "react";
import { Controller } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";
import { useCreateDepartureForm } from "@/domains/location/hooks/use-create-departure-form";
import { useGetMyParticipant } from "@/domains/schedule/hooks/use-get-my-participant";
import { useListParticipants } from "@/domains/schedule/hooks/use-list-participants";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { Select } from "@/shared/components/select";
import {
  useFlowEntryIndex,
  useFlowReturn,
} from "@/shared/hooks/use-flow-return";

interface VoteSearchLocationState {
  address?: string;
  // 검색에서 장소를 골랐을 때만 있다. 출발지 칸 둘째 줄이다.
  departureAddress?: string;
  coords?: [number, number];
  name?: string;
  entryIdx?: number | null;
  selectedParticipantId?: string;
}

export function DepartureNewPage() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: VoteSearchLocationState | null };
  const { meetingId } = useParams() as { meetingId: string };

  const entryIdx = useFlowEntryIndex(state?.entryIdx);
  const leaveForm = useFlowReturn({
    entryIdx,
    fallbackPath: `/meetings/${meetingId}/location/stations`,
  });

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
  } = useCreateDepartureForm(
    meetingId,
    {
      departureLocation: state?.address,
      departureAddress: state?.departureAddress,
      departureLat: state?.coords ? String(state.coords[0]) : undefined,
      departureLng: state?.coords ? String(state.coords[1]) : undefined,
      participantName: state?.name,
      participantId: state?.selectedParticipantId,
    },
    entryIdx,
  );

  useEffect(() => {
    if (state?.address) {
      setValue("departureLocation", state.address);
      setValue("departureAddress", state.departureAddress ?? "");
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
        entryIdx,
      },
    });
  };

  return (
    <MobileLayout>
      <section className="flex min-h-dvh flex-col px-5">
        <Header
          title="출발지 추가"
          onBack={leaveForm}
          className="-mx-5 w-auto"
        />

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
                  autoComplete="off"
                  maxCharacterCount={maxNameLength}
                  onClear={() => field.onChange("")}
                  helperText={`최대 ${maxNameLength}자까지 입력할 수 있어요`}
                  errorMessage={errors.participantName?.message}
                />
              )}
            />
          )}

          <Controller
            control={control}
            name="departureLocation"
            render={({ field }) => (
              <FieldButton
                label="출발지"
                placeholder="주소를 검색해주세요"
                value={field.value}
                description={watch("departureAddress") || undefined}
                onClick={handleSearchNavigate}
              />
            )}
          />
        </div>

        <ActionArea
          type="single"
          className="-mx-5 mt-auto w-auto"
          main={
            <Button
              size="xl"
              display="full"
              variant="default"
              disabled={!canSubmit || isSubmitPending}
              onClick={onSubmit}
            >
              출발지 추가하기
            </Button>
          }
        />
      </section>
    </MobileLayout>
  );
}
