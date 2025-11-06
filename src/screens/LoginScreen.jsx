import { useState } from 'react';

const LoginScreen = ({ onLogin }) => {
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const CHALLENGES = [
    {
      id: 496243,
      name: 'Reina de Belleza Catrina 2025',
      video: 'https://media.talentpitch.co/challenges/496243/aws_v3__074215b4c56f44e28f647e20d4508a6b.mp4'
    },
    {
      id: 495897,
      name: 'Presentador de TV',
      video: 'https://media.talentpitch.co/challenges/495897/2025-04-25-102807-VIDEO-FLOW PRESENTADORES DE TV BEIBI.mp4'
    }
  ];

  const handleSelectChallenge = (challenge) => {
    setSelectedChallenge(challenge);
  };

  const handleContinue = () => {
    if (selectedChallenge) {
      onLogin(selectedChallenge.id, selectedChallenge.name);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-6xl">

        <div className="text-center mb-12">
          <img
            src="/image.png"
            alt="TalentPitch"
            className="mx-auto mb-6 w-64 h-auto"
          />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Selecciona un video challenge
          </h2>
          <p className="text-gray-600">
            Elige uno de los videos para comenzar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {CHALLENGES.map((challenge) => (
            <div
              key={challenge.id}
              onClick={() => handleSelectChallenge(challenge)}
              className={`cursor-pointer rounded-xl overflow-hidden border-4 transition-all ${
                selectedChallenge?.id === challenge.id
                  ? 'border-purple-600 shadow-lg'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <video
                src={challenge.video}
                className="w-full h-48 object-cover bg-black"
                muted
                playsInline
              />
              <div className="p-4 bg-white">
                <p className="text-center font-medium text-gray-700">
                  {challenge.name}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={!selectedChallenge}
            className="px-12 py-4 rounded-xl font-semibold text-white text-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#6B46C1' }}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
