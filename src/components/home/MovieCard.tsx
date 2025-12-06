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

            <div className="movie-card__info">
                <p className="movie-card__title">{movie.title}</p>
                <p className="movie-card__rating">
                    ⭐ {movie.vote_average.toFixed(1)}
                </p>
            </div>
        </div>
    );
};

export default MovieCard;
