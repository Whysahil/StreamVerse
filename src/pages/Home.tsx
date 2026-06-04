import { useEffect } from "react";
import { Hero } from "@/components/movies/Hero";
import { Row } from "@/components/movies/Row";
import { ContinueWatchingRow } from "@/components/movies/ContinueWatchingRow";
import { requests } from "@/lib/tmdb";

export function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050505]">
      <Hero />
      <div className="relative z-20 pb-8 -mt-16 md:-mt-24">
        <ContinueWatchingRow />
        <Row
          title="Trending Now"
          fetchUrl={requests.fetchTrending}
          isLargeRow
        />
        <Row
          title="Recommended For You"
          fetchUrl={requests.fetchPopularMovies}
        />
        <Row title="TV Series" fetchUrl={requests.fetchPopularSeries} />
        <Row
          title="Verse Originals"
          fetchUrl={requests.fetchNetflixOriginals}
          isLargeRow
        />
        <Row
          title="New Releases"
          fetchUrl={"/movie/now_playing?language=en-US&page=1"}
        />
        <Row
          title="Because You Watched"
          fetchUrl={"/movie/top_rated?language=en-US&page=2"}
        />
        <Row
          title="Similar To Your Interests"
          fetchUrl={"/discover/movie?with_genres=878,28"}
        />
        <Row title="Action Movies" fetchUrl={requests.fetchActionMovies} />
        <Row title="Top Rated" fetchUrl={requests.fetchTopRated} />
        <Row title="Comedy Movies" fetchUrl={requests.fetchComedyMovies} />
        <Row title="Thriller & Sci-Fi" fetchUrl={requests.fetchSciFiMovies} />
        <Row title="Romance Movies" fetchUrl={requests.fetchRomanceMovies} />
        <Row title="Horror Movies" fetchUrl={requests.fetchHorrorMovies} />
        <Row title="Documentaries" fetchUrl={requests.fetchDocumentaries} />
      </div>
    </div>
  );
}
