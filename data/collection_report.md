# 네이버웹툰 수집 및 구조 진단 보고서

공개 목록에서 확인한 고유 작품 **4,225건**을 작품별 한 행으로 저장했습니다. 공개 작품 정보와 오래된순 첫 회차 목록의 요청 대상은 4,225개 작품이며, 아직 요청 응답이 없는 작품·요청 종류 조합은 0개입니다. 인증 제한과 원문 미제공 등으로 확인되지 않은 값은 빈칸으로 남겼습니다. 삭제 작품까지 포함한 역사적 모집단의 완전성을 보증하지는 않습니다.

- 수집 시작 응답 저장 시각(UTC): 2026-10-17T05:04:51.741110+00:00
- 보고서 생성 시각(UTC): 2026-10-17T07:29:14.658725+00:00
- 수집 방식: `.env`의 API 키를 메모리에서 읽어 Firecrawl v2 scrape, batch/scrape 및 브라우저 executeJavascript 사용. 키는 결과물에 포함하지 않음.
- 시작 URL: https://comic.naver.com/webtoon , https://comic.naver.com/webtoon?tab=finish , https://comic.naver.com/webtoon?tab=genre
- 한 행은 작품 ID 하나. CSV는 UTF-8 BOM, 결측치는 빈 문자열. 다중 태그와 출처는 JSON 배열 문자열.
- 본 보고서는 수집과 구조 진단을 다룹니다. 원본 정제나 결측 대치를 하지 않았습니다. EDA와 시각화는 별도 eda/eda_report.md 및 eda/naver_webtoon_eda.html에 분리합니다.

## 수집 규모

- 고유 작품: **4,225건**
- 주요 10개 항목이 모두 채워진 작품: **3,975건**
- 작품 정보를 수집했지만 주요 항목에 결측이 있는 작품: **250건**
- 상세 미수집: **0건**
- 상세 응답에 작품 정보가 없는 등 기타 실패: **0건**
- 공개 데이터 요청 종류 조합: 8,450개. 미해결 요청: 249개. HTTP 상태별: `{'401': 249}`.
- 최초 HTML 요청은 목록 발견 순서대로 수행했으며, 이후 확보한 전체 ID를 대상으로 공개 메타데이터 수집을 수행했습니다. 무작위 표본 추출이나 장르별 통계 분석을 수행하지 않았습니다.
- 현재 크레딧·배치 오류 및 미수집 ID는 `collection_sources/credit_*.json`, `collection_sources/batch_*`, `collection_failures.json` 참조.

## 목록 탐색 및 범위 검증

요일 전체와 매일+ 목록, 완결 목록, 기본 10개 장르를 탐색했습니다. 완결 정렬은 인기순으로 전환하고, 장르 목록은 화면의 총 작품 수와 추출한 고유 ID 수를 대조했습니다. 아래 숫자는 목록 간 중복을 포함하므로 합산하면 안 됩니다.

