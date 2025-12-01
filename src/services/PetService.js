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
      console.error('שגיאה בשליפת חיות מחמד:', error);
      return [];
    }
  },

  async getById(id) {
    try {
      if (!id) {
        console.error('מזהה חיית מחמד לא סופק');
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
        console.error('שגיאה בשליפת חיית מחמד לפי מזהה:', error);
        throw error;
      }

      return data ? {
        ...data,
        clientId: data.client_id || data.client?.id
      } : null;
    } catch (error) {
      console.error('שגיאה בשליפת חיית מחמד:', error);
      return null;
    }
  },

  async getByClientId(clientId) {
    try {
      if (!clientId) {
        console.error('מזהה לקוח לא סופק');
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
      console.error('שגיאה בשליפת חיות המחמד של הלקוח:', error);
      return [];
    }
  },

  async create(petData) {
    try {
      console.log('יוצר חיית מחמד עם נתונים:', petData);
      
      // ולידציה בסיסית
      if (!petData.name || !petData.client_id) {
        return { success: false, error: 'שם ובעלים הם שדות חובה' };
      }

      const { data, error } = await supabase
        .from('pets_consultorio')
        .insert([petData])
        .select()
        .single();

      if (error) {
        console.error('שגיאה בהוספת חיית מחמד:', error);
        return { success: false, error: `שגיאה בשמירת חיית המחמד: ${error.message}` };
      }

      console.log('חיית מחמד נוצרה בהצלחה:', data);
      return { success: true, data };
    } catch (error) {
      console.error('שגיאה ביצירת חיית מחמד:', error);
      return { success: false, error: 'שגיאה פנימית במערכת' };
    }
  },

  async update(id, petData) {
    try {
      console.log('מעדכן חיית מחמד:', id, petData);
      
      // ולידציה בסיסית
      if (!petData.name || !petData.client_id) {
        return { success: false, error: 'שם ובעלים הם שדות חובה' };
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
        console.error('שגיאה בעדכון חיית מחמד:', error);
        return { success: false, error: `שגיאה בעדכון חיית המחמד: ${error.message}` };
      }

      console.log('חיית מחמד עודכנה בהצלחה:', data);
      return { success: true, data };
    } catch (error) {
      console.error('שגיאה בעדכון חיית מחמד:', error);
      return { success: false, error: 'שגיאה פנימית במערכת' };
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
      console.error('שגיאה במחיקת חיית מחמד:', error);
      return { success: false, error: 'אירעה שגיאה במחיקה' };
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
      console.error('שגיאה בחיפוש:', error);
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