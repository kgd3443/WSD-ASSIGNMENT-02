// src/components/home/MovieRow.tsx
import type { Movie } from "../../types/movie";
import MovieCard from "./MovieCard";

interface MovieRowProps {
    title: string;
    movies: Movie[];
}

const MovieRow: React.FC<MovieRowProps> = ({ title, movies }) => {
    if (!movies.length) return null;

    return (
        <section className="movie-row">
            <h2 className="movie-row__title">{title}</h2>
            <div className="movie-row__list">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </section>
    );
};

export default MovieRow;
