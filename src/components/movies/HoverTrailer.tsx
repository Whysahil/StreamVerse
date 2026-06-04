import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Plus, Check, ChevronDown } from "lucide-react";
import { IMAGE_BASE_URL_W500 } from "@/lib/tmdb";
import { useListStore } from "@/store/useListStore";
import { useTrailer } from "@/hooks/useTrailer";
import { cn } from "@/lib/utils";
import type { Movie } from "@/types";

interface HoverTrailerProps {
  movie: Movie;
  isLargeRow?: boolean;
  inGrid?: boolean;
}

export function HoverTrailer({ movie, isLargeRow, inGrid }: HoverTrailerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isHoverDelayed, setIsHoverDelayed] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const { addToList, removeFromList, isInList } = useListStore();

  const isSaved = isInList(movie.id);
  const mediaType = movie.media_type || (movie.first_air_date ? "tv" : "movie");

  const { videoId, loading } = useTrailer(mediaType, movie.id, isHoverDelayed);

  const handleMouseEnter = () => {
    setIsHovered(true);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHoverDelayed(true);
    }, 500); // 500ms delay before fetching and expanding
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsHoverDelayed(false);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const toggleList = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved) removeFromList(movie.id);
    else addToList(movie);
  };

  const navigateToDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/movie/${mediaType}/${movie.id}`);
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/play/${mediaType}/${movie.id}`);
  };

  const imageUrl = `${IMAGE_BASE_URL_W500}${isLargeRow ? movie.poster_path : movie.backdrop_path || movie.poster_path}`;

  return (
    <div
      className={cn(
        "relative cursor-pointer group flex-shrink-0",
        inGrid
          ? "w-full"
          : isLargeRow
            ? "w-[38vw] md:w-[26vw] lg:w-[16vw] xl:w-[14vw]"
            : "w-[42vw] md:w-[30vw] lg:w-[18vw] xl:w-[16vw]",
        isLargeRow ? "aspect-[2/3]" : "aspect-video",
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={navigateToDetails}
    >
      {/* 
        Absolute container scales up on hover, breaking out of the flow 
        to overlap adjacent cards and rows below it (Netflix style).
      */}
      <div
        className={cn(
          "absolute top-0 left-0 w-full rounded-lg glass border border-white/5 transition-all duration-300 ease-out origin-center bg-[#050505]",
          isHovered && !isLargeRow
            ? "scale-[1.1] md:scale-[1.35] z-50 shadow-[0_0_40px_rgba(0,0,0,0.8)]"
            : "scale-100 z-10 overflow-hidden h-full",
          isHovered && isLargeRow ? "scale-105 z-50 shadow-2xl" : "",
        )}
      >
        <div
          className={cn(
            "relative w-full overflow-hidden",
            isLargeRow ? "aspect-[2/3]" : "aspect-video",
            isHovered && !isLargeRow ? "rounded-t-lg" : "rounded-lg",
          )}
        >
          {/* Main Backdrop / Poster */}
          <img
            src={imageUrl}
            alt={movie.name || movie.title}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
              isHoverDelayed && videoId ? "opacity-0" : "opacity-100",
            )}
            loading="lazy"
          />

          {/* YouTube Video Wrapper */}
          {isHoverDelayed && videoId && (
            <div className="absolute inset-0 z-20 bg-black animate-in fade-in duration-500 overflow-hidden pointer-events-none">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&fs=0&playsinline=1&loop=1&playlist=${videoId}`}
                className="absolute top-1/2 left-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2"
                style={{ border: 0 }}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          )}

          {/* Loading Indicator */}
          {isHoverDelayed && loading && (
            <div className="absolute inset-0 z-10 bg-black/40 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#E50914] animate-spin" />
            </div>
          )}

          {/* Title Overlay for non-large rows when not hovered */}
          {!isLargeRow && !isHovered && (
            <div className="absolute inset-0 cinematic-gradient-bottom opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 z-30">
              <p className="text-white text-xs md:text-sm font-semibold truncate w-full drop-shadow-md">
                {movie.title || movie.name}
              </p>
            </div>
          )}
        </div>

        {/* Hover Expansion Panel for normal rows */}
        {isHovered && !isLargeRow && (
          <div className="w-full bg-[#141414] p-3 md:p-4 rounded-b-lg border border-t-0 border-white/10 animate-in fade-in slide-in-from-top-2 duration-300 hidden md:block">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <button
                  className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-white text-black flex items-center justify-center hover:bg-white/80 transition shadow-md"
                  onClick={handlePlay}
                >
                  <Play className="w-3 h-3 md:w-4 md:h-4 fill-black" />
                </button>
                <button
                  className="w-7 h-7 md:w-9 md:h-9 rounded-full border-2 border-gray-400 text-white flex items-center justify-center hover:border-white hover:bg-white/10 transition group/btn shadow-md bg-black/40"
                  onClick={toggleList}
                >
                  {isSaved ? (
                    <Check className="w-3 h-3 md:w-4 md:h-4 group-hover/btn:scale-110 transition" />
                  ) : (
                    <Plus className="w-3 h-3 md:w-4 md:h-4 group-hover/btn:scale-110 transition" />
                  )}
                </button>
              </div>
              <button
                className="w-7 h-7 md:w-9 md:h-9 rounded-full border-2 border-gray-400 text-white flex items-center justify-center hover:border-white hover:bg-white/10 transition shadow-md bg-black/40"
                onClick={navigateToDetails}
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 text-[10px] md:text-xs font-semibold text-gray-400 mb-1">
              <span className="px-1.5 py-0.5 bg-[#E50914] text-white rounded-[2px] leading-none text-[8px] md:text-[10px]">
                {(movie.vote_average * 10).toFixed(0)}% MATCH
              </span>
              <span className="border border-gray-600 px-1 rounded-[2px] leading-none text-[8px] md:text-[10px]">
                HD
              </span>
            </div>
            <div className="text-white text-[10px] md:text-sm font-medium truncate w-full mt-1.5">
              {movie.title || movie.name}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
