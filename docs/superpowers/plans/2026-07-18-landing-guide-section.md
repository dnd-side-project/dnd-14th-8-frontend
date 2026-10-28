# 랜딩 이용방법 스크롤 섹션 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 랜딩 페이지 첫 화면 아래에 두 기능(일정 조율하기 / 중간 지점 찾기)의 4단계 이용방법을 소개하는 스크롤 섹션을 추가한다.

**Architecture:** 정적 콘텐츠 전용 컴포넌트 `LandingGuideSection`을 `src/domains/meeting/components/landing-guide-section/`에 신규 작성하고, `LandingPage`가 첫 화면(min-h-dvh) 아래에 렌더링한다. 첫 화면 하단에 스크롤 유도 버튼("이용방법 보기" + 아래 화살표)을 추가해 섹션으로 smooth scroll 한다. 상태·라우팅·API 변경 없음.

**Tech Stack:** React 19 + Tailwind CSS 4 (프로젝트 컬러/타이포 토큰), svgr SVG 컴포넌트, Storybook 8.6 + `@storybook/test` play 함수(vitest storybook 프로젝트가 브라우저 모드로 실행).

## Global Constraints

- 스펙: `docs/superpowers/specs/2026-07-18-landing-guide-section-design.md`
- 새 라이브러리·새 에셋·스크롤 애니메이션 라이브러리 추가 금지 (smooth scroll은 `scrollIntoView({ behavior: "smooth" })`만 사용)
- 단계 구조는 기능당 정확히 4단계 × 2 기능
- 컬러: 일정 조율 = `bg-primary-main`, 중간 지점 = `bg-sub-main` (기존 랜딩 버튼과 동일 토큰)
- 컴포넌트 디렉터리 컨벤션: `<component-name>/index.tsx` (+ `index.stories.tsx`)
- 커밋 메시지는 기존 컨벤션(한국어, `feat:`/`docs:` prefix)을 따른다
- 패키지 매니저는 `pnpm`

---

### Task 1: LandingGuideSection 컴포넌트 + 스토리 테스트

**Files:**
- Create: `src/domains/meeting/components/landing-guide-section/index.tsx`
- Test(Create): `src/domains/meeting/components/landing-guide-section/index.stories.tsx`

**Interfaces:**
- Consumes: `cn` (`@/shared/utils/cn`), 캐릭터 SVG (`InvitationScheduleCharacter`, `InvitationMidpointCharacter` from `@/assets/characters`)
- Produces: `LandingGuideSection` — props 없는 함수 컴포넌트, named export. 루트 `<section>`에 `id="landing-guide"` 부여 (Task 2의 스크롤 타깃)

- [ ] **Step 1: 실패하는 스토리(테스트) 작성**

`src/domains/meeting/components/landing-guide-section/index.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { LandingGuideSection } from "@/domains/meeting/components/landing-guide-section";

const meta = {
  title: "meeting/LandingGuideSection",
  component: LandingGuideSection,
  decorators: [
    (Story) => (
      <div className="w-[375px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LandingGuideSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("모여락 이용방법")).toBeVisible();
    await expect(canvas.getByText("일정 조율하기")).toBeVisible();
    await expect(canvas.getByText("중간 지점 찾기")).toBeVisible();
    await expect(canvas.getByText("가능한 날짜 투표")).toBeVisible();
    await expect(canvas.getByText("중간지점 역 추천 받기")).toBeVisible();
  },
};
```

주의: "모임 만들기"는 두 기능에 모두 등장하므로 `getByText`로 단정하지 말 것 (중복 매치로 실패한다).

- [ ] **Step 2: 테스트 실행해 실패 확인**

Run: `pnpm vitest run --project=storybook src/domains/meeting/components/landing-guide-section/index.stories.tsx`
Expected: FAIL — `@/domains/meeting/components/landing-guide-section` 모듈이 없어 import 에러

- [ ] **Step 3: 컴포넌트 구현**

`src/domains/meeting/components/landing-guide-section/index.tsx`:

```tsx
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
            <h3 className="text-t1 text-k-900">{feature.title}</h3>
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
                  <p className="text-t2 text-k-900">{step.title}</p>
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
```

