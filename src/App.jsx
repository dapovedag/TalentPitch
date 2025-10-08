import { useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import AlgorithmSelector from './screens/AlgorithmSelector';
import VideoScreen from './screens/VideoScreen';
import DataManager from './managers/DataManager';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedAlgo, setSelectedAlgo] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const handleLogin = async (userId, userName) => {
    setIsLoadingData(true);
    const success = await DataManager.loadUserData(userId);
    
    if (success) {
      setCurrentUser({ userId, userName });
    } else {
      alert('Error cargando datos del usuario');
    }
    setIsLoadingData(false);
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold mb-2">Cargando...</div>
          <div className="text-gray-600">Preparando tus videos</div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (!selectedAlgo) {
    return <AlgorithmSelector onSelectAlgorithm={(id) => setSelectedAlgo(id)} />;
  }

  return (
    <VideoScreen 
      algorithmId={selectedAlgo} 
      userId={currentUser.userId}
      userName={currentUser.userName}
      onBack={() => setSelectedAlgo(null)} 
    />
  );
};

export default App;