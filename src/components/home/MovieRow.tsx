import { useRef } from "react";
import { useHorizontalWheel } from "../../hooks/useHorizontalWheel";
import MovieCard from "./MovieCard";
import type { Movie } from "../../types/movie";

type Props = {
    title: string;
    movies: Movie[];
};

const MovieRow = ({ title, movies }: Props) => {
    const listRef = useRef<HTMLDivElement>(null);

    useHorizontalWheel(listRef);

    return (
        <section className="movie-row">
            <h2 className="movie-row__title">{title}</h2>

            <div ref={listRef} className="movie-row__list">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </section>
    );
};

export default MovieRow;