- [ ] **Step 4: 테스트 실행해 통과 확인**

Run: `pnpm vitest run --project=storybook src/domains/meeting/components/landing-guide-section/index.stories.tsx`
Expected: PASS (1 story test)

- [ ] **Step 5: 린트 확인 후 커밋**

```bash
pnpm check
git add src/domains/meeting/components/landing-guide-section
git commit -m "feat: 랜딩 이용방법 섹션 컴포넌트 추가"
```

---

### Task 2: LandingPage에 섹션 연결 + 스크롤 유도 버튼

**Files:**
- Modify: `src/domains/meeting/pages/index.tsx`

**Interfaces:**
- Consumes: `LandingGuideSection` (Task 1, `@/domains/meeting/components/landing-guide-section`, 루트에 `id="landing-guide"` 있음), `ChevronDownIcon` (`@/shared/components/icons`)
- Produces: 없음 (최종 화면)

- [ ] **Step 1: LandingPage 수정**

`src/domains/meeting/pages/index.tsx` 전체를 다음으로 교체:

```tsx
import { useNavigate } from "react-router";
import {
  LandingMidpointCharacter,
  LandingScheduleCharacter,
} from "@/assets/characters";
import MoyeorakLogo from "@/assets/moyeorak-logo.svg?react";
import { LandingGuideSection } from "@/domains/meeting/components/landing-guide-section";
import { ChevronDownIcon } from "@/shared/components/icons";
import { MainButton } from "@/shared/components/main-button";
import { MobileLayout } from "@/shared/components/mobile-layout";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <section className="flex min-h-dvh flex-col px-5 pt-6 pb-6">
        <div className="mb-15 flex flex-col items-center">
          <MoyeorakLogo />
          <span className="text-b1 text-gray-750">
            모임을 더 즐겁게, 효율적으로 시작해요
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <MainButton
            className="bg-primary-main"
            title="일정 조율하기"
            description={"쉽고 빠르게 일정을\n조율하세요!"}
            character={<LandingScheduleCharacter />}
            characterClassName="right-[-60px] bottom-[-90px]"
            onClick={() => navigate("/new/schedule")}
          />

          <MainButton
            className="bg-sub-main"
            title="중간 지점 찾기"
            description={"공평한 중간지점을\n찾아보세요!"}
            character={<LandingMidpointCharacter />}
            characterClassName="right-[-60px] bottom-[-115px]"
            onClick={() => navigate("/new/location")}
          />
        </div>

        <button
          type="button"
          className="mt-auto flex cursor-pointer flex-col items-center gap-1 pt-10 text-b2 text-gray-750"
          onClick={() =>
            document
              .getElementById("landing-guide")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          이용방법 보기
          <ChevronDownIcon />
        </button>
      </section>

      <LandingGuideSection />
    </MobileLayout>
  );
}
```

변경점은 세 가지다: `LandingGuideSection`·`ChevronDownIcon` import 추가, 첫 화면 `<section>`에 `pb-6`과 `mt-auto` 스크롤 유도 버튼 추가, 첫 화면 아래 `<LandingGuideSection />` 렌더링. 기존 로고·메인 버튼 마크업은 그대로 유지한다.

- [ ] **Step 2: 타입·빌드 검증**

Run: `pnpm build`
Expected: `tsc -b` 및 `vite build` 성공 (exit 0)

- [ ] **Step 3: 실제 화면 확인**

Run: `pnpm dev` 실행 후 브라우저에서 `http://localhost:5173/` 접속
Expected: 첫 화면 하단에 "이용방법 보기" 버튼이 보이고, 클릭 시 "모여락 이용방법" 섹션으로 부드럽게 스크롤. 두 기능 각 4단계 카드 표시 (일정=파랑 뱃지, 중간지점=청록 뱃지)

- [ ] **Step 4: 린트 확인 후 커밋**

```bash
pnpm check
git add src/domains/meeting/pages/index.tsx
git commit -m "feat: 랜딩 페이지에 이용방법 섹션 및 스크롤 유도 버튼 연결"
```
