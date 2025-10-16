import React from 'react';
import DataManager from '../managers/DataManager';

const AlgorithmSelector = ({ onSelectAlgorithm }) => {
  const allAlgorithms = DataManager.getAllAlgorithms();
  
  const algorithmIds = Object.keys(allAlgorithms).map(id => parseInt(id));
  
  const colors = ['#3DD1E7', '#FFD93D', '#FF6B9D', '#4ADE80', '#A78BFA'];
  
  const algorithms = algorithmIds.map((id, index) => ({
    id: id,
    color: colors[index % colors.length]
  }));

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-lg space-y-8">
        <h2 className="text-black text-3xl font-bold mb-12 text-center">
          Selecciona un Algoritmo
        </h2>
        
        <div className="space-y-12">
          {algorithms.map(({ id, color }) => (
            <div key={id} className="flex justify-center">
              <button
                onClick={() => onSelectAlgorithm(id)}
                style={{ backgroundColor: color }}
                className="relative px-8 py-4 text-black font-bold text-xl -rotate-2 cursor-pointer select-none border border-black transition-all hover:translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0"
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
  );
};

export default AlgorithmSelector;