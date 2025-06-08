import { supabase } from '../config/supabase';

export const AuthService = {
  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('users_consultorio')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Se não encontrar pelo ID, tentar pelo email
        const { data: profileByEmail, error: emailError } = await supabase
          .from('users_consultorio')
          .select('*')
          .eq('email', user.email)
          .single();

        if (emailError) {
          console.error('Erro ao buscar usuário:', emailError);
          return null;
        }
        return profileByEmail;
      }

      if (error) {
        console.error('Erro ao buscar usuário:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
  },

  async updateProfile(userData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { data, error } = await supabase
        .from('users_consultorio')
        .update({
          ...userData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { success: false, error: 'Erro ao atualizar perfil' };
    }
  },

  async changePassword(currentPassword, newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      return { success: false, error: 'Erro ao alterar senha' };
    }
  },

  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Erro no logout:', error);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      console.error('Erro no logout:', error);
      return { success: false, error: 'Erro ao fazer logout' };
    }
  },

  async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro interno do sistema' };
    }
  },

  async register(userData) {
    try {
      const email = userData.email.toLowerCase().trim();
      
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
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: 'Falha ao criar usuário' };
      }

      const profileData = {
        id: authData.user.id,
        email: email,
        name: userData.name.trim(),
        profession: userData.profession || 'Veterinário(a)',
        clinic: userData.clinic.trim(),
        crmv: userData.crmv.trim(),
        phone: userData.phone.trim(),
      };

      const { data: profileResult, error: profileError } = await supabase
        .from('users_consultorio')
        .insert([profileData])
        .select()
        .single();

      if (profileError) {
        return { 
          success: false, 
          error: `Erro ao criar perfil: ${profileError.message}` 
        };
      }
      
      return { success: true, data: authData };
    } catch (error) {
      console.error('Erro no registro:', error);
      return { success: false, error: 'Erro interno do sistema' };
    }
  },

  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      return { success: false, error: 'Erro ao enviar email de recuperação' };
    }
  }
};