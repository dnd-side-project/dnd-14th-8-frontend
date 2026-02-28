import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";
import { useGetDepartures } from "@/domains/location/hooks/use-get-departures";
import { useUpdateDepartureForm } from "@/domains/location/hooks/use-update-departure-form";
import { ButtonBottom } from "@/shared/components/button-bottom";
import { SearchIcon } from "@/shared/components/icons";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { PageHeader } from "@/shared/components/page-header";
import { TextField } from "@/shared/components/text-field";

export function DepartureEditPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { meetingId, locationVoteId } = useParams() as {
    meetingId: string;
    locationVoteId: string;
  };

  // 1. 기존 출발지 목록에서 수정할 데이터 찾기
  const { data: departures, isLoading } = useGetDepartures({ meetingId });
  const currentItem = departures?.find(
    (item) => item.locationVoteId === Number(locationVoteId),
  );

  // 2. 수정 폼 훅 연결
  const {
    control,
    errors,
    canSubmit,
    isDirty,
    isPending,
    maxNameLength,
    onSubmit,
    watch,
    setValue,
  } = useUpdateDepartureForm(meetingId, Number(locationVoteId), {
    participantName: currentItem?.participantName,
    departureLocation: currentItem?.departureLocation,
    departureLat:
      currentItem?.departureLat !== undefined
        ? String(currentItem.departureLat)
        : undefined,
    departureLng:
      currentItem?.departureLng !== undefined
        ? String(currentItem.departureLng)
        : undefined,
  });

  // 3. 검색 페이지(search)에서 장소를 선택하고 돌아왔을 때 데이터 업데이트
  useEffect(() => {
    if (state?.address) {
      setValue("departureLocation", state.address);
    }
    if (state?.coords && Array.isArray(state.coords)) {
      const [lat, lng] = state.coords;
      setValue("departureLat", String(lat));
      setValue("departureLng", String(lng));
    }
  }, [state, setValue]);

  // 장소 검색 페이지로 이동할 때 현재 입력값 전달
  const handleSearchNavigate = () => {
    const currentValues = watch();
    navigate("search", {
      state: {
        address: currentValues.departureLocation,
        name: currentValues.participantName,
      },
    });
  };

  if (isLoading) return null; // 또는 로딩 스피너

  return (
    <MobileLayout>
      <section className="flex min-h-dvh flex-col px-5 pb-5">
        <PageHeader title="출발지 수정" onBack={() => navigate(-1)} />

        <div className="mt-3 flex flex-col gap-6">
          {/* 이름 입력 필드 */}
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

          {/* 출발지 선택 필드 (클릭 시 검색 페이지로 이동) */}
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
            disabled={!canSubmit || !isDirty || isPending}
            onClick={onSubmit}
          >
            수정 완료
          </ButtonBottom>
        </div>
      </section>
    </MobileLayout>
  );
}
