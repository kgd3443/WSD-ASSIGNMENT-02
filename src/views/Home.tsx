import { useEffect, useState } from "react";
import { fetchPopularMovies } from "../utils/tmdb";

interface Movie {
    id: number;
    title: string;
    poster_path: string | null;
    overview: string;
}

const Home = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchPopularMovies(1);
                setMovies(data.results);
            } catch (e) {
                console.error("Failed to fetch popular movies", e);
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
