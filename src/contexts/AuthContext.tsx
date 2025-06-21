import React, { createContext, useContext, useState, useEffect } from 'react';

// Electron's ipcRenderer for communication with main process
const ipcRenderer = (window as any).require?.('electron')?.ipcRenderer;

interface User {
  id: number;
  username: string;
  rank: number;
  profile_image?: string;
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  login: async () => false,
  logout: () => {},
  updateUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      if (!ipcRenderer) {
        console.error('ipcRenderer not available - running in browser mode');
        
        // Mock login for development in browser
        if (username === 'admin' && password === 'admin') {
          const mockUser = {
            id: 1,
            username: 'admin',
            rank: 8,
            profile_image: null
          };
          setUser(mockUser);
          localStorage.setItem('user', JSON.stringify(mockUser));
          return true;
        }
        return false;
      }
      
      const result = await ipcRenderer.invoke('authenticate', { username, password });
      
      if (result.success) {
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};