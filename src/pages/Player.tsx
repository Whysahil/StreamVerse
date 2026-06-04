import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useTrailer } from '@/hooks/useTrailer';
import { fetchTMDB, requests } from '@/lib/tmdb';
import { useWatchStore } from '@/store/useWatchStore';
import { useProfileStore } from '@/store/useProfileStore';

export function Player() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { videoId, loading: trailerLoading } = useTrailer(type || 'movie', Number(id), true);
  
  const { currentProfile } = useProfileStore();
  const { addToHistory } = useWatchStore();
  
  useEffect(() => {
    async function loadAndTrack() {
      if (!type || !id || !currentProfile) return;
      const data = await fetchTMDB(requests.fetchMovieDetails(type, id));
      if (data) {
        addToHistory(currentProfile.id, { ...data, media_type: type as any }, Math.random() * 0.8 + 0.1);
      }
    }
    loadAndTrack();
  }, [type, id, currentProfile, addToHistory]);

  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-4 md:top-8 left-4 md:left-8 z-50 text-white hover:text-gray-300 transition-colors flex items-center gap-2 text-xl font-medium drop-shadow-md bg-black/40 p-2 rounded-full md:bg-transparent md:p-0"
      >
        <ArrowLeft className="w-8 h-8" />
        <span className="drop-shadow-md">Back</span>
      </button>

      {/* Loading State */}
      {trailerLoading && (
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-[#E50914] animate-spin" />
          <p className="text-white text-lg font-medium">Loading Player...</p>
        </div>
      )}

      {/* Error State: No video available */}
      {!trailerLoading && !videoId && (
        <div className="flex flex-col items-center justify-center gap-4 text-center max-w-md px-4">
          <AlertCircle className="w-16 h-16 text-red-500" />
          <h2 className="text-2xl font-bold text-white">Trailer Unavailable</h2>
          <p className="text-gray-400">
            We couldn't find a trailer for this title. Please try another movie or TV show.
          </p>
        </div>
      )}

      {/* YouTube Player */}
      {!trailerLoading && videoId && (
        <div className="w-full h-full animate-in fade-in duration-500">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&controls=1&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&fs=1&playsinline=1`}
            title="Video Player"
            style={{ border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}
