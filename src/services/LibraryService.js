import { supabase } from '../config/supabase';

export const LibraryService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('library_items_consultorio')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar itens da biblioteca:', error);
      return [];
    }
  },

  async getByCategory(category) {
    try {
      const { data, error } = await supabase
        .from('library_items_consultorio')
        .select('*')
        .eq('category', category)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar itens por categoria:', error);
      return [];
    }
  },

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('library_items_consultorio')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar item da biblioteca:', error);
      return null;
    }
  },

  async create(itemData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { data, error } = await supabase
        .from('library_items_consultorio')
        .insert([
          {
            ...itemData,
            user_id: user.id,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao criar item da biblioteca:', error);
      return { success: false, error: 'Erro ao salvar item' };
    }
  },

  async update(id, itemData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { data, error } = await supabase
        .from('library_items_consultorio')
        .update({
          ...itemData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao atualizar item da biblioteca:', error);
      return { success: false, error: 'Erro ao atualizar item' };
    }
  },

  async delete(id) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { error } = await supabase
        .from('library_items_consultorio')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar item da biblioteca:', error);
      return { success: false, error: 'Erro ao deletar item' };
    }
  },

  async search(query) {
    try {
      const { data, error } = await supabase
        .from('library_items_consultorio')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro na busca:', error);
      return [];
    }
  }
};