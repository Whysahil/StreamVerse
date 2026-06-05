import { useEffect } from "react";
import { Hero } from "@/components/movies/Hero";
import { Row } from "@/components/movies/Row";
import { ContinueWatchingRow } from "@/components/movies/ContinueWatchingRow";
import { requests } from "@/lib/tmdb";

export function Films() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050505]">
      <Hero type="movie" />
      <div className="relative z-20 pb-8 -mt-16 md:-mt-24">
        <ContinueWatchingRow />
        <Row
          title="Trending Movies"
          fetchUrl={requests.fetchTrendingMovies}
          isLargeRow
        />
        <Row title="Popular Movies" fetchUrl={requests.fetchPopularMovies} />
        <Row title="Top Rated Movies" fetchUrl={requests.fetchTopRatedMovies} />
        <Row title="Action" fetchUrl={requests.fetchActionMovies} />
        <Row title="Comedy" fetchUrl={requests.fetchComedyMovies} />
        <Row title="Drama" fetchUrl={"/discover/movie?with_genres=18"} />
        <Row title="Thriller" fetchUrl={"/discover/movie?with_genres=53"} />
        <Row title="Sci-Fi" fetchUrl={requests.fetchSciFiMovies} />
        <Row title="Horror" fetchUrl={"/discover/movie?with_genres=27"} />
      </div>
    </div>
  );
}
