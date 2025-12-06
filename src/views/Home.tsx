// src/views/Home.tsx
import { useEffect, useState } from "react";
import {
    fetchPopularMovies,
    fetchNowPlayingMovies,
    fetchTopRatedMovies,
    fetchUpcomingMovies,
} from "../utils/tmdb";
import type { Movie, PagedResponse } from "../types/movie";
import MovieRow from "../components/home/MovieRow";
import { useWishlist } from "../utils/useWishlist";
import "../styles/home.css";

const Home: React.FC = () => {
    const [popular, setPopular] = useState<Movie[]>([]);
    const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
    const [topRated, setTopRated] = useState<Movie[]>([]);
    const [upcoming, setUpcoming] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // LocalStorage 기반 위시리스트 훅
    const { toggleWishlist, isWishlisted } = useWishlist();

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);

            try {
                const [
                    popularRes,
                    nowPlayingRes,
                    topRatedRes,
                    upcomingRes,
                ] = await Promise.all([
                    fetchPopularMovies(1),
                    fetchNowPlayingMovies(1),
                    fetchTopRatedMovies(1),
                    fetchUpcomingMovies(1),
                ]);

                setPopular((popularRes as PagedResponse<Movie>).results.slice(0, 20));
                setNowPlaying(
                    (nowPlayingRes as PagedResponse<Movie>).results.slice(0, 20)
                );
                setTopRated(
                    (topRatedRes as PagedResponse<Movie>).results.slice(0, 20)
                );
                setUpcoming(
                    (upcomingRes as PagedResponse<Movie>).results.slice(0, 20)
                );
            } catch (e) {
                console.error(e);
                setError("영화 정보를 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    if (loading) {
        return (
            <section>
                <h1>Home</h1>
                <p>영화 목록을 불러오는 중입니다...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section>
                <h1>Home</h1>
                <p style={{ color: "tomato" }}>{error}</p>
            </section>
        );
    }

    return (
        <section>
            <h1>Home</h1>
            <p className="home__subtitle">
                TMDB 데이터를 이용해 인기 콘텐츠를 보여주는 메인 페이지입니다.
                카드를 클릭하면 추천(위시리스트)에 추가하거나 제거할 수 있어요.
            </p>

            <MovieRow
                title="지금 인기 있는 영화"
                movies={popular}
                onToggleWishlist={toggleWishlist}
                isWishlisted={isWishlisted}
            />
            <MovieRow
                title="현재 상영 중"
                movies={nowPlaying}
                onToggleWishlist={toggleWishlist}
                isWishlisted={isWishlisted}
            />
            <MovieRow
                title="최고 평점 영화"
                movies={topRated}
                onToggleWishlist={toggleWishlist}
                isWishlisted={isWishlisted}
            />
            <MovieRow
                title="개봉 예정작"
                movies={upcoming}
                onToggleWishlist={toggleWishlist}
                isWishlisted={isWishlisted}
            />
        </section>
    );
};

export default Home;
