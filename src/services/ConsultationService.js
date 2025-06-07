import { supabase } from '../config/supabase';

export const ConsultationService = {
  async getAll() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('consultations_consultorio')
        .select(`
          *,
          client:clients_consultorio(*),
          pet:pets_consultorio(*)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar consultas:', error);
      return [];
    }
  },

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('consultations_consultorio')
        .select(`
          *,
          client:clients_consultorio(*),
          pet:pets_consultorio(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar consulta:', error);
      return null;
    }
  },

  async getByPetId(petId) {
    try {
      const { data, error } = await supabase
        .from('consultations_consultorio')
        .select(`
          *,
          client:clients_consultorio(*),
          pet:pets_consultorio(*)
        `)
        .eq('pet_id', petId)
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar consultas do pet:', error);
      return [];
    }
  },

  async getByClientId(clientId) {
    try {
      const { data, error } = await supabase
        .from('consultations_consultorio')
        .select(`
          *,
          client:clients_consultorio(*),
          pet:pets_consultorio(*)
        `)
        .eq('client_id', clientId)
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar consultas do cliente:', error);
      return [];
    }
  },

  async create(consultationData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { data, error } = await supabase
        .from('consultations_consultorio')
        .insert([
          {
            ...consultationData,
            user_id: user.id,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao criar consulta:', error);
      return { success: false, error: 'Erro ao salvar consulta' };
    }
  },

  async update(id, consultationData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { data, error } = await supabase
        .from('consultations_consultorio')
        .update({
          ...consultationData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao atualizar consulta:', error);
      return { success: false, error: 'Erro ao atualizar consulta' };
    }
  },

  async delete(id) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { error } = await supabase
        .from('consultations_consultorio')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar consulta:', error);
      return { success: false, error: 'Erro ao deletar consulta' };
    }
  },

  async getStats() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { total: 0, today: 0, thisMonth: 0, byType: {} };

      const { data, error } = await supabase
        .from('consultations_consultorio')
        .select('date, type')
        .eq('user_id', user.id);

      if (error) throw error;

      const currentDate = new Date();
      const today = currentDate.toDateString();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const todayConsultations = data.filter(consultation => 
        new Date(consultation.date).toDateString() === today
      );

      const thisMonth = data.filter(consultation => {
        const consultationDate = new Date(consultation.date);
        return consultationDate.getMonth() === currentMonth && 
               consultationDate.getFullYear() === currentYear;
      });

      const byType = data.reduce((acc, consultation) => {
        acc[consultation.type] = (acc[consultation.type] || 0) + 1;
        return acc;
      }, {});

      return {
        total: data.length,
        today: todayConsultations.length,
        thisMonth: thisMonth.length,
        byType,
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return { total: 0, today: 0, thisMonth: 0, byType: {} };
    }
  }
};