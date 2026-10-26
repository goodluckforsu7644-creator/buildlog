# BuildLog 개발 환경과 Phase 0 결과

## 1. 확인 결과

- 확인일: 2026-10-26, Asia/Seoul 기준.
- Phase 0 완료: 문서·개발 도구 확인 및 구현 기준 결정.
- Phase 1은 시작하지 않았습니다. 패키지 설치, 가상환경 생성, 앱 코드 작성, DB 파일 생성, 원격 DB 접속은 수행하지 않았습니다.
- SQLite 확인은 `:memory:` 연결로 수행해 디스크에 DB 파일을 만들지 않았습니다.
- Git 초기화·커밋은 수행하지 않았습니다.

## 2. 문서 기준과 차이 정리

제품 기능 기준은 `docs/spec.md`, 개발 순서 기준은 `docs/plan.md`입니다. `frontend/mvp.md`와 동일 내용의 `frontend/PRD.md`는 초기 자료로 보존합니다. 현재 `docs/PRD.md`와 `frontend/spec.md`는 디스크에서 발견되지 않았습니다.

| 항목 | 초기 MVP 문서 | 현재 적용 기준 |
| --- | --- | --- |
| 공개 기록 열람 | 로그인 필요 여부 미정 | 로그인 사용자만 열람 |
| 댓글·좋아요 대상 | 상세 규칙 미정 | 공개 공부·오류 기록만, 할 일 제외 |
| 댓글 | 길이·수정·삭제 규칙 미정 | 1~500자, 본인 수정·삭제, 기록 작성자도 삭제 |
| 좋아요 | 중복·취소 미정 | 사용자·기록당 한 번, 다시 누르면 취소 |
| 공개 할 일·오류 검색 | 미정 | 모두 검색 가능 |
| 닉네임 | 중복·변경 미정 | 중복 불가, 변경 가능 |
| 오류 해결 | 해결 방법 필수 여부 미정 | 해결 상태에는 해결 방법 필수 |
| 신고 | 필요 여부 미정 | 공개 기록·댓글 신고, 운영자만 조회 |
| 기술 | 미정 | React·FastAPI·Supabase PostgreSQL, 초기 개발·테스트 SQLite3 |

현재 계획에만 있던 아래 세부 규칙은 Phase 0의 구현 기준으로 채택하고 `spec.md`에 연결했습니다. 기존 제품 기능과 충돌하지 않으며 기능 범위를 추가하지 않습니다.

- 닉네임: 2~20자, 한글 완성형·영문·숫자·밑줄 허용. 앞뒤 공백 제거 후 비교하며 영문 대소문자를 구분하지 않고 중복을 막습니다. 이메일도 앞뒤 공백 제거 후 소문자로 정규화해 중복을 막습니다.
- 비밀번호: 8~64자. 공백을 임의로 제거하거나 대소문자를 변경하지 않습니다. 원문과 해시는 API 응답·로그에 포함하지 않습니다.
- 기록·댓글·신고의 텍스트: 앞뒤 공백 제거, 중간 띄어쓰기·줄바꿈 유지. 길이는 정리한 값의 Unicode 코드 포인트 기준으로 서버·화면에서 일치시킵니다. 필수 항목의 공백만 있는 값은 거절합니다.
- 성공 후 이동: 회원가입은 로그인 화면, 로그인은 내 홈, 기록 저장·수정은 해당 목록으로 이동합니다. 실패 시 비밀번호를 제외한 입력과 기존 저장 데이터는 유지합니다.
- 완료·해결 전환 시 시각 저장, 취소 시 시각 제거, 다시 전환하면 새 시각 저장. 같은 상태에서 일반 내용만 수정하면 상태 전환 시각은 유지합니다. 미해결로 되돌려도 해결 방법은 유지합니다.
- 댓글은 오래된 순서, 기록은 최신 작성 순서이며 동일 시각은 ID로 순서를 고정합니다. 할 일은 미완료가 먼저입니다.
- 공개 검색: 공부는 제목·내용, 할 일은 제목, 오류는 제목·오류 내용·해결 방법. 내 오류 검색은 제목·오류 내용만입니다. 빈 검색어는 해당 목록 전체를 표시합니다.
- 신고 이유 1~500자, 사용자·대상당 한 번. 신고는 자동 삭제를 유발하지 않으며 별도 처리 상태 기능은 만들지 않습니다.
- 기록 비공개 전환 시 댓글·좋아요는 보존하되 다른 사용자에게 숨기고 재공개 시 복원합니다. 운영자는 기존 신고를 계속 확인할 수 있습니다.
- 수정 시각을 기록하고 공부·오류 상세, 할 일 목록에 표시합니다. 실제 변경 없이 요청만 반복한 경우 시각을 갱신하지 않습니다.
- 삭제는 확인 후 처리합니다. 기록 삭제 시 댓글·좋아요는 함께 제거하고, 신고는 대상 식별·신고 당시 최소 정보를 보존해 운영자가 확인할 수 있도록 합니다.
- 이메일 확인·비밀번호 찾기·할 일 마감일·중요도·내 할 일 검색·댓글 답글은 제외합니다.

