// src/views/Search.tsx
import type { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import MovieCard from "../components/home/MovieCard";
import type { Genre, Movie } from "../types/movie";
import { fetchGenres, searchMovies } from "../utils/tmdb";
import { useSearchHistory } from "../utils/useSearchHistory";
import { useWishlist } from "../utils/useWishlist";
import "../styles/search.css";

type SortKey = "relevance" | "popularity" | "rating" | "release";

const DEFAULTS = {
    query: "",
    genreId: "all" as const,
    minRating: 0,
    year: "all" as const,
    sort: "relevance" as SortKey,
};

function getYear(releaseDate?: string): number | null {
    if (!releaseDate) return null;
    const y = Number(releaseDate.slice(0, 4));
    return Number.isFinite(y) ? y : null;
}

const Search = () => {
    // ===== wishlist =====
    const { toggleWishlist, isWishlisted } = useWishlist();

    // ===== recent search (localStorage) =====
    const { history, addQuery, removeQuery, clearHistory } = useSearchHistory();

    // ===== filters =====
    const [input, setInput] = useState(DEFAULTS.query);
    const [query, setQuery] = useState(DEFAULTS.query);

    const [genreId, setGenreId] = useState<string>(DEFAULTS.genreId);
    const [minRating, setMinRating] = useState<number>(DEFAULTS.minRating);
    const [year, setYear] = useState<string>(DEFAULTS.year);
    const [sort, setSort] = useState<SortKey>(DEFAULTS.sort);

    // ===== data =====
    const [genres, setGenres] = useState<Genre[]>([]);
    const [rawMovies, setRawMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // ===== infinite scroll observer =====
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    // genres load
    useEffect(() => {
        let alive = true;
        fetchGenres()
            .then((res) => {
                if (!alive) return;
                setGenres(res.genres ?? []);
            })
            .catch(() => {
                // 장르 못 불러와도 검색 자체는 가능하게
            });
        return () => {
            alive = false;
        };
    }, []);

    // when query changes: reset paging + fetch first page
    useEffect(() => {
        let alive = true;

        const run = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await searchMovies(query.trim(), 1);
                if (!alive) return;
                setRawMovies(res.results ?? []);
                setPage(1);
                setHasMore((res.page ?? 1) < (res.total_pages ?? 1));
            } catch {
                if (!alive) return;
                setError("검색에 실패했습니다. 잠시 후 다시 시도해주세요.");
                setRawMovies([]);
                setHasMore(false);
            } finally {
                if (!alive) return;
                setLoading(false);
            }
        };

        // 빈 검색어일 때는 “최근 검색어 안내 + 필터만” 보여주고 싶으면 여기서 return
        // 하지만 과제는 /search에서 UI가 중요하므로, 빈 검색어면 호출하지 않게 처리
        if (query.trim().length === 0) {
            setRawMovies([]);
            setHasMore(false);
            setPage(1);
            setLoading(false);
            setError(null);
            return;
        }

        run();
        return () => {
            alive = false;
        };
    }, [query]);

    // load more
    const loadMore = async () => {
        if (loading || !hasMore) return;
        const next = page + 1;
        setLoading(true);
        setError(null);
        try {
            const res = await searchMovies(query.trim(), next);
            setRawMovies((prev) => [...prev, ...(res.results ?? [])]);
            setPage(next);
            setHasMore((res.page ?? next) < (res.total_pages ?? next));
        } catch {
            setError("추가 로딩에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // infinite scroll (IntersectionObserver)
    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;

        const io = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first?.isIntersecting) {
                    void loadMore();
                }
            },
            { root: null, rootMargin: "300px", threshold: 0 }
        );

        io.observe(el);
        return () => io.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sentinelRef, hasMore, loading, page, query]);

    // ===== client-side filtering + sorting =====
    const filteredMovies = useMemo(() => {
        let list = [...rawMovies];

        // genre filter (TMDB search result has genre_ids)
        if (genreId !== "all") {
            const gid = Number(genreId);
            list = list.filter((m) => (m.genre_ids ?? []).includes(gid));
        }

        // rating filter
        list = list.filter((m) => (m.vote_average ?? 0) >= minRating);

        // year filter
        if (year !== "all") {
            const y = Number(year);
            list = list.filter((m) => getYear(m.release_date) === y);
        }

        // sorting
        switch (sort) {
            case "popularity":
                list.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
                break;
            case "rating":
                list.sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0));
                break;
            case "release":
                list.sort((a, b) => {
                    const ay = getYear(a.release_date) ?? 0;
                    const by = getYear(b.release_date) ?? 0;
                    return by - ay;
                });
                break;
            case "relevance":
            default:
                // search 기본 정렬 유지
                break;
        }

        return list;
    }, [rawMovies, genreId, minRating, year, sort]);

    // year options from loaded movies (또는 고정 범위로 만들어도 됨)
    const yearOptions = useMemo(() => {
        const ys = new Set<number>();
        for (const m of rawMovies) {
            const y = getYear(m.release_date);
            if (y) ys.add(y);
        }
        return Array.from(ys).sort((a, b) => b - a);
    }, [rawMovies]);

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        const q = input.trim();
        setQuery(q);
        if (q) addQuery(q);
    };

    const applyHistory = (q: string) => {
        setInput(q);
        setQuery(q);
        addQuery(q);
    };

    const onReset = () => {
        setInput(DEFAULTS.query);
        setQuery(DEFAULTS.query);
        setGenreId(DEFAULTS.genreId);
        setMinRating(DEFAULTS.minRating);
        setYear(DEFAULTS.year);
        setSort(DEFAULTS.sort);
        setRawMovies([]);
        setHasMore(false);
        setPage(1);
        setError(null);
    };

    return (
        <section className="search-page">
            <div className="search-header">
                <h1>검색</h1>

                <form className="search-bar" onSubmit={onSubmit}>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="영화 제목을 입력하세요"
                    />
                    <button type="submit">검색</button>
                    <button type="button" className="secondary" onClick={onReset}>
                        초기화
                    </button>
                </form>

                {/* 필터 UI (필수) */}
                <div className="search-filters">
                    <label>
                        장르
                        <select value={genreId} onChange={(e) => setGenreId(e.target.value)}>
                            <option value="all">전체</option>
                            {genres.map((g) => (
                                <option key={g.id} value={String(g.id)}>
                                    {g.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        평점(이상)
                        <input
                            type="range"
                            min={0}
                            max={10}
                            step={0.5}
                            value={minRating}
                            onChange={(e) => setMinRating(Number(e.target.value))}
                        />
                        <span className="filter-value">{minRating.toFixed(1)}</span>
                    </label>

                    <label>
                        개봉년도
                        <select value={year} onChange={(e) => setYear(e.target.value)}>
                            <option value="all">전체</option>
                            {yearOptions.map((y) => (
                                <option key={y} value={String(y)}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        정렬
                        <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                            <option value="relevance">관련도</option>
                            <option value="popularity">인기순</option>
                            <option value="rating">평점순</option>
                            <option value="release">최신순</option>
                        </select>
                    </label>
                </div>

                {/* 최근 검색어 (선택 가산점) */}
                {history.length > 0 && (
                    <div className="search-history">
                        <div className="search-history__top">
                            <span>최근 검색어</span>
                            <button type="button" className="link" onClick={clearHistory}>
                                전체 삭제
                            </button>
                        </div>
                        <div className="search-history__chips">
                            {history.map((q) => (
                                <div key={q} className="chip">
                                    <button type="button" onClick={() => applyHistory(q)}>
                                        {q}
                                    </button>
                                    <button
                                        type="button"
                                        className="chip-x"
                                        onClick={() => removeQuery(q)}
                                        aria-label="remove"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 결과 영역 */}
            {error && <p className="search-error">{error}</p>}

            {query.trim().length === 0 ? (
                <p className="search-empty">검색어를 입력하면 결과가 표시됩니다.</p>
            ) : (
                <>
                    <div className="search-result-meta">
                        <span>결과: {filteredMovies.length}개</span>
                        {(genreId !== "all" || minRating !== 0 || year !== "all" || sort !== "relevance") && (
                            <span className="search-badge">필터 적용됨</span>
                        )}
                    </div>

                    <div className="search-grid">
                        {filteredMovies.map((m) => (
                            <MovieCard
                                key={m.id}
                                movie={m}
                                onToggleWishlist={toggleWishlist}
                                isWishlisted={isWishlisted(m.id)}
                            />
                        ))}
                    </div>

                    {loading && <div className="search-loading">로딩 중…</div>}

                    {/* Infinite scroll sentinel */}
                    <div ref={sentinelRef} style={{ height: 1 }} />

                    {!loading && hasMore && (
                        <button className="load-more" type="button" onClick={loadMore}>
                            더 보기
                        </button>
                    )}

                    {!loading && !hasMore && filteredMovies.length > 0 && (
                        <div className="search-end">마지막 페이지입니다.</div>
                    )}
                </>
            )}
        </section>
    );
};

export default Search;
