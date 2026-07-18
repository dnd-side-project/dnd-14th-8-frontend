import type { ReactNode } from "react";
import {
  InvitationMidpointCharacter,
  InvitationScheduleCharacter,
} from "@/assets/characters";
import { cn } from "@/shared/utils/cn";

interface GuideStep {
  title: string;
  description: string;
}

interface GuideFeature {
  title: string;
  character: ReactNode;
  badgeClassName: string;
  steps: GuideStep[];
}

const GUIDE_FEATURES: GuideFeature[] = [
  {
    title: "일정 조율하기",
    character: <InvitationScheduleCharacter className="h-12 w-auto" />,
    badgeClassName: "bg-primary-main",
    steps: [
      {
        title: "모임 만들기",
        description: "모임 이름과 정보를 입력해 시작해요",
      },
      {
        title: "후보 날짜 고르고 링크 공유",
        description: "가능한 날짜 후보를 정하고 친구들에게 링크를 보내요",
      },
      {
        title: "가능한 날짜 투표",
        description: "참여자들이 각자 되는 날짜에 투표해요",
      },
      {
        title: "모두가 되는 날 확인",
        description: "투표 결과로 최적의 날짜를 확인해요",
      },
    ],
  },
  {
    title: "중간 지점 찾기",
    character: <InvitationMidpointCharacter className="h-12 w-auto" />,
    badgeClassName: "bg-sub-main",
    steps: [
      {
        title: "모임 만들기",
        description: "모임 이름과 정보를 입력해 시작해요",
      },
      {
        title: "링크 공유하고 출발지 등록",
        description: "참여자들이 각자 출발지를 등록해요",
      },
      {
        title: "중간지점 역 추천 받기",
        description: "모두에게 공평한 지하철역을 추천받아요",
      },
      {
        title: "주변 장소 둘러보기",
        description: "추천 역 주변 장소를 보고 약속 장소를 정해요",
      },
    ],
  },
];

export function LandingGuideSection() {
  return (
    <section
      id="landing-guide"
      className="flex flex-col gap-10 px-5 pt-14 pb-16"
    >
      <h2 className="text-center text-h2 text-k-900">모여락 이용방법</h2>

      {GUIDE_FEATURES.map((feature) => (
        <article key={feature.title} className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            {feature.character}
            <h3 className="text-k-900 text-t1">{feature.title}</h3>
          </div>

          <ol className="flex flex-col gap-3">
            {feature.steps.map((step, index) => (
              <li
                key={step.title}
                className="flex items-start gap-3 rounded-xl bg-k-10 p-4"
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-b2 text-k-5",
                    feature.badgeClassName,
                  )}
                >
                  {index + 1}
                </span>
                <div className="flex flex-col gap-1">
                  <p className="text-k-900 text-t2">{step.title}</p>
                  <p className="text-b2 text-k-600">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </article>
      ))}
    </section>
  );
}
