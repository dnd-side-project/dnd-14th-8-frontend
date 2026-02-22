import { useState } from "react";
import { useNavigate } from "react-router";
import { ButtonBottom } from "@/shared/components/button-bottom";
import { MobileLayout } from "@/shared/components/mobile-layout";
import { PageHeader } from "@/shared/components/page-header";
import { Stepper } from "@/shared/components/stepper";
import { TextField } from "@/shared/components/text-field";

export function NewMeetingPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [memberCount, setMemberCount] = useState(2);

  const MAX_NAME_LENGTH = 4;

  const isOverLength = name.length > MAX_NAME_LENGTH;
  const isRequiredError = isTouched && name.length === 0;
  const isFormValid = name.length > 0 && !isOverLength;

  const getTextFieldProps = () => {
    if (isOverLength) {
      return {
        status: "error" as const,
        helperText: "최대 4자까지 적을 수 있어요",
        placeholder: "이름을 입력해주세요",
      };
    }
    if (isRequiredError) {
      return {
        status: "error" as const,
        helperText: "이름을 입력해주세요",
        placeholder: "",
      };
    }
    return {
      status: "default" as const,
      helperText: isFocused ? "최대 4자까지 적을 수 있어요" : "",
      placeholder: "이름을 입력해주세요",
    };
  };

  const { status, helperText, placeholder } = getTextFieldProps();

  return (
    <MobileLayout>
      <section className="flex min-h-dvh flex-col px-5 pb-5">
        <PageHeader title="모임정보 입력" onBack={() => navigate("/")} />

        <TextField
          label="방장 이름"
          placeholder={placeholder}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!isTouched) setIsTouched(true);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false); // 포커스 아웃
            setIsTouched(true);
          }}
          onClear={() => {
            setName("");
            setIsTouched(true);
          }}
          status={status}
          helperText={helperText}
          maxLength={MAX_NAME_LENGTH}
          className="mt-3"
        />
        <Stepper
          label="인원 수"
          value={memberCount}
          onChange={setMemberCount}
          className="mt-6"
        />

        <div className="mt-auto">
          <ButtonBottom
            variant="black"
            disabled={!isFormValid}
            // onClick={}
          >
            모임 생성하기
          </ButtonBottom>
        </div>
      </section>
    </MobileLayout>
  );
}
