# AGENTS.md

모여락 프론트엔드에서 AI 도구로 작업할 때 따르는 규칙이다. 사람도 같은 규칙을 따른다.

## 명령

- 패키지 매니저는 pnpm, Node는 24 이상이다.
- 작업을 마쳤다고 하기 전에 아래 세 명령을 모두 통과시킨다.

```sh
pnpm check       # Biome lint와 format 검사
pnpm test:unit   # Vitest 단위 테스트와 정적 검사
pnpm build       # tsc 타입 검사와 운영 빌드
```

## 구조

- `src/domains/{admin,location,meeting,schedule}`: 도메인별 pages, views, components, hooks
- `src/shared`: 여러 도메인이 함께 쓰는 components, hooks, providers, utils
- 경로 별칭 `@/`는 `src/`다.
- 테스트는 대상 파일 옆에 `*.test.ts(x)`로 둔다.

## 디자인 시스템과 스타일

- UI는 `@moyeorak/design-system` 컴포넌트를 먼저 쓴다. 없을 때만 서비스 컴포넌트를 만든다.
- 색과 글자는 디자인 시스템 토큰 클래스만 쓴다(`bg-fill-*`, `text-fg-*`, `border-stroke-*`, `textStyle_*`). 팔레트 색 클래스와 예전 글자 클래스는 `src/design-tokens-static.test.ts`에서 실패한다.
- 클래스를 합칠 때는 `cn()`(`@/shared/utils/cn`)을 쓴다.
- 디자인 시스템 소스를 복사하거나 토큰을 서비스에서 다시 정의하지 않는다.
- 디자인 시스템 전환은 `docs/design-system-migration.md`의 "전환 절차"를 따른다. 2단계 설계 결정은 사람이 한다. AI는 선택지와 근거를 정리하고 멈춘다.

## 화면 문구

`docs/ux-writing.md`를 따른다. 해요체로 쓰고, 가운데 점(·)을 쓰지 않고, "모임장"과 "참여자"를 쓴다.

## 접근성

- 아이콘만 있는 버튼에는 접근 가능한 이름을 준다. 디자인 시스템 `IconButton`은 `aria-label`이 필수다.
- 선택 상태는 스타일만으로 표현하지 않는다. 선택 칩은 `pressed`를 넘긴다.
- 입력칸처럼 보이지만 누르면 화면을 이동하는 요소는 input이 아니라 버튼이나 링크로 만든다.

## 확인과 기록

- 확인한 사실과 추론을 나눠 쓴다. 화면 동작과 원인은 실제 빌드, 화면, 로그, 설정 화면으로 확인한 뒤에 단정한다. 확인하지 못했으면 "코드 기준, 화면 미확인"처럼 적고 확인 방법을 함께 적는다. 사람이 말한 전제("예전에는 ~였다")도 기록으로 먼저 확인한다.
- 이슈와 PR에 "본인 결정"은 사람이 실제로 답한 것만 쓴다. AI가 정한 것은 "추천대로 넣은 것" 표에 올려 확인을 받는다.
- 설정 파일을 새로 만들거나 바꿀 때는 적지 않은 값이 무엇이 되는지(기본값, 상속)를 공식 문서나 스키마로 확인하고, 적용 결과를 도구로 확인한다(예: `@coderabbitai configuration`).

## Git

- 브랜치: `{type}/{이슈 번호}-{설명}` (예: `refactor/203-meeting-permissions`)
- 커밋: `type(scope): 한국어 요약 (#이슈)`. type은 feat, fix, refactor, docs, chore, test를 쓴다.
- PR 본문에는 왜 이렇게 했는지, 검증, 측정, 한계를 쓴다.
- PR 리뷰는 CodeRabbit이 맡는다. 지적마다 반영하거나 반려한 이유를 답글로 남긴다.
- push, PR 생성, 머지는 사람이 요청할 때만 한다.
