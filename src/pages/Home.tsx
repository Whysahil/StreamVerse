import { useEffect } from 'react';
import { Hero } from '@/components/movies/Hero';
import { Row } from '@/components/movies/Row';
import { requests } from '@/lib/tmdb';

export function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen bg-netflix-dark pb-16">
      <Hero />
      <div className="relative z-20 pb-24 top-[-2rem] md:top-[-4rem]">
        <Row 
          title="Trending Now" 
          fetchUrl={requests.fetchTrending} 
          isLargeRow
        />
        <Row title="NETFLIX ORIGINALS" fetchUrl={requests.fetchNetflixOriginals} />
        <Row title="Top Rated" fetchUrl={requests.fetchTopRated} />
        <Row title="Action Movies" fetchUrl={requests.fetchActionMovies} />
        <Row title="Comedy Movies" fetchUrl={requests.fetchComedyMovies} />
        <Row title="Horror Movies" fetchUrl={requests.fetchHorrorMovies} />
        <Row title="Romance Movies" fetchUrl={requests.fetchRomanceMovies} />
        <Row title="Documentaries" fetchUrl={requests.fetchDocumentaries} />
      </div>
    </div>
  );
}
