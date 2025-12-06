// src/views/Wishlist.tsx
import { useMemo } from "react";
import { useWishlist } from "../utils/useWishlist";
import { tmdbImageUrl } from "../utils/tmdb";
import "../styles/wishlist.css";

const Wishlist = () => {
    const { wishlist, toggleWishlist } = useWishlist();

    // 간단히 평점 순 정렬 (높은 순)
    const sortedWishlist = useMemo(
        () => [...wishlist].sort((a, b) => b.vote_average - a.vote_average),
        [wishlist]
    );

    const handleRemove = (id: number) => {
        const movie = wishlist.find((m) => m.id === id);
        if (!movie) return;
        // toggleWishlist는 이미 있으면 제거하는 동작이므로 그대로 사용
        toggleWishlist(movie);
    };

    return (
        <section className="wishlist-page">
            <h1>Wishlist</h1>
            <p className="wishlist-page__subtitle">
                로컬 스토리지에 저장된 추천(위시리스트) 영화 목록입니다. 이 페이지에서는
                API를 호출하지 않고, 기존에 저장된 데이터만 사용합니다.
            </p>

            {sortedWishlist.length === 0 ? (
                <p className="wishlist-page__empty">
                    아직 추천한 영화가 없습니다. Home / Popular / Search 페이지에서 카드를
                    클릭하여 영화를 추천해보세요.
                </p>
            ) : (
                <div className="wishlist-table-wrapper">
                    <table className="wishlist-table">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>포스터</th>
                            <th>제목</th>
                            <th>평점</th>
                            <th>액션</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sortedWishlist.map((movie, index) => {
                            const posterSrc = tmdbImageUrl(movie.poster_path, "w200");

                            return (
                                <tr
                                    key={movie.id}
                                    className="wishlist-row wishlist-row--recommended"
                                    // 행 전체 클릭으로도 추천 해제 가능
                                    onClick={() => handleRemove(movie.id)}
                                >
                                    <td>{index + 1}</td>
                                    <td>
                                        {posterSrc ? (
                                            <img
                                                src={posterSrc}
                                                alt={movie.title}
                                                className="wishlist-poster"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="wishlist-poster wishlist-poster--placeholder">
                                                이미지 없음
                                            </div>
                                        )}
                                    </td>
                                    <td className="wishlist-title-cell">
                                        <span className="wishlist-title">{movie.title}</span>
                                        <span className="wishlist-badge">★ 추천</span>
                                    </td>
                                    <td>⭐ {movie.vote_average.toFixed(1)}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className="wishlist-remove-btn"
                                            // 버튼 클릭만으로도 추천 해제 (행 클릭과 중복 허용)
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemove(movie.id);
                                            }}
                                        >
                                            추천 해제
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>

                    <p className="wishlist-page__hint">
                        행 또는 &quot;추천 해제&quot; 버튼을 클릭하면 해당 영화가
                        위시리스트에서 제거됩니다.
                    </p>
                </div>
            )}
        </section>
    );
};

export default Wishlist;