| 목록 | 선택된 장르·정렬 | 고유 ID | 화면 총수 |
|---|---|---:|---:|
| https://comic.naver.com/webtoon | 인기순 | 792 | 미표시 |
| https://comic.naver.com/webtoon?tab=dailyPlus | 인기순, 전체, 전체 | 275 | 미표시 |
| https://comic.naver.com/webtoon?tab=genre&genre=ACTION | #액션, 인기순, 전체, 전체 | 354 | 354 |
| https://comic.naver.com/webtoon?tab=genre&genre=PERIOD | #연도별웹툰, 2005년, 전체, 전체 | 2 | 2 |
| https://comic.naver.com/webtoon?tab=genre&genre=PERIOD | #연도별웹툰, 2006년, 전체, 전체 | 9 | 9 |
| https://comic.naver.com/webtoon?tab=genre&genre=PERIOD | #연도별웹툰, 2007년, 전체, 전체 | 24 | 24 |
| https://comic.naver.com/webtoon?tab=genre&genre=PERIOD | #연도별웹툰, 2008년, 전체, 전체 | 54 | 54 |
| https://comic.naver.com/webtoon?tab=genre&genre=PERIOD | #연도별웹툰, 2009년, 전체, 전체 | 77 | 77 |
| https://comic.naver.com/webtoon?tab=genre&genre=PERIOD | #연도별웹툰, 2010년, 전체, 전체 | 107 | 107 |
| https://comic.naver.com/webtoon?tab=genre&genre=PERIOD | #연도별웹툰, 2011년, 전체, 전체 | 140 | 140 |
| https://comic.naver.com/webtoon?tab=genre&genre=PERIOD | #연도별웹툰, 2012년, 전체, 전체 | 163 | 163 |
| https://comic.naver.com/webtoon?tab=genre&genre=PERIOD | #연도별웹툰, 2013년, 전체, 전체 | 181 | 181 |
| https://comic.naver.com/webtoon?tab=genre&genre=PERIOD | #연도별웹툰, 2014년, 전체, 전체 | 202 | 202 |
| https://comic.naver.com/webtoon?tab=genre&genre=PERIOD | #연도별웹툰, 2015년, 전체, 전체 | 223 | 223 |
| https://comic.naver.com/webtoon?tab=genre&genre=PERIOD | #연도별웹툰, 2016년, 전체, 전체 | 214 | 214 |
| https://comic.naver.com/webtoon?tab=genre&genre=PERIOD | #연도별웹툰, 2017년, 전체, 전체 | 220 | 220 |
| https://comic.naver.com/webtoon?tab=genre&genre=PERIOD | #연도별웹툰, 2018년, 전체, 전체 | 275 | 275 |
| https://comic.naver.com/webtoon?tab=genre&genre=PERIOD | #연도별웹툰, 2019년, 전체, 전체 | 393 | 393 |
| https://comic.naver.com/webtoon?tab=genre&genre=PERIOD | #연도별웹툰, 2020년, 전체, 전체 | 552 | 552 |
| https://comic.naver.com/webtoon?tab=genre&genre=PERIOD | #연도별웹툰, 2021년, 전체, 전체 | 738 | 738 |
| https://comic.naver.com/webtoon?tab=genre&genre=PERIOD | #연도별웹툰, 2022년, 전체, 전체 | 969 | 969 |
| https://comic.naver.com/webtoon?tab=genre&genre=PERIOD | #연도별웹툰, 2023년, 전체, 전체 | 1,140 | 1140 |
| https://comic.naver.com/webtoon?tab=genre&genre=PERIOD | #연도별웹툰, 2024년, 전체, 전체 | 1,344 | 1344 |
| https://comic.naver.com/webtoon?tab=genre&genre=PERIOD | #연도별웹툰, 2025년, 전체, 전체 | 1,508 | 1508 |
| https://comic.naver.com/webtoon?tab=genre&genre=PERIOD | #연도별웹툰, 2026년, 전체, 전체 | 1,523 | 1523 |
| https://comic.naver.com/webtoon?tab=genre&genre=BRAND | #브랜드웹툰, 인기순, 전체, 전체 | 229 | 229 |
| https://comic.naver.com/webtoon?tab=genre&genre=COMIC | #개그, 인기순, 전체, 전체 | 231 | 231 |
| https://comic.naver.com/webtoon?tab=genre&genre=DAILY | #일상, 인기순, 전체, 전체 | 216 | 216 |
| https://comic.naver.com/webtoon?tab=dailyPlus | 인기순, 전체, 전체 | 275 | 미표시 |
| https://comic.naver.com/webtoon?tab=genre&genre=DRAMA | #드라마, 인기순, 전체, 전체 | 774 | 774 |
| https://comic.naver.com/webtoon?tab=genre&genre=FANTASY | #판타지, 인기순, 전체, 전체 | 747 | 747 |
| https://comic.naver.com/webtoon?tab=finish | 인기순, 전체, 전체 | 3,144 | 미표시 |
| https://comic.naver.com/webtoon?tab=genre&genre=HISTORICAL | #무협/사극, 인기순, 전체, 전체 | 115 | 115 |
| https://comic.naver.com/webtoon?tab=genre&genre=PURE | #로맨스, 인기순, 전체, 전체 | 1,226 | 1226 |
| https://comic.naver.com/webtoon?tab=genre&genre=SENSIBILITY | #감성, 인기순, 전체, 전체 | 66 | 66 |
| https://comic.naver.com/webtoon?tab=genre&genre=SPORTS | #스포츠, 인기순, 전체, 전체 | 68 | 68 |
| https://comic.naver.com/webtoon?tab=genre&genre=THRILL | #스릴러, 인기순, 전체, 전체 | 414 | 414 |

