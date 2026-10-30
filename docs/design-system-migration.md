# 모여락 디자인 시스템 점진 전환

## 기준

- 배포 패키지: `@moyeorak/design-system@0.8.0` (정확한 버전 고정)
- 소스: https://github.com/meteorqz6/moyeorakui
- 컴포넌트와 의미 토큰은 npm 패키지에서 가져온다. 소스 복사나 서비스 내 토큰 재정의는 하지 않는다.
- 기존 Tailwind v4를 유지한다. 서비스에 Panda codegen은 추가하지 않는다.
- CSS 진입점에서 layers.css를 가장 먼저 불러오고 Tailwind 플러그인과 styles.css를 함께 로드한다.
- 직접 관리하는 새 패키지를 바로 사용하기 위해 minimumReleaseAgeExclude에 해당 패키지 이름만 추가했다. 현재 pnpm 10.17은 버전별 예외를 지원하지 않아 package.json에서 정확한 버전으로 고정한다. 다른 패키지의 대기 정책은 유지한다.

## 1차: 서비스 공통 버튼

기존 사용처의 이벤트·disabled·type·ARIA 전달은 유지하면서 공통 컴포넌트 내부 구현을 바꿨다.
새 기능은 디자인 시스템을 직접 import하며, 아래 어댑터는 기존 사용처를 점진 전환하는 경계로 사용한다.

| 서비스 컴포넌트 | 디자인 시스템 연결 |
| --- | --- |
| ButtonBottom black / blue / white | Button default / brand / outline, xl, full |
| ButtonBottomWithIcon | Button outline, trailingIcon |
| ButtonSubStroke | Button outline, leadingIcon |
| IconButton | IconButton clear / fill. 기존 배치 크기·아이콘은 유지 |
| ChipButton primary / ghost / locationDelete | Button brand-weak / ghost-brand / ghost. 선택 상태 없는 액션 |
| ChipButton selected / outlined | controlled Chip outlined-brand / neutral-weak |
| ChipButton floating / midpoint 계열 | controlled Chip, pill |
| ChipButtonWithIcon | controlled Chip, pill |
| FloatingBack / FloatingScrollTop | FloatingButton back / up |
| NearbyPlacesFloatingButton | Button outline |
| Modal 내부 확인·취소 | Button brand / outline |
| 연결 실패 재시도, 투표 초기화, 관리자 입장·로그아웃 | Button |
| 관리자 통계 기간 선택 | controlled Chip |

선택 칩은 부모의 현재 선택값을 pressed에 전달한다. 수정·삭제 버튼에는 Toggle을 쓰지 않아
잘못된 aria-pressed 상태를 만들지 않는다. 아이콘 버튼에는 aria-label을 필수로 전달한다.
아이콘 버튼의 backgroundSize는 전환용 deprecated prop이며 새 디자인에서는 버튼 전체 배경을 사용한다.
기존 size는 달력·하단 바 배치를 유지하기 위한 어댑터 값이다. 새 사용처는 패키지의 sm/md/lg를 사용한다.

키보드 포커스 링은 패키지의 stroke-brand-default 토큰을 사용한다.
FloatingScrollTop은 기존 모바일 컨테이너 안에 배치되도록 FloatingButton의 fixed 위치만 static으로 바꾼다.

## 2차: 페이지 헤더

서비스 공통 `PageHeader`를 삭제하고 패키지의 `Header`(Figma `header/Default`, 0.6.0)를 직접 사용한다.

| 기존 | 디자인 시스템 |
| --- | --- |
| PageHeader title / onBack | Header title / onBack |
| PageHeader rightElement (일정 투표 `초기화`) | Header actionLabel / onAction (ghost-brand lg) |

- 제목은 `h1`(title1, fg-neutral-strong)으로 렌더링한다. 한 화면에 Header는 하나만 둔다.
- Header는 화면 폭 기준 배치(뒤로가기 left 4px, 액션 right 12px)라, `px-5` 안에서는 `-mx-5 w-auto`로 화면 폭까지 펼친다.
- Header는 배경을 칠하지 않고 페이지 배경을 따른다.

## 3차: 하단 액션 영역

