// src/utils/tmdb.ts
import axios from "axios";

const apiKey = import.meta.env.VITE_TMDB_API_KEY as string;
const baseURL = import.meta.env.VITE_TMDB_BASE_URL as string;
const imageBaseURL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL as string;

if (!apiKey || !baseURL) {
    console.warn("TMDB API 환경변수가 설정되지 않았습니다.");
}

export const tmdbImageUrl = (path: string, size: "w200" | "w300" | "w500" | "original" = "w300") => {
    if (!path) return "";
    return `${imageBaseURL}/${size}${path}`;
};

export const tmdbClient = axios.create({
    baseURL,
    params: {
        api_key: apiKey,
        language: "ko-KR",
    },
});

// 인기 영화 가져오기 예시
export async function fetchPopularMovies(page = 1) {
    const res = await tmdbClient.get("/movie/popular", {
        params: { page },
    });
    return res.data; // { results, page, total_pages, ... }
}

// 지금 상영중 영화
export async function fetchNowPlaying(page = 1) {
    const res = await tmdbClient.get("/movie/now_playing", {
        params: { page },
    });
    return res.data;
}

// 장르별 영화
export async function fetchDiscoverMovies(params: { page?: number; with_genres?: string } = {}) {
    const res = await tmdbClient.get("/discover/movie", {
        params,
    });
    return res.data;
}
