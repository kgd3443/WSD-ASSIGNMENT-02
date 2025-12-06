// src/components/home/MovieCard.tsx
import type { Movie } from "../../types/movie";
import { tmdbImageUrl } from "../../utils/tmdb";

interface MovieCardProps {
    movie: Movie;
    onToggleWishlist: (movie: Movie) => void;
    isWishlisted: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({
                                                 movie,
                                                 onToggleWishlist,
                                                 isWishlisted,
                                             }) => {
    const posterSrc = tmdbImageUrl(movie.poster_path, "w300");

    // overview를 너무 길지 않게 잘라서 사용
    const shortOverview =
        movie.overview && movie.overview.length > 90
            ? movie.overview.slice(0, 90) + "…"
            : movie.overview || "줄거리 정보가 없습니다.";

    return (
        <div
            className={`movie-card ${
                isWishlisted ? "movie-card--wishlisted" : ""
            }`}
            onClick={() => onToggleWishlist(movie)}
        >
            {posterSrc ? (
                <img
                    src={posterSrc}
                    alt={movie.title}
                    className="movie-card__image"
                    loading="lazy"
                />
            ) : (
                <div className="movie-card__placeholder">이미지 없음</div>
            )}

            {isWishlisted && <span className="movie-card__badge">★ 추천</span>}

            {/* 기본 카드 정보 (제목 + 평점) */}
            <div className="movie-card__info">
                <p className="movie-card__title">{movie.title}</p>
                <p className="movie-card__rating">
                    ⭐ {movie.vote_average.toFixed(1)}
                </p>
            </div>

            {/* 🟡 Hover 시 위로 올라올 설명 오버레이 */}
            <div className="movie-card__overlay">
                <h3 className="movie-card__overlay-title">{movie.title}</h3>
                <p className="movie-card__overlay-overview">{shortOverview}</p>
            </div>
        </div>
    );
};

export default MovieCard;
