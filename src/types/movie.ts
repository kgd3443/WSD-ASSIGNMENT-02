// src/types/movie.ts

// TMDB 영화 한 개에 대한 타입
export interface Movie {
    id: number;
    title: string;
    original_title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    vote_average: number;
    vote_count: number;
    genre_ids: number[];
    popularity: number;
}

// TMDB에서 많이 쓰는 페이징 응답 형식
export interface PagedResponse<T> {
    page: number;
    total_pages: number;
    total_results: number;
    results: T[];
}

// 장르 타입 (나중에 /search 페이지 필터에 사용)
export interface Genre {
    id: number;
    name: string;
}
