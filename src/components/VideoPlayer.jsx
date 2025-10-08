import { useEffect, useRef } from 'react';

const VideoPlayer = ({ videoUrl, isActive }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            if (e.name !== 'AbortError' && e.name !== 'NotSupportedError') {
              console.error('Play error:', e);
            }
          });
        }
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive, videoUrl]);

  const handleClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(e => {
          console.error('Manual play error:', e);
        });
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleError = (e) => {
    if (e.target.error && e.target.error.code !== 4) {
      console.error('Video load error:', e.target.error);
    }
  };

  return (
    <video
      ref={videoRef}
      src={videoUrl}
      className="w-full h-full object-contain cursor-pointer"
      loop
      playsInline
      preload="auto"
      onClick={handleClick}
      onError={handleError}
    />
  );
};

export default VideoPlayer;