초기 Firecrawl 뷰포트 높이 100,000픽셀 때문에 추가 로딩이 멈추는 현상이 있었습니다. 스크린샷 액션에서 1,440×1,000 뷰포트를 설정한 뒤 스크롤해 해결했습니다. 각 목록의 로딩 과정별 건수와 마지막 URL은 `collection_coverage.json` 및 원본의 `actions.javascriptReturns`에 보존했습니다. 끝에서 여러 차례 건수가 유지되는지 확인했습니다.

요일·완결처럼 화면 총수가 표시되지 않는 목록은 스크롤 종료를 확인했지만 독립된 모집단 총수와의 대조는 할 수 없습니다. 연도별·브랜드 목록도 추가 탐색했으며, 연도 필터는 ID 발굴에만 사용하고 최초 연재일이나 시작연도로 사용하지 않았습니다. 삭제·서비스 종료·검색 비노출·로그인/성인인증 전용 작품, 장르 미분류 작품 등은 누락될 수 있습니다. 베스트도전·도전만화·시리즈 전용 작품은 요청한 정식 웹툰 목록 범위에 포함하지 않았습니다.

## 변수 정의와 추출 기준

| 변수 | 기준 |
|---|---|
| 작품 ID | 목록 URL의 titleId 원문. 텍스트로 저장 |
| 작품명 | 목록 제목 또는 작품 정보 h2의 제목 텍스트. 상태 아이콘 텍스트는 별도 추출 |
| 작가명 | 목록 작가 표기 또는 작품 페이지의 글·그림·원작 인명. 여러 표기는 화면 순서대로 `/` 연결. 작가별 정규화 없음 |
| 대표 장르 | 공개 curationTagList 중 curationType이 GENRE_*인 태그. custom tag 이름과 구별. HTML/목록만 있는 경우 기본 장르 소속을 이용하며 복수이면 임의 선택하지 않음 |
| 세부 태그 | 공개 tagName 전체를 원래 순서의 JSON 배열로 보존. 대표 장르 태그도 삭제하지 않음. 빈 배열이 관측되면 []로 보존하며 요청 실패의 빈칸과 구분. HTML만 확보한 경우 해시태그 표기가 남을 수 있음 |
| 최초 연재일 | 오래된순 첫 목록에서 실제 첫 게시 회차 ID(no=1)의 게시일이 확인된 경우만 기록. 예고편·프롤로그가 no=1이면 그 게시일 포함. 확인 불가 시 결측 |
| 연재 시작연도 | 확인된 최초 연재일의 연도 부분만 추출. 다른 연도 태그나 저작권 연도로 대체하지 않음 |
| 연재 상태 | 공개 rest=true는 휴재, finished=true는 완결, 둘 다 false는 연재 중. HTML 배지와 목록 분류는 대체 출처. 원문 플래그도 별도 보존 |
| 총 회차 수 | 공개 회차 응답의 totalCount 또는 HTML의 총 N화. 최신 회차 번호에서 추정하지 않음. 미리보기·유료 회차가 포함될 수 있음 |
| 작품 URL | ID로 식별되는 기본 작품 목록 URL. 실제 상세 요청 URL은 원본 metadata.sourceURL에 보존 |
| 보조 열 | 최초 날짜 원문, 첫 회차명·ID, 태그 원문, 상태 원문, 출처 목록, 상세 수집 상태와 원본 파일 경로 |

