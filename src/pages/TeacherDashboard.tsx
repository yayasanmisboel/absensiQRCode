import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { format } from 'date-fns';
import { useApp } from '../context/AppContext';
import { Squircle, Book, Check, Clock, LogOut } from 'lucide-react';

function TeacherDashboard() {
  const { currentUser, logout, attendanceRecords, addAttendance, teachingAgendas, addTeachingAgenda } = useApp();
  const navigate = useNavigate();
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [showAgendaForm, setShowAgendaForm] = useState(false);
  const [agendaForm, setAgendaForm] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    class: '',
    subject: currentUser?.subject || '',
    material: ''
  });
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (currentUser.role !== 'teacher') {
      navigate('/student-dashboard');
      return;
    }

    // Check if the teacher has already checked in today
    const todayAttendance = attendanceRecords.find(
      record => record.userId === currentUser.id && record.date === today
    );
    
    setHasCheckedIn(!!todayAttendance);
  }, [currentUser, navigate, attendanceRecords, today]);

  const handleCheckIn = () => {
    if (currentUser && !hasCheckedIn) {
      addAttendance(currentUser.id);
      setHasCheckedIn(true);
      
      // Show WhatsApp notification placeholder
      alert('Absensi berhasil! Notifikasi WhatsApp akan dikirim dalam implementasi penuh.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAgendaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      addTeachingAgenda(agendaForm);
      // Reset form
      setAgendaForm({
        date: format(new Date(), 'yyyy-MM-dd'),
        class: '',
        subject: currentUser.subject || '',
        material: ''
      });
      setShowAgendaForm(false);
      alert('Agenda mengajar berhasil ditambahkan!');
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Guru Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-600 hover:text-red-600"
          >
            <LogOut className="h-4 w-4 mr-1" />
            <span>Keluar</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold">{currentUser.name}</h2>
            <p className="text-gray-600">Mata Pelajaran: {currentUser.subject}</p>
            <p className="text-gray-500 text-sm mt-1">ID: {currentUser.id}</p>
          </div>

          <div className="flex justify-center my-6">
            <div className="p-2 border-2 border-gray-200 rounded-lg">
              <QRCodeSVG value={currentUser.qrCode} size={180} />
            </div>
          </div>

          <p className="text-center text-sm text-gray-600 mb-4">
            QR Code Anda untuk absensi
          </p>

          <button
            onClick={handleCheckIn}
            disabled={hasCheckedIn}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center ${
              hasCheckedIn
                ? 'bg-green-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {hasCheckedIn ? (
              <>
                <Check className="h-5 w-5 mr-2" />
                Sudah Absen Hari Ini
              </>
            ) : (
              <>
                <Clock className="h-5 w-5 mr-2" />
                Absen Sekarang
              </>
            )}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Agenda Mengajar</h2>
            <button
              onClick={() => setShowAgendaForm(!showAgendaForm)}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-lg"
            >
              {showAgendaForm ? 'Batal' : 'Tambah Agenda'}
            </button>
          </div>

          {showAgendaForm && (
            <form onSubmit={handleAgendaSubmit} className="mb-6 border border-gray-200 rounded-lg p-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={agendaForm.date}
                    onChange={(e) => setAgendaForm({...agendaForm, date: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
                  <input
                    type="text"
                    value={agendaForm.class}
                    onChange={(e) => setAgendaForm({...agendaForm, class: e.target.value})}
                    placeholder="Contoh: X-A"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    value={agendaForm.subject}
                    onChange={(e) => setAgendaForm({...agendaForm, subject: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Materi</label>
                  <textarea
                    value={agendaForm.material}
                    onChange={(e) => setAgendaForm({...agendaForm, material: e.target.value})}
                    placeholder="Deskripsi materi yang diajarkan"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={3}
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>
          )}

          {teachingAgendas
            .filter(agenda => agenda.teacherId === currentUser.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(agenda => (
              <div key={agenda.id} className="border-b border-gray-100 py-3 last:border-0">
                <div className="mb-1">
                  <div className="flex justify-between">
                    <p className="font-medium">{format(new Date(agenda.date), 'dd MMMM yyyy')}</p>
                    <span className="text-sm text-gray-600">Kelas: {agenda.class}</span>
                  </div>
                  <p className="text-gray-700 text-sm">{agenda.subject}</p>
                </div>
                <p className="text-sm bg-gray-50 p-2 rounded">
                  <Book className="inline h-4 w-4 mr-1 text-gray-500" />
                  {agenda.material}
                </p>
              </div>
            ))}

          {teachingAgendas.filter(agenda => agenda.teacherId === currentUser.id).length === 0 && (
            <div className="flex flex-col items-center py-6 text-gray-500">
              <Squircle className="h-8 w-8 mb-2" />
              <p>Belum ada agenda mengajar</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Riwayat Absensi</h2>

          {attendanceRecords
            .filter(record => record.userId === currentUser.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(record => (
              <div key={record.id} className="border-b border-gray-100 py-3 last:border-0">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{format(new Date(record.date), 'dd MMMM yyyy')}</p>
                    <p className="text-sm text-gray-600">Jam: {record.time}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Hadir
                    </span>
                  </div>
                </div>
              </div>
            ))}

          {attendanceRecords.filter(record => record.userId === currentUser.id).length === 0 && (
            <p className="text-gray-500 text-center py-4">Belum ada riwayat absensi</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;