## 3. 로컬 도구 확인

| 항목 | 확인값 | 판정 |
| --- | --- | --- |
| 기본 `python` | 3.15.1, `C:\Python315\python.exe` | 설치됨, 프로젝트 기본으로 사용하지 않음 |
| 프로젝트 Python | `py -3.13` → 3.13.14 | 사용할 인터프리터 |
| Python 3.13 경로 | `C:\Users\aicam\AppData\Local\Programs\Python\Python313\python.exe` | 확인됨 |
| pip | Python 3.13 환경의 26.1.2 | 확인됨 |
| SQLite3 | Python 3.13 내장 3.50.4 | 메모리 쿼리 성공, 외래키 활성화 값 1 |
| Node.js | 24.22.1 | 사용 가능 |
| npm | 11.19.1 | `npm.cmd`로 실행 확인 |
| Git | 실행 파일 있음, 프로젝트 `.git` 없음 | 초기화하지 않음 |
| 5173·8000 포트 | 확인 시 LISTEN 연결 없음 | 개발 주소로 사용 가능, 실행 시 재확인 |

PowerShell 실행 정책을 바꾸지 않고 `npm.cmd`와 가상환경의 Python 실행 파일을 직접 사용합니다. 기본 `python`이 3.15이므로 가상환경은 반드시 `py -3.13`으로 생성합니다.

## 4. 기술과 버전 기준

다음은 PyPI·npm 공식 레지스트리의 안정 배포 메타데이터를 조회해 선택한 기준 버전입니다. Python 요구 버전, Node 엔진, 주요 peer 의존성 범위는 확인했습니다. 설치·의존성 해결·실행 호환성의 최종 확인은 Phase 1에서 진행하며 현재 완료한 테스트로 표시하지 않습니다.

| 도구 | 기준 버전 | 처음 필요한 단계 |
| --- | --- | --- |
| FastAPI | 0.162.0 | Phase 1 |
| Uvicorn | 0.54.0 | Phase 1 |
| Pydantic | 2.14.1 | Phase 1 |
| pydantic-settings | 2.16.1 | Phase 1 |
| SQLAlchemy | 2.1.6 | Phase 2 |
| Alembic | 1.20.1 | Phase 2 |
| pwdlib[argon2] | 0.3.1 | Phase 2~3 |
| Psycopg | 3.3.6 | Phase 13 |
| pytest / HTTPX | 9.1.1 / 0.28.1 | Phase 1 |
| React / React DOM | 19.3.1 / 19.3.1 | Phase 1 |
| Vite / React plugin | 8.3.5 / 6.1.2 | Phase 1 |
| Vitest | 5.0.5 | Phase 1 |
| React Testing Library | 16.3.3 | Phase 1 |
| Playwright | 1.64.1 | 브라우저 검증 도입 시 |

React는 JavaScript·JSX와 CSS로 구성하고 Vite를 사용합니다. 서버는 동기 SQLAlchemy 세션, Pydantic 스키마, Alembic 단일 마이그레이션 이력을 사용합니다. 필요한 단계에서만 의존성을 추가합니다. DOM 테스트 환경과 필요한 peer 의존성은 Phase 1에서 함께 해결하고 고정 의존성 목록과 npm 잠금 파일에 기록합니다.

## 5. 인증과 권한 결정

SQLite3만으로 초기 개발할 수 있도록 FastAPI 자체 회원 인증을 선택합니다. Supabase는 DB로 사용하고 Supabase Auth는 사용하지 않습니다. 이는 Phase 0에서 선택한 구현 방식입니다.

