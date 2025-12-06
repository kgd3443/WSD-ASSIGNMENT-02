// src/views/Home.tsx
import { useEffect, useState } from "react";
import { fetchPopularMovies } from "../utils/tmdb";
import type { Movie } from "../types/movie";

const Home = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchPopularMovies(1);
                setMovies(data.results);
            } catch (e) {
                console.error("인기 영화 불러오기 실패", e);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    if (loading) {
        return <div>영화 로딩 중...</div>;
    }

    return (
        <section>
            <h1>Home Page</h1>
            <p>인기 영화 목록 (임시 테스트)</p>
            <ul>
                {movies.slice(0, 5).map((movie) => (
                    <li key={movie.id}>{movie.title}</li>
                ))}
            </ul>
        </section>
    );
};

export default Home;
