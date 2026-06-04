export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';
export const IMAGE_BASE_URL_W500 = 'https://image.tmdb.org/t/p/w500';

export const requests = {
  fetchTrending: `/trending/all/week?language=en-US`,
  fetchNetflixOriginals: `/discover/tv?with_networks=213`,
  fetchTopRated: `/movie/top_rated?language=en-US`,
  fetchActionMovies: `/discover/movie?with_genres=28`,
  fetchComedyMovies: `/discover/movie?with_genres=35`,
  fetchHorrorMovies: `/discover/movie?with_genres=27`,
  fetchRomanceMovies: `/discover/movie?with_genres=10749`,
  fetchDocumentaries: `/discover/movie?with_genres=99`,
  fetchTrendingSeries: `/trending/tv/week?language=en-US`,
  fetchPopularSeries: `/tv/popular?language=en-US`,
  fetchTopRatedSeries: `/tv/top_rated?language=en-US`,
  fetchTrendingMovies: `/trending/movie/week?language=en-US`,
  fetchPopularMovies: `/movie/popular?language=en-US`,
  fetchTopRatedMovies: `/movie/top_rated?language=en-US`,
  fetchSciFiMovies: `/discover/movie?with_genres=878`,
  searchMovies: (query: string) => `/search/multi?language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`,
  fetchMovieDetails: (mediaType: string, id: string | number) => `/${mediaType}/${id}?language=en-US`,
  fetchMovieVideos: (mediaType: string, id: string | number) => `/${mediaType}/${id}/videos?language=en-US`
};

export async function fetchTMDB(endpoint: string) {
  try {
    const url = `/api/tmdb?endpoint=${encodeURIComponent(endpoint)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching TMDB data for endpoint ${endpoint}:`, error);
    return null; // Return null so components can handle it gracefully.
  }
}

