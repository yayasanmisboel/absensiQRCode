import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { School } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const { currentUser } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to the appropriate dashboard
    if (currentUser) {
      if (currentUser.role === 'student') {
        navigate('/student-dashboard');
      } else {
        navigate('/teacher-dashboard');
      }
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-green-50 to-green-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-green-100 p-3 rounded-full mb-4">
            <School className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-800">Misbahul Ulum</h1>
          <p className="text-center text-gray-600 mt-2">Sistem Absensi Online</p>
        </div>

        <div className="space-y-4">
          <Link 
            to="/login" 
            className="block w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg text-center font-medium transition-colors"
          >
            Masuk
          </Link>
          
          <Link 
            to="/register" 
            className="block w-full bg-white border border-green-600 text-green-600 hover:bg-green-50 py-3 px-4 rounded-lg text-center font-medium transition-colors"
          >
            Daftar
          </Link>
          
          <Link 
            to="/public-attendance" 
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg text-center font-medium transition-colors"
          >
            Lihat Laporan Absensi
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2023 Misbahul Ulum. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
