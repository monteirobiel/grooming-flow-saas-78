
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'barber';
  position?: 'administrador' | 'funcionario';
  barbershopId: string;
  phone?: string;
  specialty?: string;
  status?: 'active' | 'inactive';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  registerBarber: (barberData: any) => void;
  updateBarber: (barberData: any) => void;
  getRegisteredBarbers: () => any[];
  removeBarber: (barberId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar usuários registrados do localStorage
  const getStoredUsers = () => {
    const storedUsers = localStorage.getItem('registeredUsers');
    if (storedUsers) {
      return JSON.parse(storedUsers);
    }
    // Usuários padrão
    return [
      {
        id: 'owner-1',
        name: 'Dono da Barbearia',
        email: 'dono@barbearia.com',
        password: '123456',
        role: 'owner',
        barbershopId: 'barbearia-1'
      }
    ];
  };

  const saveUsers = (users: any[]) => {
    localStorage.setItem('registeredUsers', JSON.stringify(users));
  };

  useEffect(() => {
    // Verificar se há usuário logado
    const checkAuthStatus = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Buscar usuário nos registrados
    const registeredUsers = getStoredUsers();
    const foundUser = registeredUsers.find((u: any) => 
      u.email === email && u.password === password && u.status !== 'inactive'
    );

    if (!foundUser) {
      setIsLoading(false);
      throw new Error('E-mail ou senha incorretos');
    }

    // Criar objeto do usuário sem a senha
    const userWithoutPassword = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
      position: foundUser.position,
      barbershopId: foundUser.barbershopId,
      phone: foundUser.phone,
      specialty: foundUser.specialty,
      status: foundUser.status
    };

    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const registerBarber = (barberData: any) => {
    const users = getStoredUsers();
    
    // Verificar se email já existe
    const emailExists = users.some((u: any) => u.email === barberData.email);
    if (emailExists) {
      throw new Error('E-mail já cadastrado');
    }

    const newBarber = {
      ...barberData,
      id: `barber-${Date.now()}`,
      role: 'barber'
    };

    users.push(newBarber);
    saveUsers(users);
  };

  const updateBarber = (barberData: any) => {
    const users = getStoredUsers();
    const userIndex = users.findIndex((u: any) => u.id === barberData.id);
    
    if (userIndex !== -1) {
      // Se não foi fornecida nova senha, manter a antiga
      if (!barberData.password) {
        barberData.password = users[userIndex].password;
      }
      
      users[userIndex] = { ...users[userIndex], ...barberData };
      saveUsers(users);
    }
  };

  const removeBarber = (barberId: string) => {
    const users = getStoredUsers();
    const filteredUsers = users.filter((u: any) => u.id !== barberId);
    saveUsers(filteredUsers);
  };

  const getRegisteredBarbers = () => {
    const users = getStoredUsers();
    return users.filter((u: any) => u.role === 'barber').map((u: any) => {
      // Retornar sem a senha por segurança
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
    registerBarber,
    updateBarber,
    getRegisteredBarbers,
    removeBarber
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
