import { useEffect } from 'react';
import { Hero } from '@/components/movies/Hero';
import { Row } from '@/components/movies/Row';
import { ContinueWatchingRow } from '@/components/movies/ContinueWatchingRow';
import { requests } from '@/lib/tmdb';

export function Films() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050505] pb-16">
      <Hero type="movie" />
      <div className="relative z-20 pb-24 top-[-2rem] md:top-[-4rem]">
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
        <Row title="Thriller/Sci-Fi" fetchUrl={requests.fetchSciFiMovies} />
      </div>
    </div>
  );
}
