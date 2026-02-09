import { supabase } from '../config/supabase';

export const LibraryService = {
  async getAll() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('משתמש לא מחובר בזמן טעינת הספרייה');
        return [];
      }

      const { data, error } = await supabase
        .from('library_items_consultorio')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('שגיאה בשליפת פריטי הספרייה:', error);
      return [];
    }
  },

  async getByCategory(category) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('משתמש לא מחובר בעת סינון הספרייה');
        return [];
      }

      const { data, error } = await supabase
        .from('library_items_consultorio')
        .select('*')
        .eq('category', category)
        .eq('user_id', user.id)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('שגיאה בשליפת פריטים לפי קטגוריה:', error);
      return [];
    }
  },

  async getById(id) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('משתמש לא מחובר בעת שליפת פריט ספרייה');
        return null;
      }

      const { data, error } = await supabase
        .from('library_items_consultorio')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('שגיאה בשליפת פריט מהספרייה:', error);
      return null;
    }
  },

  async create(itemData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'המשתמש אינו מחובר' };
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
      console.error('שגיאה ביצירת פריט בספרייה:', error);
      return { success: false, error: 'אירעה שגיאה בשמירת הפריט' };
    }
  },

  async update(id, itemData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'המשתמש אינו מחובר' };
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
      console.error('שגיאה בעדכון פריט בספרייה:', error);
      return { success: false, error: 'אירעה שגיאה בעדכון הפריט' };
    }
  },

  async delete(id) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'המשתמש אינו מחובר' };
      }

      const { error } = await supabase
        .from('library_items_consultorio')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('שגיאה במחיקת פריט מהספרייה:', error);
      return { success: false, error: 'אירעה שגיאה במחיקת הפריט' };
    }
  },

  async search(query) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('משתמש לא מחובר בעת חיפוש בספרייה');
        return [];
      }

      const { data, error } = await supabase
        .from('library_items_consultorio')
        .select('*')
        .eq('user_id', user.id)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('שגיאה בחיפוש הספרייה:', error);
      return [];
    }
  }
};
