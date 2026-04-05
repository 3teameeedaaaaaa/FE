# 🌊 Project Water (우상향) 📈

> **"주식 투자자의 불안을 확신으로, 인지왜곡을 깨뜨리는 AI 투자 심리 케어 서비스"**

본 프로젝트는 주식 투자 과정에서 발생하는 심리적 불안과 인지왜곡(Cognitive Distortion)을 AI 상담을 통해 진단하고, 객관적인 투자 판단을 돕기 위해 개발된 백엔드 시스템입니다.

---

## 🛠 Tech Stack (Front End)

| Category               | Technology     |
| :--------------------- | :------------- |
| **Framework**          | React ^v19     |
| **Language**           | TypeScript     |
| **Styling**            | TailwindCSS v4 |
| **UI Library**         | shadcn/ui      |
| **State Management**   | zustand        |
| **HTTP Client**        | Axios          |
| **Data Visualization** | Rechart        |
| **Animation**          | Framer-motion  |

---

## Formatting

1. prettier 관련

- **`singleQuote: true`**: 쌍따옴표(`"`) 대신 홑따옴표(`'`) 사용.
- **`semi: true`**: 문장 끝에 세미콜론(`;`) 필수 사용.
- **`tabWidth: 2`**: 탭 크기를 공백 2칸으로 설정 (가독성 향상).
- **`trailingComma: "all"`**: 객체나 배열 마지막 요소 뒤에 콤마를 항상 붙임 (Git diff 발생 시 줄바꿈 최소화).
- **`bracketSpacing: true`**: 객체 리터럴에서 괄호 양쪽에 공백 넣음 (`{ foo: bar }`).
- **`arrowParens: "always"`**: 화살표 함수에서 파라미터가 1개일 때도 괄호를 항상 사용 `(x) => x`.
- **`endOfLine: "auto"`**: OS 간 줄바꿈 문자 차이(`LF`/`CRLF`)로 인한 오류 방지.
- 추가 플러그인 : prettier-plugin-tailwindcss 사용

2. eslint

- eslint-plugin-simple-import-sort: import sorting

---

## 📂 Directory Structure

```text
src/
├── assets/            # 이미지, 폰트 등
├── components/            # UI 컴포넌트
├── constant/            # Layout 위치
├── hooks/            # custom hook 함수
├── layout/            # Layout 위치
├── pages/            # 페이지 단위
├── service/            # API 호출
├── store/            # 전역 상태 관리
├── type/             # type 정의
└── util/             # util 함수
```

---
