# Schedule

개인용 일정관리 프로그램입니다.

## 현재 사용 중인 기술

- Next.js
- TypeScript
- Tailwind CSS
- `better-sqlite3` 기반 로컬 SQLite

## 현재 구현된 기능

- 월간 달력 보기
- 오늘 일정 보기
- 일정 추가 / 수정 / 삭제
- 일정 메모
- 로컬 SQLite 저장
- 달력 날짜 클릭으로 선택
- 선택한 날짜 기준으로 일정 입력 기본값 설정
- 선택한 날짜 기준으로 일정 목록 필터링
- 이전 달 / 다음 달 이동
- 달력 헤더에서 오늘로 바로 이동

## 로컬 데이터베이스

- SQLite 파일 경로: `data/schedule.sqlite`
- 아래 파일이 함께 생길 수 있습니다:
  - `data/schedule.sqlite-wal`
  - `data/schedule.sqlite-shm`

## 로컬에서 실행하기

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

## 검증 명령어

```bash
npm run lint
npx next build --webpack
```

참고:
기본 `next build`는 환경에 따라 Turbopack 제한 때문에 실패할 수 있어서, 현재는 `--webpack` 기준으로 검증하고 있습니다.

## 중요한 문서

- `docs/product-plan.md`
- `docs/tasks.md`
- `docs/handoff.md`

## 다른 컴퓨터에서 이어서 작업하는 방법

1. 이 저장소를 clone 받기
2. `npm install` 실행
3. `npm run dev` 실행
4. 아래 문서를 먼저 읽기
   - `docs/product-plan.md`
   - `docs/tasks.md`
   - `docs/handoff.md`

## Codex에게 바로 이어서 시킬 때 사용할 문장

```text
docs/product-plan.md, docs/tasks.md, docs/handoff.md 읽고 현재 상태 파악한 뒤 이어서 작업해줘.
```

## 지금 다음으로 할 만한 작업

- 저장 / 삭제 후 성공 피드백 추가
- 선택한 날짜 화면 흐름 더 다듬기
- 날짜 처리 방식 정리
