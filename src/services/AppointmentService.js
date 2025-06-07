import { supabase } from '../config/supabase';

export const AppointmentService = {
  async getAll() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('appointments_consultorio')
        .select(`
          *,
          client:clients_consultorio(*),
          pet:pets_consultorio(*)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      return [];
    }
  },

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('appointments_consultorio')
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
      console.error('Erro ao buscar agendamento:', error);
      return null;
    }
  },

  async create(appointmentData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { data, error } = await supabase
        .from('appointments_consultorio')
        .insert([
          {
            ...appointmentData,
            user_id: user.id,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      return { success: false, error: 'Erro ao salvar agendamento' };
    }
  },

  async update(id, appointmentData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { data, error } = await supabase
        .from('appointments_consultorio')
        .update({
          ...appointmentData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      return { success: false, error: 'Erro ao atualizar agendamento' };
    }
  },

  async delete(id) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { error } = await supabase
        .from('appointments_consultorio')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar agendamento:', error);
      return { success: false, error: 'Erro ao deletar agendamento' };
    }
  },

  async getTodayAppointments() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      const { data, error } = await supabase
        .from('appointments_consultorio')
        .select(`
          *,
          client:clients_consultorio(*),
          pet:pets_consultorio(*)
        `)
        .eq('user_id', user.id)
        .gte('date', todayStart.toISOString())
        .lt('date', todayEnd.toISOString())
        .order('date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar agendamentos de hoje:', error);
      return [];
    }
  },

  async getUpcomingAppointments(days = 7) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const now = new Date();
      const futureDate = new Date();
      futureDate.setDate(now.getDate() + days);

      const { data, error } = await supabase
        .from('appointments_consultorio')
        .select(`
          *,
          client:clients_consultorio(*),
          pet:pets_consultorio(*)
        `)
        .eq('user_id', user.id)
        .gt('date', now.toISOString())
        .lt('date', futureDate.toISOString())
        .order('date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar próximos agendamentos:', error);
      return [];
    }
  }
};