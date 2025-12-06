# Netflix Style Movie App

## 📖 프로젝트 소개
TMDB API를 활용한 Netflix 스타일의 영화 정보 웹 애플리케이션입니다.

## 🛠 기술 스택
- React 18
- TypeScript
- Vite
- React Router v6
- Axios
- TMDB API
- React Toastify

## 📦 설치 방법
```bash
npm install
```

## 🚀 실행 방법
```bash
# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 파일 미리보기
npm run preview
```

## 📁 프로젝트 구조
```
src/
├── components/     # 재사용 가능한 컴포넌트
│   ├── Header.tsx
│   ├── MovieCard.tsx
│   ├── Loading.tsx
│   └── Toast.tsx
├── pages/          # 페이지 컴포넌트
│   ├── SignIn.tsx
│   ├── Home.tsx
│   ├── Popular.tsx
│   ├── Search.tsx
│   └── Wishlist.tsx
├── utils/          # 유틸리티 함수
│   ├── api.ts
│   ├── auth.ts
│   └── localStorage.ts
├── styles/         # CSS 파일
│   ├── global.css
│   └── animations.css
├── types/          # TypeScript 타입 정의
│   └── movie.ts
└── App.tsx         # 메인 앱 컴포넌트
```

## 🌐 배포 주소
- GitHub Repository: https://github.com/kgd3443/WSD-ASSIGNMENT-02
- GitHub Pages: [배포 후 추가 예정]

## 👤 개발자
- 학번: [202021197]
- 이름: [김균도]

## 📝 과제 요구사항 체크리스트
- [x] Vite + React + TypeScript 프로젝트 설정
- [x] 필수 라이브러리 설치
- [x] 프로젝트 폴더 구조 생성
- [ ] TMDB API 연동
- [ ] 로그인/회원가입 페이지
- [ ] 홈 페이지 (최소 4개 API)
- [ ] 대세 콘텐츠 페이지
- [ ] 검색/필터링 페이지
- [ ] 위시리스트 페이지
- [ ] Local Storage 활용 (최소 3개)
- [ ] CSS 애니메이션
- [ ] 반응형 웹
- [ ] GitHub Pages 배포
- [ ] Gitflow 브랜치 전략