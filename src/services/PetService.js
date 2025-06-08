import { supabase } from '../config/supabase';

export const PetService = {
  async getAll() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('pets_consultorio')
        .select(`
          *,
          client:clients_consultorio!inner(id, name, user_id)
        `)
        .eq('client.user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Adicionar clientId para compatibilidade
      const petsWithClientId = (data || []).map(pet => ({
        ...pet,
        clientId: pet.client_id || pet.client?.id
      }));
      
      return petsWithClientId;
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
      return [];
    }
  },

  async getById(id) {
    try {
      if (!id) {
        console.error('ID do pet não fornecido');
        return null;
      }

      const { data, error } = await supabase
        .from('pets_consultorio')
        .select(`
          *,
          client:clients_consultorio(*)
        `)
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar pet por ID:', error);
        throw error;
      }

      return data ? {
        ...data,
        clientId: data.client_id || data.client?.id
      } : null;
    } catch (error) {
      console.error('Erro ao buscar pet:', error);
      return null;
    }
  },

  async getByClientId(clientId) {
    try {
      if (!clientId) {
        console.error('ID do cliente não fornecido');
        return [];
      }

      const { data, error } = await supabase
        .from('pets_consultorio')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Adicionar clientId para compatibilidade
      const petsWithClientId = (data || []).map(pet => ({
        ...pet,
        clientId: pet.client_id || clientId
      }));
      
      return petsWithClientId;
    } catch (error) {
      console.error('Erro ao buscar pets do cliente:', error);
      return [];
    }
  },

  async create(petData) {
    try {
      console.log('Criando pet com dados:', petData);
      
      // Validação básica
      if (!petData.name || !petData.client_id) {
        return { success: false, error: 'Nome e cliente são obrigatórios' };
      }

      const { data, error } = await supabase
        .from('pets_consultorio')
        .insert([petData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao inserir pet:', error);
        return { success: false, error: `Erro ao salvar pet: ${error.message}` };
      }

      console.log('Pet criado com sucesso:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao criar pet:', error);
      return { success: false, error: 'Erro interno do sistema' };
    }
  },

  async update(id, petData) {
    try {
      console.log('Atualizando pet:', id, petData);
      
      // Validação básica
      if (!petData.name || !petData.client_id) {
        return { success: false, error: 'Nome e cliente são obrigatórios' };
      }

      const { data, error } = await supabase
        .from('pets_consultorio')
        .update({
          ...petData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar pet:', error);
        return { success: false, error: `Erro ao atualizar pet: ${error.message}` };
      }

      console.log('Pet atualizado com sucesso:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao atualizar pet:', error);
      return { success: false, error: 'Erro interno do sistema' };
    }
  },

  async delete(id) {
    try {
      const { error } = await supabase
        .from('pets_consultorio')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar pet:', error);
      return { success: false, error: 'Erro ao deletar pet' };
    }
  },

  async search(query, clientId = null) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      let queryBuilder = supabase
        .from('pets_consultorio')
        .select(`
          *,
          client:clients_consultorio!inner(id, name, user_id)
        `)
        .eq('client.user_id', user.id);

      if (clientId) {
        queryBuilder = queryBuilder.eq('client_id', clientId);
      }

      const { data, error } = await queryBuilder
        .or(`name.ilike.%${query}%,species.ilike.%${query}%,breed.ilike.%${query}%,microchip.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Adicionar clientId para compatibilidade
      const petsWithClientId = (data || []).map(pet => ({
        ...pet,
        clientId: pet.client_id || pet.client?.id
      }));
      
      return petsWithClientId;
    } catch (error) {
      console.error('Erro na busca:', error);
      return [];
    }
  },

  async getStats() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { total: 0, thisMonth: 0, bySpecies: {}, active: 0 };

      const { data, error } = await supabase
        .from('pets_consultorio')
        .select(`
          created_at,
          species,
          client:clients_consultorio!inner(user_id)
          `)
        .eq('client.user_id', user.id);

      if (error) throw error;

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const thisMonth = data.filter(pet => {
        const createdDate = new Date(pet.created_at);
        return createdDate.getMonth() === currentMonth && 
               createdDate.getFullYear() === currentYear;
      });

      const bySpecies = data.reduce((acc, pet) => {
        acc[pet.species] = (acc[pet.species] || 0) + 1;
        return acc;
      }, {});

      return {
        total: data.length,
        thisMonth: thisMonth.length,
        bySpecies,
        active: data.length,
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return { total: 0, thisMonth: 0, bySpecies: {}, active: 0 };
    }
  },

  async uploadPhoto(petId, photoUri) {
    try {
      const fileExt = photoUri.split('.').pop();
      const fileName = `${petId}-${Date.now()}.${fileExt}`;
      const filePath = `pets/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, {
          uri: photoUri,
          type: `image/${fileExt}`,
          name: fileName,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('pets_consultorio')
        .update({ photo_url: data.publicUrl })
        .eq('id', petId);

      if (updateError) throw updateError;

      return { success: true, url: data.publicUrl };
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
      return { success: false, error: 'Erro ao fazer upload da foto' };
    }
  }
};