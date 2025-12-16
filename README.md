# 🎬 Netflix Style Movie App (WSD-ASSIGNMENT-02)

## 📖 프로젝트 소개
TMDB(The Movie Database) API를 활용한 **Netflix 스타일의 영화 정보 웹 애플리케이션**입니다.  
영화 조회, 검색, 필터링, 찜 목록 관리, 로그인 기능을 포함한  
**React + TypeScript 기반 Single Page Application(SPA)** 프로젝트입니다.

---

## 🌐 배포 주소
- **GitHub Pages**  
  👉 https://kgd3443.github.io/WSD-ASSIGNMENT-02/

- **GitHub Repository**  
  👉 https://github.com/kgd3443/WSD-ASSIGNMENT-02

> GitHub Actions를 통한 **자동 배포**가 적용되어 있으며  
> `main` 브랜치에 머지 시 자동으로 배포됩니다.

---

## 🛠 기술 스택

- **Framework**: React 18 (Vite)
- **Language**: TypeScript
- **Routing**: React Router v6 (HashRouter)
- **HTTP Client**: Axios
- **UI / UX**: CSS (Transition / Animation)
- **Notification**: React Toastify
- **API**: TMDB API
- **Deployment**: GitHub Pages + GitHub Actions
- **Version Control**: Git + GitHub (Git Flow)

---

## 📦 설치 방법
```bash
npm install

```

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# ✨ 주요 기능

## 🔐 로그인 / 회원가입

이메일 형식 검증

Local Storage 기반 사용자 정보 저장

Remember Me 기능

로그인 상태에 따른 페이지 접근 제어

Toast 메시지 알림

## 🏠 Home

인기 / 최신 / 추천 영화 목록 조회

마우스 휠을 이용한 가로 스크롤 UX

영화 카드 Hover 시 설명 표시

Wishlist(찜) 토글 기능

## 🔥 요즘 뜨는 영화 (Popular)

인기 영화 목록 조회

Infinite Scroll 방식 적용

로딩 스피너 UI

## 🔍 검색 (Search)

영화 제목 검색

필터링 기능 포함

장르별 필터

평점 기준 필터

개봉 연도 필터

정렬 (인기순 / 평점순 / 최신순)

필터 초기화 버튼

Infinite Scroll

최근 검색어 Local Storage 저장

## ❤️ 위시리스트 (Wishlist)

Local Storage에 저장된 찜한 영화 목록 출력

API 재호출 없이 데이터 표시

찜 해제 기능 제공