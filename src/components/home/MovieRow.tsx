// src/components/home/MovieRow.tsx
import { useRef } from "react";
import type { Movie } from "../../types/movie";
import MovieCard from "./MovieCard";
import { useHorizontalWheel } from "../../hooks/useHorizontalWheel";

type Props = {
    title: string;
    movies: Movie[];
    onToggleWishlist: (movie: Movie) => void;
    isWishlisted: (movieId: number) => boolean;
};

const MovieRow = ({ title, movies, onToggleWishlist, isWishlisted }: Props) => {
    const listRef = useRef<HTMLDivElement>(null);
    useHorizontalWheel(listRef);

    return (
        <section className="movie-row">
            <h2 className="movie-row__title">{title}</h2>

            <div ref={listRef} className="movie-row__list">
                {movies.map((movie) => (
                    <MovieCard
                        key={movie.id}
                        movie={movie}
                        onToggleWishlist={onToggleWishlist}
                        isWishlisted={isWishlisted(movie.id)}
                    />
                ))}
            </div>
        </section>
    );
};

export default MovieRow;
