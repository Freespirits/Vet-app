import { supabase } from '../config/supabase';

export const ClientService = {
  async getAll() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('משתמש לא מחובר');
        return [];
      }

      console.log('טוען לקוחות עבור המשתמש:', user.id);

      const { data, error } = await supabase
        .from('clients_consultorio')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('שגיאה בשליפת לקוחות:', error);
        throw error;
      }

      console.log(`${data?.length || 0} לקוחות נמצאו`);
      return data || [];
    } catch (error) {
      console.error('שגיאה בשליפת לקוחות:', error);
      return [];
    }
  },

  async getById(id) {
    try {
      if (!id) {
        console.error('מזהה לקוח לא סופק');
        return null;
      }

      const { data, error } = await supabase
        .from('clients_consultorio')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('שגיאה בשליפת לקוח לפי מזהה:', error);
        throw error;
      }

      return data || null;
    } catch (error) {
      console.error('שגיאה בשליפת לקוח:', error);
      return null;
    }
  },

  async create(clientData) {
    try {
      console.log('מתחיל יצירת לקוח...');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('משתמש לא מחובר ליצירת לקוח');
        return { success: false, error: 'המשתמש אינו מחובר' };
      }

      console.log('משתמש מאומת:', user.id);
      console.log('נתוני הלקוח:', clientData);

      if (!clientData.name || !clientData.email || !clientData.phone) {
        return { success: false, error: 'שם, אימייל וטלפון הם שדות חובה' };
      }

      const { data: existingClient } = await supabase
        .from('clients_consultorio')
        .select('id')
        .eq('email', clientData.email.toLowerCase().trim())
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingClient) {
        console.log('האימייל כבר קיים:', clientData.email);
        return { success: false, error: 'האימייל כבר שמור למשתמש זה' };
      }

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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log('נתונים מוכנים להוספה:', insertData);

      const { data, error } = await supabase
        .from('clients_consultorio')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('שגיאה בהוספת לקוח:', error);

        if (error.code === '23505') {
          return { success: false, error: 'האימייל הזה כבר קיים' };
        }

        return {
          success: false,
          error: `שגיאה בשמירת הלקוח: ${error.message}`
        };
      }

      console.log('לקוח נוצר בהצלחה:', data);
      return { success: true, data };
    } catch (error) {
      console.error('שגיאה ביצירת לקוח:', error);
      return {
        success: false,
        error: 'שגיאה פנימית במערכת. נסה שוב.'
      };
    }
  },

  async update(id, clientData) {
    try {
      console.log('מתחיל עדכון לקוח:', id);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('משתמש לא מחובר לעדכון לקוח');
        return { success: false, error: 'המשתמש אינו מחובר' };
      }

      if (!clientData.name || !clientData.email || !clientData.phone) {
        return { success: false, error: 'שם, אימייל וטלפון הם שדות חובה' };
      }

      const { data: existingClient } = await supabase
        .from('clients_consultorio')
        .select('id')
        .eq('email', clientData.email.toLowerCase().trim())
        .eq('user_id', user.id)
        .neq('id', id)
        .maybeSingle();

      if (existingClient) {
        console.log('אימייל כבר קיים עבור לקוח אחר:', clientData.email);
        return { success: false, error: 'האימייל כבר משויך ללקוח אחר' };
      }

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

      console.log('נתונים מוכנים לעדכון:', updateData);

      const { data, error } = await supabase
        .from('clients_consultorio')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('שגיאה בעדכון לקוח:', error);

        if (error.code === '23505') {
          return { success: false, error: 'האימייל הזה כבר קיים' };
        }

        return {
          success: false,
          error: `שגיאה בעדכון הלקוח: ${error.message}`
        };
      }

      if (!data) {
        return { success: false, error: 'הלקוח לא נמצא או שאין הרשאה לעריכה' };
      }

      console.log('לקוח עודכן בהצלחה:', data);
      return { success: true, data };
    } catch (error) {
      console.error('שגיאה בעדכון לקוח:', error);
      return {
        success: false,
        error: 'שגיאה פנימית במערכת. נסה שוב.'
      };
    }
  },

  async delete(id) {
    try {
      console.log('מתחיל מחיקת לקוח:', id);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('משתמש לא מחובר למחיקת לקוח');
        return { success: false, error: 'המשתמש אינו מחובר' };
      }

      const { data: pets } = await supabase
        .from('pets_consultorio')
        .select('id')
        .eq('client_id', id);

      if (pets && pets.length > 0) {
        return {
          success: false,
          error: 'לא ניתן למחוק לקוח עם חיות מחמד רשומות. יש למחוק את החיות תחילה.'
        };
      }

      const { error } = await supabase
        .from('clients_consultorio')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('שגיאה במחיקת לקוח:', error);
        return {
          success: false,
          error: `שגיאה במחיקת הלקוח: ${error.message}`
        };
      }

      console.log('לקוח נמחק בהצלחה');
      return { success: true };
    } catch (error) {
      console.error('שגיאה במחיקת לקוח:', error);
      return {
        success: false,
        error: 'שגיאה פנימית במחיקת הלקוח'
      };
    }
  },

  async search(query) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('משתמש לא מחובר לחיפוש לקוחות');
        return [];
      }

      const { data, error } = await supabase
        .from('clients_consultorio')
        .select('*')
        .eq('user_id', user.id)
        .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%,cpf.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('שגיאה בחיפוש לקוחות:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('שגיאה בחיפוש:', error);
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
        console.error('שגיאה בשליפת נתוני לקוחות:', error);
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
        active: data.length,
      };
    } catch (error) {
      console.error('שגיאה בשליפת סטטיסטיקות:', error);
      return { total: 0, thisMonth: 0, active: 0 };
    }
  }
};