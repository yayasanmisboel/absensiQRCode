import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';

function LoginPage() {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const { users, login } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = users.find(u => u.id === userId);
    if (!user) {
      setError('ID pengguna tidak ditemukan');
      return;
    }

    login(userId);
    
    // Redirect based on role
    if (user.role === 'student') {
      navigate('/student-dashboard');
    } else {
      navigate('/teacher-dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-green-50 to-green-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <Link to="/" className="flex items-center text-green-600 hover:text-green-700">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Kembali</span>
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Masuk ke Sistem Absensi</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
              ID Pengguna
            </label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Masukkan ID pengguna"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Masuk
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Belum punya akun?{' '}
            <Link to="/register" className="text-green-600 hover:text-green-700 font-medium">
              Daftar disini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