- 사용자에게 정규화 이메일, 표시 닉네임, 닉네임 비교용 키, Argon2 비밀번호 해시, 운영자 여부를 저장합니다.
- 로그인 시 추측하기 어려운 무작위 세션 토큰을 발급하고, DB에는 토큰 해시·사용자 ID·만료 시각을 저장합니다.
- 토큰은 `HttpOnly`, `SameSite=Lax` 쿠키로 전달합니다. 운영 환경에서는 HTTPS와 `Secure`를 필수로 사용합니다. React의 localStorage에 인증 정보를 저장하지 않습니다.
- 세션은 24시간 고정 만료이며 만료 시 재로그인을 안내합니다. 로그아웃 시 DB 세션을 무효화하고 쿠키를 지웁니다.
- 변경 요청은 허용한 Origin인지 검사합니다. 인증 후 변경 요청에는 세션에 연결된 CSRF 토큰을 `X-CSRF-Token`으로 요구하고, 해당 토큰은 인증된 API에서 제공합니다. 로그인·가입에도 JSON 입력과 Origin 검사를 적용합니다.
- React는 `credentials: include`로 호출합니다. CORS는 `http://localhost:5173`만 허용하며 인증 쿠키 사용 시 와일드카드를 사용하지 않습니다.
- 개발 주소는 localhost로 통일합니다. 운영도 같은 사이트 아래 화면과 API를 배치하는 것을 기준으로 하며 다른 사이트로 나누면 쿠키 정책을 다시 설계합니다.
- 사용자 ID·작성자·운영자 여부는 서버가 인증 정보에서 결정합니다. 회원가입 요청으로 운영자 권한을 지정할 수 없습니다.
- 첫 운영자 생성·승격은 로컬 관리 명령으로 처리합니다. 공개 승격 API는 만들지 않고 최초 비밀번호는 구현 시 로컬에서 입력합니다.
- Supabase 연결도 FastAPI에서 수행하며 브라우저용 DB 키는 필요하지 않습니다. 앱 테이블을 Data API 공개 대상에서 제외하는 방침으로 하고 Phase 13에서 실제 설정과 우회 접근 차단을 검증합니다.

## 6. 실행 위치와 환경 변수

| 설정 | 개발 기준 |
| --- | --- |
| React 주소 | `http://localhost:5173` |
| FastAPI 주소 | `http://localhost:8000` |
| API 접두 경로 | `/api` |
| 상태 확인 | `/api/health`, 비밀 정보는 응답하지 않음 |
| API 명세 화면 | FastAPI `/docs`, Phase 1에서 생성 |
| SQLite3 파일 | 프로젝트 루트의 `database/buildlog.sqlite3` |
| 서버 설정 파일 | `backend/.env`, Phase 1에서 예제 준비 |
| 프런트 설정 파일 | `frontend/.env`, Phase 1에서 예제 준비 |
| `APP_ENV` | `development` / `test` / `production` |
| `DATABASE_URL` | SQLite3는 `sqlite+pysqlite:///`와 절대 경로 사용, Supabase는 서버 전용 PostgreSQL 연결 문자열 |
| `CORS_ORIGINS` | `["http://localhost:5173"]` 형식의 JSON 배열 |
| `SESSION_TTL_SECONDS` | `86400` |
| `SESSION_COOKIE_SECURE` | 개발 `false`, 운영 `true` |
| `VITE_API_BASE_URL` | `http://localhost:8000/api`, 공개 가능한 값 |

SQLite 경로는 프로젝트 루트에서 절대 경로로 해석하여 실행 위치에 따라 다른 DB를 만들지 않게 합니다. 시각은 UTC로 저장·응답하고 화면에서는 Asia/Seoul로 표시합니다. 테스트 DB는 임시 영역으로 분리하고 개발·운영 DB를 삭제하지 않습니다.

서버 DB 연결 정보와 비밀값은 `VITE_` 변수에 넣지 않습니다. 선택한 세션 방식에는 JWT 서명 키가 필요하지 않습니다. 비밀값이 추가로 필요하면 로컬에서 생성하고 예제에는 빈 항목만 둡니다.

## 7. 공통 API 기준

- 성공 응답은 JSON이며 생성은 201, 삭제 성공은 본문 없는 204를 기본으로 합니다.
- 401은 미로그인·만료, 403은 권한 부족·CSRF 오류, 404는 없는 대상 또는 타인의 비공개 대상, 409는 중복, 422는 입력 오류입니다.
- 오류 형식은 `{"error":{"code":"validation_error","message":"입력 내용을 확인해 주세요","fields":{}}}`로 통일하고 항목별 안내는 `fields`에 넣습니다.
- 내 기록 조회는 서버에서 작성자를 제한합니다. 타인의 비공개 ID를 직접 조회·변경·검색해도 내용을 반환하지 않습니다.
- 상세 예외·SQL·접속 문자열은 응답에 포함하지 않습니다. React는 실패 시 입력과 직전 저장 상태를 보존합니다.
- 화면은 입력을 돕고 서버의 Pydantic·서비스 처리·필요한 DB 제약으로 최종 검증합니다.

