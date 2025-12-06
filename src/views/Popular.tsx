// src/views/Popular.tsx
import { useEffect, useState } from "react";
import { fetchPopularMovies } from "../utils/tmdb";
import type { Movie, PagedResponse } from "../types/movie";
import { useWishlist } from "../utils/useWishlist";
import "../styles/popular.css";

type ViewMode = "table" | "infinite";

const Popular: React.FC = () => {
    const [mode, setMode] = useState<ViewMode>("table");

    // table view 상태
    const [tableMovies, setTableMovies] = useState<Movie[]>([]);
    const [tablePage, setTablePage] = useState(1);
    const [tableTotalPages, setTableTotalPages] = useState(1);
    const [tableLoading, setTableLoading] = useState(false);

    // infinite view 상태
    const [infiniteMovies, setInfiniteMovies] = useState<Movie[]>([]);
    const [infinitePage, setInfinitePage] = useState(1);
    const [infiniteHasMore, setInfiniteHasMore] = useState(true);
    const [infiniteLoading, setInfiniteLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const { toggleWishlist, isWishlisted } = useWishlist();

    // 🔹 table view용 데이터 로딩
    useEffect(() => {
        if (mode !== "table") return;

        const load = async () => {
            setTableLoading(true);
            setError(null);

            try {
                const res = await fetchPopularMovies(tablePage);
                const data = res as PagedResponse<Movie>;
                setTableMovies(data.results);
                setTableTotalPages(data.total_pages);
            } catch (e) {
                console.error(e);
                setError("인기 영화 목록을 불러오는데 실패했습니다.");
            } finally {
                setTableLoading(false);
            }
        };

        load();
    }, [mode, tablePage]);

    // 🔹 infinite view용 데이터 초기화 + 첫 로드
    useEffect(() => {
        if (mode !== "infinite") return;

        const load = async () => {
            setInfiniteLoading(true);
            setError(null);

            try {
                const res = await fetchPopularMovies(infinitePage);
                const data = res as PagedResponse<Movie>;
                if (infinitePage === 1) {
                    setInfiniteMovies(data.results);
                } else {
                    setInfiniteMovies((prev) => [...prev, ...data.results]);
                }
                setInfiniteHasMore(infinitePage < data.total_pages);
            } catch (e) {
                console.error(e);
                setError("인기 영화 목록을 불러오는데 실패했습니다.");
            } finally {
                setInfiniteLoading(false);
            }
        };

        load();
    }, [mode, infinitePage]);

    // 🔹 infinite scroll 스크롤 리스너
    useEffect(() => {
        if (mode !== "infinite") return;

        const handleScroll = () => {
            if (infiniteLoading || !infiniteHasMore) return;

            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            // 바닥에서 200px 남았을 때 다음 페이지 로드
            if (scrollHeight - scrollTop - clientHeight < 200) {
                setInfinitePage((prev) => prev + 1);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [mode, infiniteLoading, infiniteHasMore]);

    // 🔹 Top 버튼
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // 🔹 view 모드 변경 시 초기화
    const handleChangeMode = (next: ViewMode) => {
        setMode(next);
        if (next === "table") {
            setTablePage(1);
        } else {
            setInfinitePage(1);
            setInfiniteMovies([]);
            setInfiniteHasMore(true);
        }
    };

    return (
        <section className="popular-page">
            <div className="popular-page__header">
                <h1>Popular</h1>
                <p className="popular-page__subtitle">
                    TMDB 인기 영화 전체 목록입니다. 모드를 전환해서 테이블 보기 / 무한
                    스크롤 보기로 확인할 수 있습니다.
                </p>

                <div className="popular-page__view-toggle">
                    <button
                        type="button"
                        className={mode === "table" ? "active" : ""}
                        onClick={() => handleChangeMode("table")}
                    >
                        Table View
                    </button>
                    <button
                        type="button"
                        className={mode === "infinite" ? "active" : ""}
                        onClick={() => handleChangeMode("infinite")}
                    >
                        Infinite Scroll
                    </button>
                </div>
            </div>

            {error && <p className="popular-page__error">{error}</p>}

            {/* 🔹 Table View */}
            {mode === "table" && (
                <div className="popular-table">
                    {tableLoading ? (
                        <p className="popular-page__loading">불러오는 중...</p>
                    ) : (
                        <>
                            <table>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>제목</th>
                                    <th>평점</th>
                                    <th>개봉일</th>
                                    <th>추천</th>
                                </tr>
                                </thead>
                                <tbody>
                                {tableMovies.map((movie, index) => (
                                    <tr
                                        key={movie.id}
                                        className={
                                            isWishlisted(movie.id)
                                                ? "popular-row popular-row--wishlisted"
                                                : "popular-row"
                                        }
                                        onClick={() =>
                                            toggleWishlist({
                                                id: movie.id,
                                                title: movie.title,
                                                poster_path: movie.poster_path,
                                                vote_average: movie.vote_average,
                                            })
                                        }
                                    >
                                        <td>{(tablePage - 1) * tableMovies.length + index + 1}</td>
                                        <td>{movie.title}</td>
                                        <td>⭐ {movie.vote_average.toFixed(1)}</td>
                                        <td>{movie.release_date}</td>
                                        <td>{isWishlisted(movie.id) ? "★" : "＋"}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            <div className="popular-table__pagination">
                                <button
                                    type="button"
                                    onClick={() => setTablePage((p) => Math.max(1, p - 1))}
                                    disabled={tablePage === 1}
                                >
                                    이전
                                </button>
                                <span>
                  {tablePage} / {tableTotalPages}
                </span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setTablePage((p) =>
                                            p < tableTotalPages ? p + 1 : tableTotalPages
                                        )
                                    }
                                    disabled={tablePage >= tableTotalPages}
                                >
                                    다음
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* 🔹 Infinite Scroll View */}
            {mode === "infinite" && (
                <div className="popular-infinite">
                    {infiniteMovies.map((movie) => (
                        <div
                            key={movie.id}
                            className={`popular-infinite__item ${
                                isWishlisted(movie.id)
                                    ? "popular-infinite__item--wishlisted"
                                    : ""
                            }`}
                            onClick={() =>
                                toggleWishlist({
                                    id: movie.id,
                                    title: movie.title,
                                    poster_path: movie.poster_path,
                                    vote_average: movie.vote_average,
                                })
                            }
                        >
                            <div className="popular-infinite__title">{movie.title}</div>
                            <div className="popular-infinite__meta">
                                <span>⭐ {movie.vote_average.toFixed(1)}</span>
                                <span>{movie.release_date}</span>
                                {isWishlisted(movie.id) && <span className="badge">★ 추천</span>}
                            </div>
                        </div>
                    ))}
                    {infiniteLoading && (
                        <p className="popular-page__loading">추가 로딩 중...</p>
                    )}
                    {!infiniteHasMore && (
                        <p className="popular-page__end">모든 인기 영화를 다 불러왔습니다.</p>
                    )}
                </div>
            )}

            <button type="button" className="popular-page__top-btn" onClick={scrollToTop}>
                TOP
            </button>
        </section>
    );
};

export default Popular;
