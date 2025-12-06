// src/views/Search.tsx
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { searchMovies } from "../utils/tmdb";
import type { Movie, PagedResponse } from "../types/movie";
import { useWishlist } from "../utils/useWishlist";
import { useSearchHistory } from "../utils/useSearchHistory";
import MovieCard from "../components/home/MovieCard";
import "../styles/search.css";

const Search: React.FC = () => {
    const [query, setQuery] = useState("");
    const [submittedQuery, setSubmittedQuery] = useState("");
    const [movies, setMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { toggleWishlist, isWishlisted } = useWishlist();
    const { history, addQuery, removeQuery, clearHistory } = useSearchHistory();

    const performSearch = async (searchText: string, pageNum: number) => {
        if (!searchText.trim()) {
            setMovies([]);
            setTotalPages(1);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await searchMovies(searchText, pageNum);
            const data = res as PagedResponse<Movie>;
            setMovies(data.results);
            setTotalPages(data.total_pages || 1);
        } catch (e) {
            console.error(e);
            setError("영화 검색에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) {
            setError("검색어를 입력해주세요.");
            setMovies([]);
            return;
        }

        setPage(1);
        setSubmittedQuery(trimmed);
        performSearch(trimmed, 1);
        addQuery(trimmed); // ← 최근 검색어 저장
    };

    // 페이지 바뀔 때 재조회
    useEffect(() => {
        if (!submittedQuery) return;
        performSearch(submittedQuery, page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const handleSelectHistory = (keyword: string) => {
        setQuery(keyword);
        setPage(1);
        setSubmittedQuery(keyword);
        performSearch(keyword, 1);
    };

    return (
        <section className="search-page">
            <h1>Search</h1>
            <p className="search-page__subtitle">
                TMDB 영화 제목 검색. 최근 검색어를 누르면 자동 검색됩니다.
            </p>

            {/* 검색 폼 */}
            <form className="search-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="영화 제목을 입력하세요…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit">검색</button>
                <button type="button" className="search-form__clear-btn" onClick={() => setQuery("")}>
                    입력지우기
                </button>
            </form>

            {/* 최근 검색어 UI */}
            {history.length > 0 && (
                <div className="search-history">
                    <div className="search-history__header">
                        <span>최근 검색어</span>
                        <button onClick={clearHistory}>전체 삭제</button>
                    </div>

                    <div className="search-history__list">
                        {history.map((keyword) => (
                            <div key={keyword} className="search-history__item">
                                <span onClick={() => handleSelectHistory(keyword)}>{keyword}</span>
                                <button
                                    className="search-history__delete"
                                    onClick={() => removeQuery(keyword)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 에러 */}
            {error && <p className="search-page__error">{error}</p>}
            {loading && <p className="search-page__loading">검색 중…</p>}
            {!loading && submittedQuery && movies.length === 0 && (
                <p className="search-page__empty">검색 결과가 없습니다.</p>
            )}

            {/* 검색 결과 */}
            {!loading && movies.length > 0 && (
                <>
                    <p className="search-page__result-info">
                        &quot;{submittedQuery}&quot; 검색 결과 (페이지 {page} / {totalPages})
                    </p>

                    <div className="search-grid">
                        {movies.map((movie) => (
                            <MovieCard
                                key={movie.id}
                                movie={movie}
                                onToggleWishlist={(m) =>
                                    toggleWishlist({
                                        id: m.id,
                                        title: m.title,
                                        poster_path: m.poster_path,
                                        vote_average: m.vote_average,
                                    })
                                }
                                isWishlisted={isWishlisted(movie.id)}
                            />
                        ))}
                    </div>

                    {/* 페이지네이션 */}
                    <div className="search-page__pagination">
                        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                            이전
                        </button>
                        <span>
              {page} / {totalPages}
            </span>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            다음
                        </button>
                    </div>
                </>
            )}
        </section>
    );
};

export default Search;
