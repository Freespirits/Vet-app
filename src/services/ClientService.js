import { supabase } from '../config/supabase';

export const ClientService = {
  async getAll() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('Usuário não autenticado');
        return [];
      }

      console.log('Buscando clientes para o usuário:', user.id);

      const { data, error } = await supabase
        .from('clients_consultorio')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar clientes:', error);
        throw error;
      }

      console.log(`${data?.length || 0} clientes encontrados`);
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      return [];
    }
  },

  async getById(id) {
    try {
      if (!id) {
        console.error('ID do cliente não fornecido');
        return null;
      }

      const { data, error } = await supabase
        .from('clients_consultorio')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar cliente por ID:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      return null;
    }
  },

  async create(clientData) {
    try {
      console.log('Iniciando criação de cliente...');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('Usuário não autenticado para criar cliente');
        return { success: false, error: 'Usuário não autenticado' };
      }

      console.log('Usuário autenticado:', user.id);
      console.log('Dados do cliente:', clientData);

      // Verificar se email já existe para este usuário
      const { data: existingClient } = await supabase
        .from('clients_consultorio')
        .select('id')
        .eq('email', clientData.email.toLowerCase().trim())
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingClient) {
        console.log('Email já cadastrado:', clientData.email);
        return { success: false, error: 'Email já cadastrado' };
      }

      // Preparar dados para inserção
      const insertData = {
        user_id: user.id,
        name: clientData.name.trim(),
        email: clientData.email.toLowerCase().trim(),
        phone: clientData.phone.trim(),
        cpf: clientData.cpf?.trim() || null,
        address: clientData.address?.trim() || null,
        city: clientData.city?.trim() || null,
        state: clientData.state?.trim() || null,
        zip_code: clientData.zipCode?.trim() || null,
        notes: clientData.notes?.trim() || null,
      };

      console.log('Dados preparados para inserção:', insertData);

      const { data, error } = await supabase
        .from('clients_consultorio')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao inserir cliente:', error);
        throw error;
      }

      console.log('Cliente criado com sucesso:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      return { 
        success: false, 
        error: error.message || 'Erro ao salvar cliente' 
      };
    }
  },

  async update(id, clientData) {
    try {
      console.log('Iniciando atualização de cliente:', id);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('Usuário não autenticado para atualizar cliente');
        return { success: false, error: 'Usuário não autenticado' };
      }

      // Verificar se email já existe em outro cliente
      const { data: existingClient } = await supabase
        .from('clients_consultorio')
        .select('id')
        .eq('email', clientData.email.toLowerCase().trim())
        .eq('user_id', user.id)
        .neq('id', id)
        .maybeSingle();

      if (existingClient) {
        console.log('Email já cadastrado para outro cliente:', clientData.email);
        return { success: false, error: 'Email já cadastrado para outro cliente' };
      }

      // Preparar dados para atualização
      const updateData = {
        name: clientData.name.trim(),
        email: clientData.email.toLowerCase().trim(),
        phone: clientData.phone.trim(),
        cpf: clientData.cpf?.trim() || null,
        address: clientData.address?.trim() || null,
        city: clientData.city?.trim() || null,
        state: clientData.state?.trim() || null,
        zip_code: clientData.zipCode?.trim() || null,
        notes: clientData.notes?.trim() || null,
        updated_at: new Date().toISOString(),
      };

      console.log('Dados preparados para atualização:', updateData);

      const { data, error } = await supabase
        .from('clients_consultorio')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar cliente:', error);
        throw error;
      }

      console.log('Cliente atualizado com sucesso:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      return { 
        success: false, 
        error: error.message || 'Erro ao atualizar cliente' 
      };
    }
  },

  async delete(id) {
    try {
      console.log('Iniciando exclusão de cliente:', id);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('Usuário não autenticado para deletar cliente');
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { error } = await supabase
        .from('clients_consultorio')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao deletar cliente:', error);
        throw error;
      }

      console.log('Cliente deletado com sucesso');
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      return { 
        success: false, 
        error: error.message || 'Erro ao deletar cliente' 
      };
    }
  },

  async search(query) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('Usuário não autenticado para buscar clientes');
        return [];
      }

      const { data, error } = await supabase
        .from('clients_consultorio')
        .select('*')
        .eq('user_id', user.id)
        .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%,cpf.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro na busca de clientes:', error);
        throw error;
      }

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

      if (error) {
        console.error('Erro ao buscar estatísticas de clientes:', error);
        throw error;
      }

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