## 8. 향후 사용할 실행 명령

아래는 Phase 1 이후 구현할 예정 명령입니다. 현재 앱과 테스트가 이미 실행 가능하다는 뜻이 아닙니다.

```powershell
# 프로젝트 루트, Phase 1
py -3.13 -m venv backend/.venv
backend/.venv/Scripts/python.exe -m pip install -r backend/requirements.txt

# backend/에서 실행
.venv/Scripts/python.exe -m uvicorn app.main:app --reload --host localhost --port 8000
.venv/Scripts/python.exe -m pytest

# frontend/에서 실행, 최초 잠금 파일 생성 후에는 npm ci 사용
npm.cmd install
npm.cmd run dev -- --host localhost --port 5173 --strictPort
npm.cmd run test -- --run
npm.cmd run build

# backend/, 사용자·DB 구조를 만든 Phase 2 이후
.venv/Scripts/python.exe -m alembic upgrade head
```

각 명령은 실제 구현한 Phase에서 결과를 기록합니다. Supabase에서는 전용 검증 DB 연결 대상을 확인한 뒤 마이그레이션을 적용합니다.

## 9. 발견 사항과 후속 작업

| 항목 | 현재 상태 | 처리 시점 |
| --- | --- | --- |
| 루트 `.gitignore` | 없으며 `frontend/.gitignore`만 있음. backend·database에는 적용되지 않음 | Phase 1 파일 생성 전에 루트 규칙 생성 |
| SQLite3 제외 | 현재 frontend 규칙에도 없음 | Phase 1에서 DB 본체·journal·wal·shm 및 테스트 생성물 제외 |
| Python 선택 | PATH 기본은 3.15 | Phase 1에서 `py -3.13` 명시 |
| FastAPI·React 실행 | 앱·의존성 미생성 | Phase 1에서 처음 검증 |
| Supabase | 프로젝트·접속 미검증 | Phase 13 전에 검증용 프로젝트와 연결 정보 준비 |
| Safari 확인 | 현재 Windows만으로 실제 Safari 검증 불가 | Phase 12에 macOS/iOS 또는 이용 가능한 검증 환경 필요. WebKit 자동화와 Safari 실기기 검증 구분 |

`.env`·`.env.*` 제외, `.env.example` 허용이라는 기존 방침을 유지합니다. Phase 0에서는 발견 사항만 기록하고 `.gitignore` 자체는 변경하지 않습니다.

## 10. Phase 0 판정과 다음 작업

- 문서 확인: 완료. 초기 문서와 현재 명세 차이를 정리하고 기준을 통일했습니다.
- 도구 확인: 완료. Python·Node.js 추가 설치는 필요하지 않습니다.
- SQLite3 확인: 완료. 메모리 DB에서 SQL과 외래키 활성화를 확인했습니다.
- 인증·DB·API·세부 규칙 결정: 완료. 이 문서와 spec·plan에 기록했습니다.
- 버전 조사: 완료. 설치·실행 호환성 최종 확인은 Phase 1에 수행합니다.
- 앱 자동 테스트·화면 확인: 해당 없음. 아직 코드와 화면이 없어 수행 완료로 간주하지 않습니다.
- Phase 1 시작을 위해 사용자가 제공할 값: 없습니다.

다음에는 Phase 1만 진행합니다. 루트 제외 규칙을 먼저 준비하고 Python 3.13 가상환경·FastAPI·React를 구성해 상태 확인 API 호출을 검증합니다.

## 11. 확인 자료

- [FastAPI 인증·비밀번호 해시](https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/) — 비밀번호 해시 사용 참고. BuildLog는 DB 세션 방식 채택.
- [Vite 개발 환경](https://vite.dev/guide/)
- [Supabase PostgreSQL 연결](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [PyPI FastAPI 메타데이터](https://pypi.org/pypi/fastapi/json), [SQLAlchemy](https://pypi.org/pypi/sqlalchemy/json), [Alembic](https://pypi.org/pypi/alembic/json)
- [npm React 메타데이터](https://registry.npmjs.org/react/latest), [Vite](https://registry.npmjs.org/vite/latest), [Vitest](https://registry.npmjs.org/vitest/latest)
