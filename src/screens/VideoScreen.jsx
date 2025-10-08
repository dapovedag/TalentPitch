import { useState, useEffect, useRef } from 'react';
import DataManager from '../managers/DataManager';
import VideoPlayer from '../components/VideoPlayer';

const VideoScreen = ({ algorithmId, userId, userName, onBack }) => {
  const [showIntro, setShowIntro] = useState(true);
  const [fontIndex, setFontIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [interactions, setInteractions] = useState({});
  const touchStartY = useRef(0);
  const algorithmRef = useRef(null);

  const fonts = ['Georgia', 'Times New Roman', 'Palatino', 'Garamond', 'Baskerville'];
  const algorithm = DataManager.getAlgorithm(algorithmId);

  useEffect(() => {
    algorithmRef.current = algorithm;
  }, [algorithm]);

  useEffect(() => {
    setShowIntro(true);
    setFontIndex(0);
    setCurrentVideoIndex(0);
    setInteractions({});
  }, [algorithmId]);

  useEffect(() => {
    if (showIntro) {
      const interval = setInterval(() => {
        setFontIndex(prev => {
          if (prev >= fonts.length - 1) {
            clearInterval(interval);
            setTimeout(() => setShowIntro(false), 500);
            return prev;
          }
          return prev + 1;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [showIntro]);

  useEffect(() => {
    if (showIntro) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const algo = algorithmRef.current;
      if (!algo) return;

      if (e.deltaY > 0) {
        setCurrentVideoIndex(prev => 
          prev < algo.videos.length - 1 ? prev + 1 : prev
        );
      } else if (e.deltaY < 0) {
        setCurrentVideoIndex(prev => prev > 0 ? prev - 1 : prev);
      }
    };

    const handleKeyDown = (e) => {
      const algo = algorithmRef.current;
      if (!algo) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentVideoIndex(prev => 
          prev < algo.videos.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentVideoIndex(prev => prev > 0 ? prev - 1 : prev);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showIntro]);

  const saveLikeToServer = async (updatedInteractions) => {
    try {
      const response = await fetch('https://talentpitch-api.onrender.com/api/save-like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          userName: userName,
          algorithmId: algorithmId,
          interactions: updatedInteractions
        })
      });
      
      if (response.ok) {
        console.log('Like guardado en servidor');
      }
    } catch (error) {
      console.error('Error guardando like:', error);
    }
  };

  const handleLike = (liked) => {
    const videoUrl = algorithm.videos[currentVideoIndex];
    
    setInteractions(prev => {
      const currentValue = prev[videoUrl];
      let newInteractions;
      
      if (currentValue === liked) {
        newInteractions = { ...prev };
        delete newInteractions[videoUrl];
      } else {
        newInteractions = {
          ...prev,
          [videoUrl]: liked
        };
      }
      
      saveLikeToServer(newInteractions);
      return newInteractions;
    });
  };

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentVideoIndex(prev => 
          prev < algorithm.videos.length - 1 ? prev + 1 : prev
        );
      } else {
        setCurrentVideoIndex(prev => prev > 0 ? prev - 1 : prev);
      }
    }
  };

  const goToPrevious = () => {
    setCurrentVideoIndex(prev => prev > 0 ? prev - 1 : prev);
  };

  const goToNext = () => {
    setCurrentVideoIndex(prev => 
      prev < algorithm.videos.length - 1 ? prev + 1 : prev
    );
  };

  if (showIntro) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <h1 
          className="text-white text-7xl"
          style={{ fontFamily: fonts[fontIndex] }}
        >
          Algoritmo {algorithmId}
        </h1>
      </div>
    );
  }

  const currentVideo = algorithm.videos[currentVideoIndex];
  const currentLike = interactions[currentVideo];
  const isFirstVideo = currentVideoIndex === 0;
  const isLastVideo = currentVideoIndex === algorithm.videos.length - 1;

  return (
    <div 
      className="fixed inset-0 bg-white overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="h-full flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-6">
            {!isFirstVideo && (
              <button
                onClick={goToPrevious}
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all bg-white hover:bg-gray-100"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              </button>
            )}
            
            {!isLastVideo && (
              <button
                onClick={goToNext}
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all bg-white hover:bg-gray-100"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            )}
          </div>

          <div className="w-full max-w-md h-screen bg-white overflow-hidden">
            <VideoPlayer
              videoUrl={currentVideo}
              isActive={true}
            />
          </div>

          <div className="flex flex-col gap-6">
            <button
              onClick={() => handleLike(true)}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all ${
                currentLike === true ? 'bg-green-500' : 'bg-white'
              }`}
            >
              <span className={`text-4xl ${currentLike === true ? 'text-white' : ''}`}>👍</span>
            </button>
            
            <button
              onClick={() => handleLike(false)}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all ${
                currentLike === false ? 'bg-red-500' : 'bg-white'
              }`}
            >
              <span className={`text-4xl ${currentLike === false ? 'text-white' : ''}`}>👎</span>
            </button>
          </div>
        </div>

        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white bg-opacity-80 rounded-full flex items-center justify-center shadow-lg"
          >
            <span className="text-xl">←</span>
          </button>
          
          <div className="px-4 py-2 bg-white bg-opacity-80 rounded-full shadow-lg">
            <span className="text-sm font-semibold">{currentVideoIndex + 1}/{algorithm.videos.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoScreen;