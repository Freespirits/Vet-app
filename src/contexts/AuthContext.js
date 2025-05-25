import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStorageData, setStorageData, removeStorageData } from '../utils/storage';
import { StorageKeys } from '../constants/Storage';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await getStorageData(StorageKeys.USER);
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Simular autenticação - em produção, fazer chamada para API
      if (email === 'admin@petcare.com' && password === '123456') {
        const userData = {
          id: Date.now().toString(),
          email,
          name: 'Dr. João Silva',
          profession: 'Veterinário',
          clinic: 'Clínica VetCare',
          crmv: '12345-SP',
          phone: '(11) 99999-9999',
          photo: null,
          loginDate: new Date().toISOString(),
        };

        await setStorageData(StorageKeys.USER, userData);
        setUser(userData);
        return { success: true };
      } else {
        return { success: false, error: 'Email ou senha inválidos' };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro interno do sistema' };
    }
  };

  const register = async (userData) => {
    try {
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        registrationDate: new Date().toISOString(),
      };

      await setStorageData(StorageKeys.USER, newUser);
      setUser(newUser);
      return { success: true };
    } catch (error) {
      console.error('Erro no registro:', error);
      return { success: false, error: 'Erro interno do sistema' };
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      const updatedUser = {
        ...user,
        ...updatedData,
        updatedAt: new Date().toISOString(),
      };

      await setStorageData(StorageKeys.USER, updatedUser);
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { success: false, error: 'Erro ao atualizar perfil' };
    }
  };

  const logout = async () => {
    try {
      await removeStorageData(StorageKeys.USER);
      setUser(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        updateProfile,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};