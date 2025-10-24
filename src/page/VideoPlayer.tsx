import React, {
  useState,
  useRef,
  useEffect,
  type MouseEvent,
  type ChangeEvent,
} from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { useLocation } from "react-router";

const VideoPlayer: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const location = useLocation();
  const link = location.state?.link;

  console.log(link);

  useEffect(() => {
    if (link && videoUrl !== link) {
      console.log(link);
      setVideoUrl(link);
    }
  }, [link, videoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = (): void => setCurrentTime(video.currentTime);
    const updateDuration = (): void => setDuration(video.duration);
    const handleEnded = (): void => setIsPlaying(false);
    const handleError = (): void =>
      setError("Failed to load video. Please check the URL.");
    const handleLoadStart = (): void => setError("");

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);
    video.addEventListener("loadstart", handleLoadStart);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);
      video.removeEventListener("loadstart", handleLoadStart);
    };
  }, [videoUrl]);

  // Auto-hide controls
  useEffect(() => {
    if (showControls) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, isPlaying]);

  const loadVideo = (): void => {
    const video = videoRef.current;
    if (video && videoUrl) {
      video.load();
    }
  };

  const togglePlay = async (): Promise<void> => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (isPlaying) {
        video.pause();
        setIsPlaying(false);
      } else {
        await video.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Error playing video:", err);
      setError("Error playing video. Please try again.");
    }
  };

  const handleSeek = (e: MouseEvent<HTMLDivElement>): void => {
    const video = videoRef.current;
    if (!video || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;

    video.currentTime = Math.max(0, Math.min(duration, newTime));
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);

    const video = videoRef.current;
    if (video) {
      video.volume = newVolume;
    }
  };

  const toggleMute = (): void => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = async (): Promise<void> => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  const skip = (seconds: number): void => {
    const video = videoRef.current;
    if (!video || !duration) return;

    const newTime = Math.max(
      0,
      Math.min(duration, video.currentTime + seconds)
    );
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number): string => {
    if (!time || isNaN(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleMouseMove = (): void => {
    setShowControls(true);
  };

  const handleVideoUrlChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setVideoUrl(e.target.value);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumeValue = isMuted ? 0 : volume;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 min-h-screen">
      <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Video Player
          </h1>

          {/* URL Input */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="url"
                value={videoUrl}
                onChange={handleVideoUrlChange}
                placeholder="Enter video URL (mp4, webm, etc.)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={loadVideo}
                disabled={!videoUrl.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Load
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Video Container */}
        {videoUrl && (
          <div
            ref={containerRef}
            className={`relative bg-black ${
              isFullscreen ? "h-screen" : "aspect-video"
            }`}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setShowControls(false)}
          >
            <video
              ref={videoRef}
              src={videoUrl}
              crossOrigin="anonymous"
              className="w-full h-full object-contain"
              onClick={togglePlay}
              preload="metadata"
            />

            {/* Controls Overlay */}
            <div
              className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300 ${
                showControls || !isPlaying ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Progress Bar */}
              <div className="px-4 pb-2">
                <div
                  className="w-full h-2 bg-gray-600 rounded-full cursor-pointer hover:h-3 transition-all"
                  onClick={handleSeek}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={duration}
                  aria-valuenow={currentTime}
                  aria-label="Video progress"
                >
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Control Panel */}
              <div className="flex items-center justify-between px-4 pb-4">
                <div className="flex items-center gap-4">
                  {/* Play/Pause */}
                  <button
                    onClick={togglePlay}
                    className="p-2 text-white hover:text-blue-400 transition-colors"
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>

                  {/* Skip buttons */}
                  <button
                    onClick={() => skip(-10)}
                    className="p-2 text-white hover:text-blue-400 transition-colors"
                    title="Skip back 10s"
                    aria-label="Skip back 10 seconds"
                  >
                    <RotateCcw size={20} />
                  </button>
                  <button
                    onClick={() => skip(10)}
                    className="p-2 text-white hover:text-blue-400 transition-colors"
                    title="Skip forward 10s"
                    aria-label="Skip forward 10 seconds"
                  >
                    <RotateCw size={20} />
                  </button>

                  {/* Volume Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMute}
                      className="text-white hover:text-blue-400 transition-colors"
                      aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volumeValue}
                      onChange={handleVolumeChange}
                      className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                      aria-label="Volume control"
                    />
                  </div>

                  {/* Time Display */}
                  <div className="text-white text-sm font-mono">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 text-white hover:text-blue-400 transition-colors"
                  aria-label="Toggle fullscreen"
                >
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {!videoUrl && (
          <div className="aspect-video bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📹</div>
              <p className="text-lg">
                Enter a video URL above to start watching
              </p>
              <p className="text-sm mt-2">
                Supports MP4, WebM, and other HTML5 video formats
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
        .slider::-webkit-slider-track {
          background: #4b5563;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;
