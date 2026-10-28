# 모여락 디자인 시스템 점진 전환

## 기준

- 배포 패키지: `@moyeorak/design-system@0.5.0` (정확한 버전 고정)
- 소스: https://github.com/meteorqz6/moyeorakui
- 컴포넌트와 의미 토큰은 npm 패키지에서 가져온다. 소스 복사나 서비스 내 토큰 재정의는 하지 않는다.
- 기존 Tailwind v4를 유지한다. 서비스에 Panda codegen은 추가하지 않는다.
- CSS 진입점에서 layers.css를 가장 먼저 불러오고 Tailwind 플러그인과 styles.css를 함께 로드한다.
- 직접 관리하는 새 패키지를 바로 사용하기 위해 minimumReleaseAgeExclude에 해당 패키지 이름만 추가했다. 현재 pnpm 10.17은 버전별 예외를 지원하지 않아 package.json에서 0.5.0을 고정한다. 다른 패키지의 대기 정책은 유지한다.

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
| PageHeader 뒤로가기 | IconButton clear |
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

## 별도 화면 전환 단계

다음 요소는 이번 공통 버튼 교체 범위와 별개로 화면 시안과 함께 전환한다.

- 랜딩 캐릭터 카드, 로고, 카카오/링크 공유 채널 타일
- 탭, 셀렉트, 달력 날짜 셀, 시간표 셀, 지도 마커 및 목록 카드
- TextField, Stepper, Calendar의 본체와 기존 색상·타이포 토큰
- Modal 전체 구조, Toast 및 ActionArea 레이아웃

0.5.0에는 TextField·Stepper·Calendar 공개 export가 없어 기존 구현을 유지했다.
Modal·Toast·ActionArea는 패키지에 존재하지만, 이번에는 버튼 교체에 필요한 부분만 적용한다.
기존 color-system.css와 font-system.css를 전체 재매핑하면 미전환 화면까지 함께 바뀌므로 유지한다.

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
