import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';

function RegisterPage() {
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const { registerUser } = useApp();
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userData = {
      name,
      role,
      ...(role === 'student' ? { class: className } : { subject }),
    };
    
    const userId = registerUser(userData);
    alert(`Pendaftaran berhasil! ID pengguna Anda adalah: ${userId}\nHarap simpan ID ini untuk masuk ke sistem.`);
    navigate('/login');
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

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Daftar Akun Baru</h1>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Peran</label>
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`cursor-pointer border rounded-lg p-3 flex items-center justify-center ${
                  role === 'student'
                    ? 'bg-green-50 border-green-500 text-green-700'
                    : 'border-gray-300 text-gray-700'
                }`}
                onClick={() => setRole('student')}
              >
                Siswa
              </div>
              <div
                className={`cursor-pointer border rounded-lg p-3 flex items-center justify-center ${
                  role === 'teacher'
                    ? 'bg-green-50 border-green-500 text-green-700'
                    : 'border-gray-300 text-gray-700'
                }`}
                onClick={() => setRole('teacher')}
              >
                Guru
              </div>
            </div>
          </div>

          {role === 'student' ? (
            <div>
              <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
                Kelas
              </label>
              <input
                id="class"
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Contoh: X-A, XI-IPA 2"
                required
              />
            </div>
          ) : (
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Mata Pelajaran
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Contoh: Matematika, Bahasa Indonesia"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Daftar
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
              Masuk disini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
