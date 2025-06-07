import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId) => {
    try {
      console.log('Carregando perfil para usuário:', userId);
      
      const { data, error } = await supabase
        .from('users_consultorio')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao carregar perfil:', error);
        return;
      }

      if (data) {
        console.log('Perfil carregado com sucesso');
        setUser(data);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Fazendo login...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password,
      });

      if (error) {
        console.error('Erro no login:', error);
        return { success: false, error: error.message };
      }

      console.log('Login realizado com sucesso');
      return { success: true, data };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro interno do sistema' };
    }
  };

  const register = async (userData) => {
    try {
      console.log('Iniciando registro...');
      
      const email = userData.email.toLowerCase().trim();
      
      // Primeiro, criar usuário na autenticação
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: userData.password,
      });

      if (authError) {
        console.error('Erro na autenticação:', authError);
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: 'Falha ao criar usuário' };
      }

      console.log('Usuário criado na auth, ID:', authData.user.id);

      // Aguardar um momento
      await new Promise(resolve => setTimeout(resolve, 500));

      // Criar perfil na tabela users_consultorio
      const profileData = {
        id: authData.user.id,
        email: email,
        name: userData.name.trim(),
        profession: userData.profession || 'Veterinário(a)',
        clinic: userData.clinic.trim(),
        crmv: userData.crmv.trim(),
        phone: userData.phone.trim(),
      };

      console.log('Criando perfil com dados:', profileData);

      const { data: profileResult, error: profileError } = await supabase
        .from('users_consultorio')
        .insert([profileData])
        .select()
        .single();

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
        
        // Tentar deletar usuário da auth se perfil falhou
        try {
          await supabase.auth.signOut();
        } catch (e) {
          console.error('Erro ao limpar após falha:', e);
        }
        
        return { 
          success: false, 
          error: `Erro ao criar perfil: ${profileError.message}` 
        };
      }

      console.log('Perfil criado com sucesso');
      setUser(profileResult);
      
      return { success: true, data: authData };

    } catch (error) {
      console.error('Erro geral no registro:', error);
      return { success: false, error: 'Erro interno do sistema' };
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      if (!user?.id) {
        return { success: false, error: 'Usuário não encontrado' };
      }

      const { data, error } = await supabase
        .from('users_consultorio')
        .update({
          ...updatedData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      setUser(data);
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { success: false, error: 'Erro ao atualizar perfil' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
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