import { useEffect, useMemo, useRef } from "react";
import { Controller } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";
import { useGetDepartures } from "@/domains/location/hooks/use-get-departures";
import { useUpdateDepartureForm } from "@/domains/location/hooks/use-update-departure-form";
import { ButtonBottom } from "@/shared/components/button-bottom";
import { SearchIcon } from "@/shared/components/icons";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { PageHeader } from "@/shared/components/page-header";
import { TextField } from "@/shared/components/text-field";

interface VoteSearchLocationState {
  address?: string;
  coords?: [number, number];
  name?: string;
}

export function DepartureEditPage() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: VoteSearchLocationState | null };
  const { meetingId = "", locationVoteId = "" } = useParams();

  const locationVoteIdNumber = Number(locationVoteId);
  const initializedRef = useRef(false);

  const { data: departures, isLoading } = useGetDepartures({ meetingId });

  const selectedDeparture = useMemo(
    () =>
      departures?.find(
        (departure) => departure.locationVoteId === locationVoteIdNumber,
      ) ?? null,
    [departures, locationVoteIdNumber],
  );

  const {
    control,
    errors,
    canSubmit,
    isSubmitPending,
    maxNameLength,
    onSubmit,
    watch,
    setValue,
  } = useUpdateDepartureForm({
    meetingId,
    locationVoteId: locationVoteIdNumber,
  });

  useEffect(() => {
    if (!selectedDeparture || initializedRef.current) return;

    setValue("participantName", selectedDeparture.participantName);
    setValue("departureLocation", selectedDeparture.departureLocation);
    setValue("departureLat", String(selectedDeparture.departureLat));
    setValue("departureLng", String(selectedDeparture.departureLng));

    initializedRef.current = true;
  }, [selectedDeparture, setValue]);

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
  }, [setValue, state]);

  const handleSearchNavigate = () => {
    const currentValues = watch();
    navigate("search", {
      state: {
        address: currentValues.departureLocation,
        name: currentValues.participantName,
      },
    });
  };

  if (isLoading) return null;

  if (!selectedDeparture) {
    return (
      <MobileLayout>
        <section className="flex min-h-dvh flex-col px-5 pb-5">
          <PageHeader title="출발지 수정" onBack={() => navigate(-1)} />

          <p className="mt-10 text-center text-b2 text-k-500">
            수정할 출발지를 찾을 수 없어요.
          </p>

          <div className="mt-auto">
            <ButtonBottom variant="black" onClick={() => navigate(-1)}>
              이전으로 돌아가기
            </ButtonBottom>
          </div>
        </section>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <section className="flex min-h-dvh flex-col px-5 pb-5">
        <PageHeader title="출발지 수정" onBack={() => navigate(-1)} />

        <div className="mt-3 flex flex-col gap-6">
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
            출발지 수정하기
          </ButtonBottom>
        </div>
      </section>
    </MobileLayout>
  );
}
