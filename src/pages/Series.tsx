import { useEffect } from 'react';
import { Hero } from '@/components/movies/Hero';
import { Row } from '@/components/movies/Row';
import { ContinueWatchingRow } from '@/components/movies/ContinueWatchingRow';
import { requests } from '@/lib/tmdb';

export function Series() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050505] pb-16">
      <Hero type="tv" />
      <div className="relative z-20 pb-24 top-[-2rem] md:top-[-4rem]">
        <ContinueWatchingRow />
        <Row 
          title="Trending Series" 
          fetchUrl={requests.fetchTrendingSeries}
          isLargeRow
        />
        <Row title="Verse Originals" fetchUrl={requests.fetchNetflixOriginals} />
        <Row title="Popular Series" fetchUrl={requests.fetchPopularSeries} />
        <Row title="Top Rated Series" fetchUrl={requests.fetchTopRatedSeries} />
      </div>
    </div>
  );
}
