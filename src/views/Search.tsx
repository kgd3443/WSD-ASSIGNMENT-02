// src/views/Search.tsx
import { FormEvent, useEffect, useState } from "react";
import { searchMovies } from "../utils/tmdb";
import type { Movie, PagedResponse } from "../types/movie";
import { useWishlist } from "../utils/useWishlist";
import MovieCard from "../components/home/MovieCard";
import "../styles/search.css";

const Search: React.FC = () => {
    const [query, setQuery] = useState(""); // 입력 중인 검색어
    const [submittedQuery, setSubmittedQuery] = useState(""); // 실제 검색에 사용된 검색어
    const [movies, setMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { toggleWishlist, isWishlisted } = useWishlist();

    // 검색 실행 함수
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
            setError("영화 검색에 실패했습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };

    // 폼 submit 핸들러
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) {
            setError("검색어를 입력해주세요.");
            setMovies([]);
            setTotalPages(1);
            return;
        }

        setPage(1);
        setSubmittedQuery(trimmed);
        performSearch(trimmed, 1);
    };

    // 페이지 변경 시 같은 검색어로 다시 조회
    useEffect(() => {
        if (!submittedQuery) return;
        performSearch(submittedQuery, page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const handleClear = () => {
        setQuery("");
        setSubmittedQuery("");
        setMovies([]);
        setPage(1);
        setTotalPages(1);
        setError(null);
    };

    return (
        <section className="search-page">
            <h1>Search</h1>
            <p className="search-page__subtitle">
                TMDB 영화 제목으로 검색할 수 있습니다. 검색 결과에서 카드를 클릭하면
                추천(위시리스트)에 추가/제거할 수 있습니다.
            </p>

            {/* 검색 폼 */}
            <form className="search-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="영화 제목을 입력하세요 (예: Inception, Interstellar, 기생충)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit">검색</button>
                <button
                    type="button"
                    className="search-form__clear-btn"
                    onClick={handleClear}
                >
                    초기화
                </button>
            </form>

            {/* 상태 메시지 */}
            {error && <p className="search-page__error">{error}</p>}

            {loading && (
                <p className="search-page__loading">검색 중입니다. 잠시만 기다려주세요...</p>
            )}

            {!loading && !error && submittedQuery && movies.length === 0 && (
                <p className="search-page__empty">
                    &quot;{submittedQuery}&quot; 에 대한 검색 결과가 없습니다.
                </p>
            )}

            {/* 검색 결과 */}
            {!loading && movies.length > 0 && (
                <>
                    <div className="search-page__result-info">
            <span>
              &quot;{submittedQuery}&quot; 검색 결과 (페이지 {page} / {totalPages})
            </span>
                    </div>

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
                        <button
                            type="button"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            이전
                        </button>
                        <span>
              {page} / {totalPages}
            </span>
                        <button
                            type="button"
                            onClick={() =>
                                setPage((p) => (p < totalPages ? p + 1 : totalPages))
                            }
                            disabled={page >= totalPages}
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
