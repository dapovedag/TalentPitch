const AlgorithmSelector = ({ onSelectAlgorithm }) => {
  const algorithms = [1, 2, 3, 4, 5];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <h2 className="text-white text-3xl font-bold mb-8 text-center">
          Selecciona un Algoritmo
        </h2>
        
        <div className="space-y-4">
          {algorithms.map((id) => (
            <button
              key={id}
              onClick={() => onSelectAlgorithm(id)}
              className="w-full bg-white text-black py-6 px-8 rounded-xl text-2xl font-semibold hover:bg-gray-100 transition-all"
            >
              Algoritmo {id}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlgorithmSelector;