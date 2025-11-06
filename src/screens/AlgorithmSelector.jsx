import React from 'react';

const AlgorithmSelector = ({ challengeVideo, onSelectAlgorithm }) => {
  const colors = ['#3DD1E7'];

  const algorithms = [1].map((num, index) => ({
    id: num,
    color: colors[index]
  }));

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

        <div className="order-1 lg:order-1">
          <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-200">
            <video
              src={challengeVideo}
              controls
              autoPlay
              loop
              className="w-full h-auto bg-black"
              playsInline
            />
          </div>
          <p className="text-center text-gray-600 mt-4 text-lg">
            Video del Challenge
          </p>
        </div>

        <div className="order-2 lg:order-2">
          <h2 className="text-black text-3xl font-bold mb-8 text-center">
            Seleccionar
          </h2>

          <div className="space-y-6">
            {algorithms.map(({ id, color }) => (
              <div key={id} className="flex justify-center">
                <button
                  onClick={() => onSelectAlgorithm(id)}
                  style={{ backgroundColor: color }}
                  className="relative px-8 py-4 text-black font-bold text-xl -rotate-2 cursor-pointer select-none border border-black transition-all hover:translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 w-64"
                >
                  <span className="relative z-10">Algoritmo {id}</span>
                  <div
                    className="absolute bottom-1 left-1 w-full h-full border border-black -z-10 transition-all"
                    style={{
                      bottom: '4px',
                      left: '4px',
                      width: 'calc(100% - 1px)',
                      height: 'calc(100% - 1px)'
                    }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AlgorithmSelector;
