import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type User = {
  id: string;
  name: string;
  role: 'student' | 'teacher';
  class?: string;
  subject?: string;
  qrCode: string;
};

type AttendanceRecord = {
  id: string;
  userId: string;
  userName: string;
  role: 'student' | 'teacher';
  date: string;
  time: string;
  class?: string;
};

type TeachingAgenda = {
  id: string;
  teacherId: string;
  teacherName: string;
  date: string;
  class: string;
  subject: string;
  material: string;
};

interface AppContextType {
  currentUser: User | null;
  users: User[];
  attendanceRecords: AttendanceRecord[];
  teachingAgendas: TeachingAgenda[];
  login: (id: string) => void;
  logout: () => void;
  registerUser: (user: Omit<User, 'id' | 'qrCode'>) => string;
  addAttendance: (userId: string) => void;
  addTeachingAgenda: (agenda: Omit<TeachingAgenda, 'id' | 'teacherId' | 'teacherName'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [teachingAgendas, setTeachingAgendas] = useState<TeachingAgenda[]>([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const storedUsers = localStorage.getItem('users');
    const storedAttendance = localStorage.getItem('attendanceRecords');
    const storedAgendas = localStorage.getItem('teachingAgendas');

    if (storedUser) setCurrentUser(JSON.parse(storedUser));
    if (storedUsers) setUsers(JSON.parse(storedUsers));
    if (storedAttendance) setAttendanceRecords(JSON.parse(storedAttendance));
    if (storedAgendas) setTeachingAgendas(JSON.parse(storedAgendas));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
    localStorage.setItem('teachingAgendas', JSON.stringify(teachingAgendas));
  }, [currentUser, users, attendanceRecords, teachingAgendas]);

  const login = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user) {
      setCurrentUser(user);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const registerUser = (userData: Omit<User, 'id' | 'qrCode'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const qrCode = `MISBAHUL-${userData.role.toUpperCase()}-${id}`;
    
    const newUser: User = {
      id,
      qrCode,
      ...userData
    };
    
    setUsers(prev => [...prev, newUser]);
    return id;
  };

  const addAttendance = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];

    const newAttendance: AttendanceRecord = {
      id: Math.random().toString(36).substring(2, 9),
      userId,
      userName: user.name,
      role: user.role,
      date,
      time,
      class: user.class
    };

    setAttendanceRecords(prev => [...prev, newAttendance]);
  };

  const addTeachingAgenda = (agendaData: Omit<TeachingAgenda, 'id' | 'teacherId' | 'teacherName'>) => {
    if (!currentUser || currentUser.role !== 'teacher') return;

    const newAgenda: TeachingAgenda = {
      id: Math.random().toString(36).substring(2, 9),
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      ...agendaData
    };

    setTeachingAgendas(prev => [...prev, newAgenda]);
  };

  return (
    <AppContext.Provider 
      value={{ 
        currentUser, 
        users, 
        attendanceRecords, 
        teachingAgendas, 
        login, 
        logout, 
        registerUser, 
        addAttendance, 
        addTeachingAgenda 
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