페이지 하단 버튼 영역을 패키지의 `ActionArea`로 바꾸고 서비스 `BottomActionBar`를 삭제한다.
0.6.1부터 `w: "full"`, `display: "full"`이 올바른 `width: 100%`로 생성된다.

| 기존 | 디자인 시스템 |
| --- | --- |
| BottomActionBarWithButtonAndShare (공유 + 메인) | ActionArea icon. 공유 버튼이 없으면 single |
| BottomActionBar + GuideTimeSelection + 완료 (일정 투표 폼) | ActionArea single, supportingItem |
| 페이지 하단 `mt-auto` + ButtonBottom | ActionArea single |

- 버튼도 어댑터를 거치지 않고 패키지 컴포넌트를 직접 쓴다. 메인은 `Button size="xl" display="full"`, 공유는 `IconButton size="lg" variant="fill"` + `Icon type="share" size="md"`(Icon에는 variant를 지정하지 않는다).
- 패키지 버튼에는 브랜드 포커스 링이 없어 키보드 포커스 시 브라우저 기본 outline이 보인다. 브랜드 링은 디자인 시스템 레시피에서 다룬다.
- ActionArea는 배치(px 16, py 12, 버튼 간격 8)와 배경만 맡는다. 화면 하단 고정은 `FixedBottomArea`가 맡는다.
- 맨 위로 버튼(FloatingScrollTop)은 `FixedBottomArea`의 `floating`에 넣어 하단 영역 위쪽 끝에서 20px, 오른쪽 20px에 둔다(FloatingButton 배치 가이드). 하단 영역 높이가 바뀌어도 함께 따라가므로 `bottom-[…px]` 같은 고정값을 쓰지 않는다.
- `FixedBottomArea`는 현재 높이를 `--fixed-bottom-area-height`로 알린다. 맨 위로 버튼이 있는 화면의 콘텐츠는 `FIXED_BOTTOM_AREA_PADDING_WITH_FLOATING`(하단 영역 높이 + 80px)을 하단 여백으로 써서, 끝까지 스크롤하면 마지막 줄이 버튼 위로 올라온다.
- `px-5` 페이지 안에서는 Header와 같이 `-mx-5 w-auto`로 화면 폭까지 펼치고, 섹션의 `pb-5`는 뺀다.
- 하단 공유 바의 메인 버튼 기본값을 outline에서 default로 바꿨다. 시안 기준이다. `buttonVariant`는 패키지 Button의 variant를 그대로 받는다.
- 일정 투표 폼은 안내와 버튼 간격이 기존 16px에서 ActionArea 기본값 8px로 줄었다.
- 아직 전환하지 않은 곳: 모임 참여 초대(브랜드 배경), 일정 범위 수정 저장 버튼(sticky + 335px 폭). 콘텐츠 안에 놓인 버튼(장소 상세, 경로 상세, 설치 안내)은 ActionArea 대상이 아니다.
- safe area 여백은 viewport에 `viewport-fit=cover`가 있어야 적용된다. 지금 `index.html`에는 없어서 `env(safe-area-inset-bottom)`이 0이다.

## 기초값: Typography

디자인 시스템의 Colors·Typography가 확정돼, 기초값은 컴포넌트 전환과 별개로 서비스 전체를 한 번에 맞춘다. 글자부터 바꾸고, 색상은 디자이너와 대응표를 확정한 뒤 진행한다.

| 기존 | 디자인 시스템 |
| --- | --- |
| `text-h1` (28 / 600) | `textStyle_head1` |
| `text-h2` (24 / 600) | `textStyle_head3` |
| `text-h3` (22 / 700) | 대응 없음. 유일한 사용처인 서버 연결 대기 화면 제목은 `textStyle_title1`(20 / 600) |
| `text-t1` (20 / 600) | `textStyle_title1` |
| `text-t2` (16 / 600) | `textStyle_title3` |
| `text-b1` ~ `text-b5` | `textStyle_body1` ~ `body5` |
| `text-c1` ~ `text-c3` | `textStyle_caption1` ~ `caption3` |

- 글자 크기·굵기·자간은 같고 줄 간격만 디자인 시스템 값(피그마 px ÷ 글자 크기)으로 바뀐다. 14px 본문 1.5 → 1.57, 16px 제목 1.35 → 1.38 등.
- `font-system.css`에는 폰트 로드(`@font-face`)와 `body` 글꼴 지정만 남기고 `text-*` 토큰은 지웠다. 기존 클래스를 다시 쓰면 스타일이 생성되지 않는다.
- `cn()`(tailwind-merge)은 `textStyle_*`를 하나의 그룹으로 본다. 여러 개를 함께 쓰면 뒤에 온 값만 남고, 앞에 온 `text-{size}`·`leading-*`·`font-{weight}`·`tracking-*`를 대체한다.
- `textStyle_*` 뒤에 쓴 `leading-*`, `font-{weight}`는 그대로 덮어쓴다. 두 클래스 모두 Tailwind `utilities` 레이어에 있고 `textStyle_*`가 먼저 생성되기 때문이다.
- 관리자 화면(`/admin`)은 Tailwind 기본 크기를 쓰는 내부 도구라 범위에서 뺐다.

## 기초값: Colors

팔레트 번호 색 클래스를 디자인 시스템 의미 토큰으로 바꾼다. 기존 회색(무채색 13단계)과 디자인 시스템 회색(푸른 회색 11단계)은 단계가 일대일로 맞지 않아, 대응표를 먼저 만들고 두 곳은 디자이너와 확정했다.

요소에 따라 토큰 계열을 고른다. 페이지·섹션·시트처럼 넓은 배경은 `bg`, 카드·칩·입력칸처럼 독립된 면은 `fill`, 테두리와 구분선은 `stroke`, 글자와 아이콘은 `fg`다.

| 기존 | 디자인 시스템 |
| --- | --- |
| `text-k-900` / `800` / `750`·`700` | `fg.neutral.stronger` / `strong` / `default` |
| `text-k-600`·`500` | `fg.neutral.subtle` (디자이너 확정) |
| `text-k-400` / `300`·`200` / `5` | `fg.neutral.subtler` / `subtlest` / `faintest` |
| `text-primary-main` / `text-action-red` | `fg.brand.default` / `fg.negative.default` |
| `bg-k-5` | 넓은 배경 `bg.neutral.default`, 독립된 면 `fill.neutral.faintest` |
| `bg-k-10` / `50` / `200` / `800` | `fill.neutral.subtlest` / `subtler` / `subtle` / `default` |
| `bg-k-100` (1px 구분선) | `stroke.neutral.subtle` |
| `bg-p-50` / `bg-p-100` (눌림) / `bg-primary-main` | `fill.brand.subtle` / `subtle-pressed` / `default` |
| `border-k-50` / `100` / `200` / `400` | `stroke.neutral.subtler` / `subtle` / `default` / `strong` |
| `border-primary-main` / `border-p-300` / `border-action-red` | `stroke.brand.default` / `subtle` / `stroke.negative.default` |
| `bg-k-900/70` / `bg-k-900/40` | `overlay.neutral.default` / `subtle` (디자이너 확정) |

- `text-k-500`과 `text-k-600`이 같은 색(`#737a89`)이 된다. 디자이너의 서비스 UI 디자인과 일치하는 쪽으로 골랐다.
- 위치 지도 화면의 바탕(`bg-k-10`)은 넓은 배경이지만 디자인 시스템 `bg`에 같은 밝기가 없어 `fill.neutral.subtlest`로 두었다. 지도에 가려 보이지 않는다.
- 토스트는 4차 Toast 단계에서 디자인 시스템 Toast로 바꾸며 함께 정리했다. 관리자 화면(`/admin`)은 Tailwind 기본 색을 쓰는 내부 도구라 범위에서 뺐다.
- `src/design-tokens-static.test.ts`가 토스트·관리자 화면 밖에서 팔레트 색 클래스, 팔레트 CSS 변수, 기존 글자 클래스가 다시 쓰이면 실패한다.

## 4차: Toast

서비스 토스트(sonner)를 디자인 시스템 `Toast`로 바꾼다. 디자인 시스템 `Toast`는 바꾸지 않고 서비스 쪽에서 맞춘다.

- 기존 호출(`toast.success / error / message / dismiss`)은 그대로 둔다. `shared/components/toast`가 호출을 받아 목록을 관리하고(`toast-store.ts`), `Toaster`가 디자인 시스템 `Toast`로 그린다.

  | 호출 | 디자인 시스템 Toast |
  | --- | --- |
  | `toast.success` | `positive` |
  | `toast.error` | `negative` |
  | `toast.message` | `neutral` (아이콘 없음) |

