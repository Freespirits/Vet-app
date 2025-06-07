import { supabase } from '../config/supabase';

export const ClientService = {
  async getAll() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('clients_consultorio')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      return [];
    }
  },

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('clients_consultorio')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      return null;
    }
  },

  async create(clientData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      // Verificar se email já existe
      const { data: existingClient } = await supabase
        .from('clients_consultorio')
        .select('id')
        .eq('email', clientData.email)
        .eq('user_id', user.id)
        .single();

      if (existingClient) {
        return { success: false, error: 'Email já cadastrado' };
      }

      const { data, error } = await supabase
        .from('clients_consultorio')
        .insert([
          {
            ...clientData,
            user_id: user.id,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      return { success: false, error: 'Erro ao salvar cliente' };
    }
  },

  async update(id, clientData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      // Verificar se email já existe em outro cliente
      const { data: existingClient } = await supabase
        .from('clients_consultorio')
        .select('id')
        .eq('email', clientData.email)
        .eq('user_id', user.id)
        .neq('id', id)
        .single();

      if (existingClient) {
        return { success: false, error: 'Email já cadastrado para outro cliente' };
      }

      const { data, error } = await supabase
        .from('clients_consultorio')
        .update({
          ...clientData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      return { success: false, error: 'Erro ao atualizar cliente' };
    }
  },

  async delete(id) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { error } = await supabase
        .from('clients_consultorio')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      return { success: false, error: 'Erro ao deletar cliente' };
    }
  },

  async search(query) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('clients_consultorio')
        .select('*')
        .eq('user_id', user.id)
        .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%,cpf.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro na busca:', error);
      return [];
    }
  },

  async getStats() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { total: 0, thisMonth: 0, active: 0 };

      const { data, error } = await supabase
        .from('clients_consultorio')
        .select('created_at')
        .eq('user_id', user.id);

      if (error) throw error;

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const thisMonth = data.filter(client => {
        const createdDate = new Date(client.created_at);
        return createdDate.getMonth() === currentMonth && 
               createdDate.getFullYear() === currentYear;
      });

      return {
        total: data.length,
        thisMonth: thisMonth.length,
        active: data.length, // Todos são considerados ativos por padrão
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return { total: 0, thisMonth: 0, active: 0 };
    }
  }
};