// src/utils/useSearchHistory.ts
import { useEffect, useState } from "react";

const STORAGE_KEY = "movieSearchHistory";
const MAX_HISTORY = 8; // 최근 검색어 최대 8개까지 저장

export function useSearchHistory() {
    const [history, setHistory] = useState<string[]>(() => {
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
    });

    // LocalStorage 자동 저장
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        } catch {}
    }, [history]);

    // 검색어 추가
    const addQuery = (query: string) => {
        const trimmed = query.trim();
        if (!trimmed) return;

        setHistory((prev) => {
            const filtered = prev.filter((q) => q !== trimmed);
            return [trimmed, ...filtered].slice(0, MAX_HISTORY);
        });
    };

    // 개별 삭제
    const removeQuery = (query: string) => {
        setHistory((prev) => prev.filter((q) => q !== query));
    };

    // 전체 지우기
    const clearHistory = () => setHistory([]);

    return {
        history,
        addQuery,
        removeQuery,
        clearHistory,
    };
}
