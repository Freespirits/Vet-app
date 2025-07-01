import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false); // Novo flag

  useEffect(() => {
    // Verificar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Sessão inicial:', session);
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      setSession(session);

      if (event === 'SIGNED_IN' && session?.user) {
        // Não criar perfil automaticamente se estiver em processo de registro
        if (!isRegistering) {
          await loadUserProfile(session.user);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
        setIsRegistering(false); // Reset flag
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [isRegistering]);

  const loadUserProfile = async (authUser, skipAutoCreate = false) => {
    try {
      console.log('Carregando perfil para usuário:', authUser.id, authUser.email);

      // Primeiro, tentar buscar pelo ID
      let { data, error } = await supabase
        .from('users_consultorio')
        .select('*')
        .eq('id', authUser.id)
        .single();

      // Se não encontrar pelo ID, tentar buscar pelo email
      if (error && error.code === 'PGRST116') {
        console.log('Perfil não encontrado pelo ID, tentando pelo email...');

        const { data: profileByEmail, error: emailError } = await supabase
          .from('users_consultorio')
          .select('*')
          .eq('email', authUser.email)
          .single();

        if (emailError && emailError.code === 'PGRST116') {
          // Perfil não existe
          if (skipAutoCreate) {
            console.log('Perfil não existe e auto-criação foi pulada');
            setLoading(false);
            return;
          } else {
            // Criar automaticamente apenas para login (não para registro)
            console.log('Perfil não existe, criando automaticamente...');
            await createUserProfile(authUser);
            return;
          }
        } else if (emailError) {
          console.error('Erro ao buscar perfil por email:', emailError);
          setLoading(false);
          return;
        } else {
          // Perfil encontrado por email, atualizar o ID
          console.log('Perfil encontrado por email, atualizando ID...');
          const { data: updatedProfile, error: updateError } = await supabase
            .from('users_consultorio')
            .update({ id: authUser.id, updated_at: new Date().toISOString() })
            .eq('email', authUser.email)
            .select()
            .single();

          if (updateError) {
            console.error('Erro ao atualizar ID do perfil:', updateError);
            setUser(profileByEmail); // Usar perfil sem atualizar ID
          } else {
            setUser(updatedProfile);
          }
        }
      } else if (error) {
        console.error('Erro ao carregar perfil:', error);
        setLoading(false);
        return;
      } else {
        // Perfil encontrado pelo ID
        console.log('Perfil carregado com sucesso:', data);
        setUser(data);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUserProfile = async (authUser) => {
    try {
      console.log('Criando perfil automático para:', authUser.email);

      // Dados padrão para usuário de demonstração
      const isDemo = authUser.email === 'admin@petcare.com';

      const profileData = {
        id: authUser.id,
        email: authUser.email,
        name: isDemo ? 'Dr. João Silva' : authUser.user_metadata?.name || 'Usuário',
        profession: 'Veterinário(a)',
        clinic: isDemo ? 'Clínica VetCare' : 'Minha Clínica',
        crmv: isDemo ? '12345-SP' : '',
        phone: isDemo ? '(11) 99999-9999' : '',
      };

      const { data, error } = await supabase
        .from('users_consultorio')
        .insert([profileData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar perfil automático:', error);
        setLoading(false);
        return;
      }

      console.log('Perfil criado automaticamente:', data);
      setUser(data);
    } catch (error) {
      console.error('Erro ao criar perfil automático:', error);
    } finally {
      setLoading(false);
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

      setIsRegistering(true); // Sinalizar que está registrando

      const email = userData.email.toLowerCase().trim();

      // Primeiro, criar usuário na autenticação
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
          }
        }
      });

      if (authError) {
        console.error('Erro na autenticação:', authError);
        setIsRegistering(false);
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        setIsRegistering(false);
        return { success: false, error: 'Falha ao criar usuário' };
      }

      console.log('Usuário criado na auth, ID:', authData.user.id);

      // Aguardar um pouco para garantir que o evento SIGNED_IN foi processado
      await new Promise(resolve => setTimeout(resolve, 500));

      // Verificar se o perfil já existe (criado automaticamente)
      const { data: existingProfile } = await supabase
        .from('users_consultorio')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (existingProfile) {
        console.log('Perfil já existe, atualizando com dados do formulário...');

        // Atualizar perfil existente com dados do formulário
        const { data: updatedProfile, error: updateError } = await supabase
          .from('users_consultorio')
          .update({
            name: userData.name.trim(),
            profession: userData.profession || 'Veterinário(a)',
            clinic: userData.clinic.trim(),
            crmv: userData.crmv.trim(),
            phone: userData.phone.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', authData.user.id)
          .select()
          .single();

        if (updateError) {
          console.error('Erro ao atualizar perfil:', updateError);
          setIsRegistering(false);
          return {
            success: false,
            error: `Erro ao atualizar perfil: ${updateError.message}`
          };
        }

        console.log('Perfil atualizado com sucesso');
        setUser(updatedProfile);
        setIsRegistering(false);
        return { success: true, data: authData };
      } else {
        // Criar novo perfil com dados do formulário
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

          setIsRegistering(false);
          return {
            success: false,
            error: `Erro ao criar perfil: ${profileError.message}`
          };
        }

        console.log('Perfil criado com sucesso');
        setUser(profileResult);
        setIsRegistering(false);
        return { success: true, data: authData };
      }

    } catch (error) {
      console.error('Erro geral no registro:', error);
      setIsRegistering(false);
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
      setSession(null);
      setIsRegistering(false);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        login,
        register,
        updateProfile,
        logout,
        isAuthenticated: !!user && !!session,
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
