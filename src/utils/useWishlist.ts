// src/utils/useWishlist.ts
import { useEffect, useState } from "react";
import type { Movie } from "../types/movie";

const STORAGE_KEY = "movieWishlist";

// LocalStorage에 저장할 최소 정보만 사용
export type WishlistMovie = Pick<Movie, "id" | "title" | "poster_path" | "vote_average">;

function loadInitialWishlist(): WishlistMovie[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
        return [];
    } catch {
        return [];
    }
}

export function useWishlist() {
    const [wishlist, setWishlist] = useState<WishlistMovie[]>(() => loadInitialWishlist());

    // state가 변경될 때마다 LocalStorage에 저장
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
        } catch (e) {
            console.warn("wishlist 저장 실패", e);
        }
    }, [wishlist]);

    // 찜 toggle 함수
    const toggleWishlist = (movie: WishlistMovie) => {
        setWishlist((prev) => {
            const exists = prev.some((m) => m.id === movie.id);
            if (exists) {
                return prev.filter((m) => m.id !== movie.id);
            }
            return [...prev, movie];
        });
    };

    // 특정 영화가 wishlist에 있는지 여부 확인
    const isWishlisted = (id: number) => {
        return wishlist.some((m) => m.id === id);
    };

    return {
        wishlist,
        toggleWishlist,
        isWishlisted,
    };
}
