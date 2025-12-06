// src/utils/tmdb.ts
import axios from "axios";
import type { Movie, PagedResponse, Genre } from "../types/movie";

// 환경 변수 읽기
const apiKey = import.meta.env.VITE_TMDB_API_KEY as string | undefined;
const baseURL = import.meta.env.VITE_TMDB_BASE_URL as string | undefined;
const imageBaseURL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL as string | undefined;

// 간단한 안전장치 (개발 중 콘솔로 경고만)
if (!apiKey || !baseURL || !imageBaseURL) {
    console.warn(
        "[TMDB] 환경변수가 설정되지 않았습니다. .env.local 을 확인하세요."
    );
}

// axios 인스턴스
export const tmdbClient = axios.create({
    baseURL,
    params: {
        api_key: apiKey,
        language: "ko-KR",
        region: "KR",
    },
});

// 포스터/배경 이미지 URL 생성 함수
export const tmdbImageUrl = (
    path: string | null,
    size: "w200" | "w300" | "w500" | "original" = "w300"
): string | null => {
    if (!path || !imageBaseURL) return null;
    return `${imageBaseURL}/${size}${path}`;
};

/**
 * 공통 fetch 헬퍼
 * - TMDB 에러가 나면 콘솔에 찍고 다시 throw
 */
async function fetchFromTMDB<T>(url: string, params?: Record<string, unknown>) {
    try {
        const res = await tmdbClient.get<T>(url, { params });
        return res.data;
    } catch (error) {
        console.error(`[TMDB] 요청 실패: ${url}`, error);
        throw error;
    }
}

// =========================
//  영화 리스트 관련 API
// =========================

// 인기 영화
export function fetchPopularMovies(
    page = 1
): Promise<PagedResponse<Movie>> {
    return fetchFromTMDB<PagedResponse<Movie>>("/movie/popular", { page });
}

// 현재 상영작
export function fetchNowPlayingMovies(
    page = 1
): Promise<PagedResponse<Movie>> {
    return fetchFromTMDB<PagedResponse<Movie>>("/movie/now_playing", { page });
}

// 최고 평점 영화
export function fetchTopRatedMovies(
    page = 1
): Promise<PagedResponse<Movie>> {
    return fetchFromTMDB<PagedResponse<Movie>>("/movie/top_rated", { page });
}

// 개봉 예정작
export function fetchUpcomingMovies(
    page = 1
): Promise<PagedResponse<Movie>> {
    return fetchFromTMDB<PagedResponse<Movie>>("/movie/upcoming", { page });
}

// 장르 기반 discover
export function fetchDiscoverMovies(options: {
    page?: number;
    with_genres?: string; // "28,12" 이런 형식
    sort_by?: string; // "popularity.desc" 등
} = {}): Promise<PagedResponse<Movie>> {
    const { page = 1, ...rest } = options;
    return fetchFromTMDB<PagedResponse<Movie>>("/discover/movie", {
        page,
        ...rest,
    });
}

// 검색
export function searchMovies(
    query: string,
    page = 1
): Promise<PagedResponse<Movie>> {
    return fetchFromTMDB<PagedResponse<Movie>>("/search/movie", {
        query,
        page,
        include_adult: false,
    });
}

// =========================
//  상세 / 추천 / 장르
// =========================

// 영화 상세
export function fetchMovieDetail(movieId: number) {
    return fetchFromTMDB(`/movie/${movieId}`);
}

// 추천 영화
export function fetchMovieRecommendations(
    movieId: number,
    page = 1
): Promise<PagedResponse<Movie>> {
    return fetchFromTMDB<PagedResponse<Movie>>(
        `/movie/${movieId}/recommendations`,
        { page }
    );
}

// 장르 목록
export function fetchGenres(): Promise<{ genres: Genre[] }> {
    return fetchFromTMDB<{ genres: Genre[] }>("/genre/movie/list");
}