원문 날짜가 `YY.MM.DD`이면 Python `%y.%m.%d` 규칙으로 ISO 날짜로 변환했습니다(00–68 → 2000–2068, 69–99 → 1969–1999). 원문 날짜를 별도 열에 보존하며, 변환 실패는 결측으로 남깁니다. 이는 결측 날짜의 추정이나 연재 시작일 추정이 아닙니다. 현재 태그와 장르는 수집 시점의 표시값이며 연재 시작 당시 장르를 뜻하지 않습니다.

## 변수별 결측치

| 변수 | 결측 건수 | 결측률 |
|---|---:|---:|
| 작품 ID | 0 | 0.00% |
| 작품명 | 0 | 0.00% |
| 작가명 | 0 | 0.00% |
| 대표 장르 | 0 | 0.00% |
| 세부 태그 | 0 | 0.00% |
| 최초 연재일 | 250 | 5.92% |
| 연재 시작연도 | 250 | 5.92% |
| 연재 상태 | 0 | 0.00% |
| 총 회차 수 | 249 | 5.89% |
| 작품 URL | 0 | 0.00% |
| 최초 연재일 원문 | 250 | 5.92% |
| 첫 게시 회차명 | 250 | 5.92% |
| 첫 게시 회차 ID | 250 | 5.92% |
| 장르 태그 원문 | 0 | 0.00% |
| 상태 원문 | 0 | 0.00% |
| 수집 출처 | 0 | 0.00% |
| 상세 수집 상태 | 0 | 0.00% |
| 상세 원본 파일 | 0 | 0.00% |

## 중복 및 원본 보존

- 최종 CSV의 중복 ID: **0개**, 중복 초과 행: **0개**.
- 모든 탐색 응답에서 추출한 목록 관측: 20,182건. 반복 관측된 작품 ID 4,211개. 같은 목록의 재시도와 여러 요일·장르 중복을 포함함.
- 한 작품 한 행이라는 요청에 따라 ID 기준으로 관측을 연결했으며, 목록 중복 관측을 지우지 않고 `collection_observations.jsonl`에 보존. 서로 다른 작가명·제목·상태 표기 등은 원본과 관측 기록에서 확인 가능.
- 모든 Firecrawl 응답의 HTML과 메타데이터는 `collection_sources/`에 보존. 기존 `.env`는 변경하지 않음. 수집 과정의 진단용 응답도 보존.
- 원본 파일 SHA-256 목록: `collection_source_manifest.json`. 별도 이미지·웹툰 회차 본문 파일은 저장하지 않음.

## 정책·제한 및 실패 기록

- 확인한 정책: https://comic.naver.com/robots.txt , https://member.webtoon.naver.com/policy/terms . robots 원문은 `collection_sources/robots.txt`에 보존.
- robots.txt의 `/webtoon/list?*&page=` 및 `/webtoon/detail` 제한을 반영하여 상세 배치는 `titleId=...&sort=ASC`만 요청. 회차 본문 및 회차 페이지네이션은 탐색하지 않음. 목록 화면의 스크롤을 통한 추가 로딩은 수행.
- 최초 정렬 동작 진단에서 UI가 `page=1&sort=ASC` 주소를 생성하는 것을 확인했으며, 해당 진단 응답은 보존하되 데이터 추출에서 제외. 이후 page 매개변수 없는 허용 URL을 사용.
- Firecrawl 계정 동시 실행 한도 2개를 확인하고 그 한도를 사용. 자동 크레딧 구매, 로그인·성인인증·유료 접근 우회는 수행하지 않음.
- 사용자 추가 지시에 따라 추가 충전 없이 기존 크레딧만 사용했습니다. 공개 메타데이터를 묶어 수집하는 방식으로 전환해 작품별 브라우저 렌더링에 필요한 크레딧을 절약했습니다. `미수집`은 HTTP 요청 실패와 구분됩니다.
- 네트워크·렌더링·인증·404 등 실패는 API 배치 오류와 개별 상세 수집 상태를 통해 구분. 목록 총수 일치가 과거 삭제 작품을 포함한 전체 역사적 작품의 완전성을 뜻하지 않음.

## 검증 결과

