import { useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import AlgorithmSelector from './screens/AlgorithmSelector';
import VideoScreen from './screens/VideoScreen';
import DataManager from './managers/DataManager';

const App = () => {
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [selectedAlgo, setSelectedAlgo] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const CHALLENGE_VIDEOS = {
    495547: 'https://media.talentpitch.co/challenges/495547/2025-05-22-164935-VIDEO-FLOW GOFAR.mp4',
    495847: 'https://media.talentpitch.co/challenges/495847/geradook.mp4',
    495897: 'https://media.talentpitch.co/challenges/495897/2025-04-25-102807-VIDEO-FLOW PRESENTADORES DE TV BEIBI.mp4',
    496235: 'https://media.talentpitch.co/challenges/496235/whatsapp-video-2025-08-22-at-102113-am-1.mp4',
    496243: 'https://media.talentpitch.co/challenges/496243/aws_v3__074215b4c56f44e28f647e20d4508a6b.mp4'
  };

  const handleLogin = async (challengeId, challengeName) => {
    setIsLoadingData(true);
    const success = await DataManager.loadUserData(challengeId);

    if (success) {
      setCurrentChallenge({
        id: challengeId,
        name: challengeName,
        videoUrl: CHALLENGE_VIDEOS[challengeId]
      });
    } else {
      alert('Error cargando datos del challenge');
    }
    setIsLoadingData(false);
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold mb-2">Cargando...</div>
          <div className="text-gray-600">Preparando los videos</div>
        </div>
      </div>
    );
  }

  if (!currentChallenge) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (!selectedAlgo) {
    return (
      <AlgorithmSelector
        challengeVideo={currentChallenge.videoUrl}
        onSelectAlgorithm={(id) => setSelectedAlgo(id)}
      />
    );
  }

  return (
    <VideoScreen
      algorithmId={selectedAlgo}
      userId={currentChallenge.id}
      userName={currentChallenge.name}
      onBack={() => setSelectedAlgo(null)}
    />
  );
};

export default App;
