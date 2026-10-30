# 모여락 디자인 시스템 점진 전환

## 기준

- 배포 패키지: `@moyeorak/design-system@0.6.1` (정확한 버전 고정)
- 소스: https://github.com/meteorqz6/moyeorakui
- 컴포넌트와 의미 토큰은 npm 패키지에서 가져온다. 소스 복사나 서비스 내 토큰 재정의는 하지 않는다.
- 기존 Tailwind v4를 유지한다. 서비스에 Panda codegen은 추가하지 않는다.
- CSS 진입점에서 layers.css를 가장 먼저 불러오고 Tailwind 플러그인과 styles.css를 함께 로드한다.
- 직접 관리하는 새 패키지를 바로 사용하기 위해 minimumReleaseAgeExclude에 해당 패키지 이름만 추가했다. 현재 pnpm 10.17은 버전별 예외를 지원하지 않아 package.json에서 0.6.1을 고정한다. 다른 패키지의 대기 정책은 유지한다.

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

## 별도 화면 전환 단계

다음 요소는 이번 공통 버튼 교체 범위와 별개로 화면 시안과 함께 전환한다.

- 랜딩 캐릭터 카드, 로고, 카카오/링크 공유 채널 타일
- 탭, 셀렉트, 달력 날짜 셀, 시간표 셀, 지도 마커 및 목록 카드
- TextField, Stepper, Calendar의 본체와 기존 색상·타이포 토큰
- Modal 전체 구조, Toast

0.5.0에는 TextField·Stepper·Calendar 공개 export가 없어 기존 구현을 유지했다.
Modal·Toast는 패키지에 존재하지만, 이번에는 버튼 교체에 필요한 부분만 적용한다.
기존 color-system.css는 디자이너와 색상 대응표를 확정할 때까지 유지한다. font-system.css의 글자 토큰은 기초값 전환에서 지웠다.

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