- 같은 `id`로 다시 띄우면 하나만 보이고 닫히는 시간이 다시 흐른다. 동시에 최대 3개까지 보인다. 4초 뒤 닫힌다(sonner 기본값과 같음).
- 위치는 디자인 시스템 가이드(하단 영역 12px 위)를 따른다. `FixedBottomArea`가 알리는 `--fixed-bottom-area-height`를 쓰고, 없는 화면은 페이지 끝 ActionArea(single, 80px)를 기본값으로 둔다.
- 디자인 시스템 `Toast`는 한 줄 고정이라, 375px에서 넘치던 문구를 줄이고 문구 전체를 규칙에 맞춰 정리했다. 규칙과 용어는 `docs/ux-writing.md`에 있다.
- 디자인 시스템 `Toast`에는 버튼이 없어, 새 버전 안내("새로고침" 버튼)는 `Modal`로 옮겼다. 제목 "업데이트된 버전으로 새로고침할까요?", 본문 "지금 새로고침하면 입력 중인 내용이 사라질 수 있어요", 버튼 "나중에 / 새로고침". 나중을 고르면 앱을 다시 열 때 대기 중인 워커가 적용된다. 설치 유도 시트가 열려 있는 동안 미루는 동작은 그대로다.
- sonner와 `color-system.css`, tailwind-merge의 팔레트 색 목록을 지웠다. 정적 검사(`src/design-tokens-static.test.ts`)는 관리자 화면 말고는 예외가 없다.

## 5차: Chip, Badge

전환용으로 남겨 둔 칩 어댑터(`ChipButton`, `ChipButtonWithIcon`)와 서비스 `Chip`을 지우고, 사용처에서 디자인 시스템 컴포넌트를 바로 쓴다.

| 역할 | 기존 | 디자인 시스템 |
| --- | --- | --- |
| 선택 칩 (시간표 수정 프리셋) | ChipButton selected / outlined | Chip square, outlined-brand / neutral-weak |
| 선택 칩 (추천 역) | ChipButton midpoint 계열 | Chip pill, brand / neutral-weak |
| 선택 칩 (지도 위 추천 역) | ChipButton floating 계열 | Chip pill, neutral / neutral-weak, 그림자 |
| 선택 칩 (주변 장소 카테고리) | ChipButtonWithIcon | Chip pill, brand / neutral-weak, 아이콘, 그림자 |
| 액션 (출발지 수정 / 삭제) | ChipButton ghost / locationDelete | Button sm, ghost-brand / ghost |
| 라벨 (일정 메인 참여자 이름) | 서비스 Chip xl | Badge md outline (시안) |
| 라벨 (출발지 목록 참여자 이름) | 서비스 Chip lg | Badge md neutral-weak |
| 라벨 (출발지 카드 주소) | 서비스 Chip md | Badge md brand-weak |
| 라벨 (출발지 부족 화면 "나") | 직접 만든 span | Badge sm brand-weak |

- 선택 칩은 부모가 현재 선택값을 `pressed`로 넘기고, 선택 여부에 맞는 `variant`를 고른다. 액션에는 Toggle을 쓰지 않는다.
- 가로 스크롤 줄에 놓이는 칩과 Badge에는 `shrink-0`을 준다. 디자인 시스템 컴포넌트는 줄어들지 않게 막아 두지 않았다.
- 선택 칩과 액션은 어댑터가 하던 것과 같아 모양이 그대로다. 어댑터가 붙이던 브랜드 포커스 링은 3차와 같이 빠지고, 키보드 포커스에는 브라우저 기본 outline이 보인다.
- 라벨은 Badge 규격으로 바뀐다. 일정 메인의 참여자 이름은 시안대로 흰 배경에 테두리가 있는 outline이 되고, 여백이 작아진다(좌우 12 → 8px). 출발지 목록의 참여자 이름은 글자가 `fg.neutral.subtle`로 연해진다. 출발지 카드 주소는 배경이 `fill.brand.subtler`로 연해지고 글자가 500으로 굵어진다.

## 6차: Icon

