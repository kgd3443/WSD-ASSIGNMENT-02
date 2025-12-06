// src/utils/useWishlist.ts
import { useEffect, useState } from "react";
import type { Movie } from "../types/movie";

const STORAGE_KEY = "movieWishlist";

export type WishlistMovie = Pick<
    Movie,
    "id" | "title" | "poster_path" | "vote_average"
>;

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

// ⬇⬇⬇ **이 함수가 export 되어 있어야 함!**
export function useWishlist() {
    const [wishlist, setWishlist] = useState<WishlistMovie[]>(() =>
        loadInitialWishlist()
    );

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    }, [wishlist]);

    const toggleWishlist = (movie: WishlistMovie) => {
        setWishlist((prev) => {
            const exists = prev.some((m) => m.id === movie.id);
            if (exists) return prev.filter((m) => m.id !== movie.id);
            return [...prev, movie];
        });
    };

    const isWishlisted = (id: number) =>
        wishlist.some((m) => m.id === id);

    return { wishlist, toggleWishlist, isWishlisted };
}
