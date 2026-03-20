# 프로젝트 인수인계 메모

## 이 프로젝트가 무엇인지

- 혼자 사용하는 개인 일정관리 앱
- 스택: Next.js, TypeScript, Tailwind CSS, 로컬 SQLite
- 핵심 목표: 월간 달력 + Today 화면 + 일정 CRUD

## 현재 상태

- Next.js App Router 기반으로 앱 생성 완료
- 기획 문서 작성 완료
- 작업 목록 문서 작성 완료
- 기본 스타터 화면을 일정관리 대시보드 UI로 교체 완료
- `better-sqlite3` 기반 로컬 SQLite 저장 기능 추가 완료
- 서버 액션을 통해 일정 추가 / 수정 / 삭제 동작 완료
- 월간 달력에서 저장된 일정 개수 표시 완료
- Today 화면에서 오늘 일정 표시 완료
- 달력 날짜 선택 시 활성 날짜가 바뀌도록 구현 완료
- 일정 입력 폼이 선택한 날짜 기준으로 기본값을 가지도록 구현 완료
- 선택한 날짜 기준으로 일정 목록 필터링 구현 완료
- 선택 날짜 화면에서 수정 / 삭제 가능하도록 구현 완료
- 이전 달 / 다음 달 이동 구현 완료
- 오늘 버튼으로 현재 달 / 현재 날짜로 돌아오기 구현 완료
- 달력 그리드를 6주 전체 레이아웃으로 확장 완료
- 저장 / 수정 / 삭제 후 성공 메시지 표시 추가 완료
- 삭제 전에 확인하는 보호 UX 추가 완료

## 중요한 파일

- `docs/product-plan.md`: 제품 방향과 범위
- `docs/tasks.md`: 현재 작업 체크리스트
- `src/app/page.tsx`: 메인 일정관리 화면 UI
- `src/app/actions.ts`: 일정 생성 / 수정 / 삭제 서버 액션
- `src/lib/sqlite.ts`: 로컬 SQLite 초기화 및 조회 함수
- `data/schedule.sqlite`: 로컬 데이터베이스 파일

## 로컬 데이터베이스 메모

- 데이터베이스는 `data/schedule.sqlite` 파일에 저장됨
- 아래 SQLite 보조 파일이 같이 생길 수 있음
  - `data/schedule.sqlite-wal`
  - `data/schedule.sqlite-shm`
- 현재 실제 저장은 `better-sqlite3`를 직접 사용 중
- Prisma 스키마는 미래 확장 방향으로 남아 있지만, 현재 런타임 저장 경로는 직접 SQLite 헬퍼를 사용함

## 완료한 검증

- `npm run lint` 통과
- `npx next build --webpack` 통과

## 현재 알려진 이슈

- 기본 `next build`는 이 환경에서 Turbopack 제약 때문에 실패할 수 있음
- Prisma migration 흐름은 현재 환경에서 안정적이지 않음
- Prisma client는 아직 실제 저장 계층으로 사용하지 않음

## 다음으로 추천하는 작업

1. 선택 날짜 영역 안에 요약 일정 또는 미니 아젠다 추가
2. 하루 종일 일정 처리와 유효성 검사를 더 다듬기
3. 반복 일정 전에 날짜 처리 방식을 좀 더 명확하게 정리하기
4. 삭제 후 Undo 복구 UX를 추가할지 검토
5. 이후 반복 일정 기능 추가

## 다른 컴퓨터에서 이어서 작업하는 방법

1. 이 저장소를 clone 하거나 복사하기
2. `npm install` 실행
3. `npm run dev` 실행
4. Codex에게 아래 문서를 먼저 읽게 하기
   - `docs/product-plan.md`
   - `docs/tasks.md`
   - `docs/handoff.md`
5. 그 다음 다음 기능 작업을 이어서 진행하기

## 다음 세션에서 바로 쓸 문장

`docs/product-plan.md, docs/tasks.md, docs/handoff.md 읽고 현재 상태 파악한 뒤 이어서 작업해줘.`