모임 일정 흐름과 공통 컴포넌트의 서비스 아이콘을 디자인 시스템 `Icon`으로 바꾸고, 아이콘을 받던 서비스 `IconButton` 어댑터를 지운다. 장소 조율 화면의 아이콘은 장소 조율을 점검할 때 다룬다.

| 서비스 아이콘 | 디자인 시스템 Icon |
| --- | --- |
| ChevronRight, ChevronLeft, ChevronDown, ChevronUp | `chevron_right`, `chevron_left`, `chevron_down`, `chevron_up` |
| Member | `member` |
| Available, Unavailable | `valid`, `invalid` (색이 고정된 Semantic 아이콘) |
| Close | `x_circle` |

- 크기는 디자인 시스템 단계(16px `xs`, 20px `sm`, 24px `md`, 32px `lg`)로, 색은 `variant`로 맞춘다. `variant`가 없으면 부모의 글자 색을 따른다. 디자인 시스템 `Button`, `IconButton` 안의 아이콘은 `variant` 없이 버튼 색을 따른다.
- 아이콘 버튼은 디자인 시스템 `IconButton` 규격을 그대로 쓴다. 시트 닫기(시간표 수정, 공유, 설치 안내)는 `sm`(36px)에 24px `x_circle`, 입력칸 지우기는 `md`(48px)에 24px `x_circle`, 달력 이동은 `sm`에 24px chevron이다.
- 달력 이동 버튼은 react-day-picker가 넘기는 영어 이름 대신 "이전 달", "다음 달"을 쓴다.
- 인원 선택은 스테퍼에서 `Chip` 가로 스크롤(2명부터 20명)로 바꿨다(`ParticipantCountChips`). 모임 인원 수정에서 현재 인원보다 적은 칩은 `aria-disabled`로 비활성처럼 보이고, 누르면 이유를 토스트로 알린다.
- 설치 안내의 공유, 추가 아이콘은 iOS 시스템 버튼 모양을 보여 주는 안내라 서비스 아이콘을 유지한다. 장소 조율에서만 쓰는 아이콘도 서비스 아이콘으로 남아 있다.
- 디자인 시스템 `Icon`은 `aria-hidden`을 받지 않는다. 아이콘은 버튼 이름이나 옆 글자와 함께 쓰여 따로 읽힐 필요가 없다.

## 별도 화면 전환 단계

다음 요소는 이번 공통 버튼 교체 범위와 별개로 화면 시안과 함께 전환한다.

- 랜딩 캐릭터 카드, 로고, 카카오/링크 공유 채널 타일
- 탭, 셀렉트, 달력 날짜 셀, 시간표 셀, 지도 마커 및 목록 카드
- TextField, Stepper, Calendar의 본체와 기존 색상·타이포 토큰
- Modal 전체 구조

0.5.0에는 TextField·Stepper·Calendar 공개 export가 없어 기존 구현을 유지했다.
서비스의 색과 글자는 기초값 전환과 4차 Toast 전환으로 모두 디자인 시스템 토큰으로 바꿨고, 기존 color-system.css는 지웠다.

## 검증

```sh
pnpm install --frozen-lockfile
pnpm run test:unit
pnpm run build
pnpm run build-storybook
```

- 단위 테스트 170개 통과. 폼의 기본 button/명시적 submit, disabled, aria-busy, 선택 칩의 상태, 아이콘 버튼의 이름을 포함한다.
- TypeScript, 프로덕션 PWA 빌드, Storybook 빌드 통과.
- 기존 직접 의존성 버전을 유지하고 디자인 시스템에 필요한 의존성 그래프만 lockfile에 추가했다.
- 실제 Render API를 연결한 로컬 브라우저에서 모임 생성, 입력 지우기, 인원 변경, 날짜·시간 프리셋 변경과 저장을 확인했다.
- 브라우저 computed style 확인: 비활성 버튼 #e1e4ec / #9fa5b3, 기본 버튼 #2c3038 / #ffffff, 선택 칩 #e5eeff, 미선택 칩 #f2f4f9.
- 로컬 지도 키 누락 및 기존 번들 크기 경고가 있다. 운영 빌드의 지도 키는 기존 GitHub Secrets에서 주입한다.
- Google Routes 키의 기존 IP 제한 문제는 이 디자인 변경에서 수정하지 않는다.
