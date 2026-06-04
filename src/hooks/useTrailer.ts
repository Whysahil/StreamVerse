import { useState, useEffect } from 'react';
import { fetchTMDB, requests } from '@/lib/tmdb';
import { useTrailerCache } from '@/store/useTrailerCache';

export function useTrailer(mediaType: string, id: number, shouldFetch: boolean) {
  const cacheKey = `${mediaType}_${id}`;
  const cachedVideoId = useTrailerCache((state) => state.trailers[cacheKey]);
  const setTrailer = useTrailerCache((state) => state.setTrailer);
  
  const [videoId, setVideoId] = useState<string | null>(cachedVideoId !== undefined ? cachedVideoId : null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!shouldFetch || cachedVideoId !== undefined) {
      if (cachedVideoId !== undefined) {
          setVideoId(cachedVideoId);
      }
      return;
    }

    let isMounted = true;
    
    async function fetchVideo() {
      setLoading(true);
      try {
        const url = requests.fetchMovieVideos(mediaType || 'movie', id);
        const data = await fetchTMDB(url);
        
        if (isMounted) {
          if (data?.results?.length > 0) {
            const trailer = data.results.find((vid: any) => vid.type === 'Trailer' && vid.site === 'YouTube') 
                         || data.results.find((vid: any) => vid.site === 'YouTube');
            const finalId = trailer ? trailer.key : null;
            setVideoId(finalId);
            setTrailer(cacheKey, finalId);
          } else {
            setVideoId(null);
            setTrailer(cacheKey, null);
          }
        }
      } catch (err) {
        if (isMounted) {
          setVideoId(null);
          setTrailer(cacheKey, null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchVideo();

    return () => {
      isMounted = false;
    };
  }, [shouldFetch, mediaType, id, cachedVideoId, cacheKey, setTrailer]);

  return { videoId, loading };
}
