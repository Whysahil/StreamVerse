import { useEffect } from "react";
import { Hero } from "@/components/movies/Hero";
import { Row } from "@/components/movies/Row";
import { ContinueWatchingRow } from "@/components/movies/ContinueWatchingRow";
import { requests } from "@/lib/tmdb";

export function Series() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050505]">
      <Hero type="tv" />
      <div className="relative z-20 pb-8 -mt-16 md:-mt-24">
        <ContinueWatchingRow />
        <Row
          title="Trending Series"
          fetchUrl={requests.fetchTrendingSeries}
          isLargeRow
        />
        <Row
          title="Verse Originals"
          fetchUrl={requests.fetchNetflixOriginals}
        />
        <Row title="Popular Series" fetchUrl={requests.fetchPopularSeries} />
        <Row title="Top Rated Series" fetchUrl={requests.fetchTopRatedSeries} />
        <Row
          title="Sci-Fi & Fantasy"
          fetchUrl={"/discover/tv?with_genres=10765"}
        />
        <Row title="Comedy Series" fetchUrl={"/discover/tv?with_genres=35"} />
        <Row title="Drama Series" fetchUrl={"/discover/tv?with_genres=18"} />
      </div>
    </div>
  );
}