- CSV 저장 후 다시 읽어 4,225행, 18열 및 헤더 일치 확인.
- 전체 행의 ID 형식·중복, 작품 URL의 ID, 날짜 형식·연도 일치·미래 날짜, 첫 게시 회차 ID, 총 회차 수 형식, 태그 JSON 배열, 주요 필드의 문자 손실 여부 검증.
- 구조 검증 오류: **0건**. 상세: `collection_validation.json`.
- CSV SHA-256: `f7bb8bc4cbdd9ae8ed0781a7d3e8acbd8db559f4f12c527b6a3b44016330f25e`

확인되지 않은 값은 추정하지 않고 결측으로 유지했습니다. 이 수집 보고서에는 데이터 정제나 통계 분석 결과를 포함하지 않았습니다. 후속 EDA는 원본을 변경하지 않고 별도 결과물로 제공합니다.

## 공개 메타데이터 수집과 실패 구분

작품 페이지의 실제 네트워크 요청을 확인하고 동일한 공개 JSON을 Firecrawl 브라우저 안에서 수집했습니다. 개인 인증 정보를 사용하지 않도록 credentials: omit을 지정했습니다.

- 작품 정보: `https://comic.naver.com/api/article/list/info?titleId=ID`
- 오래된순 첫 회차 목록: `https://comic.naver.com/api/article/list?titleId=ID&page=1&sort=ASC`
- 공개 /api/ 경로는 robots.txt 차단 대상이 아니며, 회차 목록은 화면과 동일한 첫 페이지만 요청했습니다. 회차 API의 두 번째 이후 페이지와 회차 본문은 탐색하지 않았습니다.
- 한 Firecrawl 실행에서 20개 작품을 처리했습니다. 브라우저 동시 실행 2개, 작품별 두 메타데이터 요청 후 700ms 대기. 403·429 수신 시 추가 요청을 중단하도록 구성했습니다.
- 인증이 필요한 401 응답은 로그인·성인인증 등으로 우회하지 않았습니다. HTTP 200이어도 원문 값이 없으면 결측입니다.
- 첫 공개 API 진단에서 성인 작품의 로그인 화면 이동으로 상대 URL 호스트가 바뀐 실패가 있었습니다. 비로그인 공개 작품을 기준 페이지로 고정하고 comic.naver.com 절대 URL로 재수집했습니다. 진단 원본도 보존했습니다.
- 기존 HTML 배치의 미실행 요청은 크레딧과 렌더링 효율 때문에 취소하고 공개 메타데이터 방식으로 교체했습니다. 받은 응답은 보존했습니다.
- 원본 JSON, 요청 URL, HTTP 상태, 수집 시각은 collection_sources/public_metadata/의 Firecrawl actions.javascriptReturns에 저장했습니다. CSV의 상세 원본 파일 열에서 해당 응답을 찾을 수 있습니다.
- 실패한 요청 시도 310개 중 재수집 후에도 미해결인 요청 종류 조합은 249개입니다. 자세한 ID·경로·상태는 collection_public_api_audit.json 및 collection_failures.json 참조.
- Firecrawl 실행 실패 또는 JSON 파싱 실패 원본 묶음은 7개이며 경로를 collection_public_api_audit.json에 보존했습니다. 이 원본들은 재시도 성공 후에도 삭제하지 않았으므로 현재 미해결 요청 수와 구별해야 합니다.
- 성공한 공개 JSON의 작품명·대표 장르 코드·총 회차 수·첫 회차 날짜 원문을 CSV 전체와 대조했습니다.

추가 검증: 별도의 Artifact Tool CSV 파서로 4,225행·18열의 전체 값을 재읽어 Python CSV 파서 결과와 전부 일치함을 확인했습니다. 결과는 collection_artifact_validation.json에 보존했습니다.

최종 Firecrawl 잔여 크레딧: 306. 추가 충전 없이 수집했습니다. 결과물과 수집 원본에 API 키가 포함되지 않았는지도 검사했습니다.

최초 연재일 결측 250건 가운데 인증 제한 응답이 있는 작품은 249건이며, 나머지 1건은 첫 게시 회차가 노출되지 않아 날짜를 추정하지 않았습니다. 세부 기록: collection_non_auth_missing_dates.json.
