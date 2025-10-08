import { useState } from 'react';

const LoginScreen = ({ onLogin }) => {
  const [selectedUser, setSelectedUser] = useState('');
  const [password, setPassword] = useState('');

  const USERS = {
    1990839: 'Christian',
    87904: 'Marco',
    140298: 'Josue',
    2021607: 'Maria',
    1995657: 'Vero',
    1995431: 'Juanjo',
    2021502: 'Lu',
    12: 'Santiago',
    1979789: 'Dani',
    1990069: 'Ruth',
    2021394: 'Paul',
    1994339: 'Luis',
    101916: 'SantiR',
    1966937: 'Majo'
  };

  const handleLogin = () => {
    const userId = parseInt(selectedUser);
    
    if (userId && parseInt(password) === userId) {
      onLogin(userId, USERS[userId]);
    } else {
      alert('Clave incorrecta');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md px-8">
        
        <div className="text-center mb-12">
          <img 
            src="/image.png" 
            alt="TalentPitch" 
            className="mx-auto mb-6 w-64 h-auto"
          />
          {selectedUser && (
            <p className="text-gray-700 text-xl font-medium">{USERS[parseInt(selectedUser)]}</p>
          )}
        </div>
        
        <div className="space-y-4">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-center text-lg"
          >
            <option value="">Selecciona tu nombre</option>
            {Object.entries(USERS).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-center text-lg"
            placeholder="Ingresa tu clave"
            disabled={!selectedUser}
          />
          
          <button
            onClick={handleLogin}
            disabled={!selectedUser}
            className="w-full py-4 rounded-xl font-semibold text-white text-lg hover:opacity-90 transition-all disabled:opacity-50"
            style={{ backgroundColor: '#6B46C1' }}
          >
            Ingresar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;