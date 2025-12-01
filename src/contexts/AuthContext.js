import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false); // דגל המבדיל רישום

  useEffect(() => {
    // בדיקת סשן ראשוני
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('מצב התחברות ראשוני:', session);
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // האזנה לשינויים בזיהוי משתמש
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      setSession(session);

      if (event === 'SIGNED_IN' && session?.user) {
        // לא ליצור פרופיל אוטומטית אם אנחנו באמצע רישום
        if (!isRegistering) {
          await loadUserProfile(session.user);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
        setIsRegistering(false); // Reset flag
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [isRegistering]);

  const loadUserProfile = async (authUser, skipAutoCreate = false) => {
    try {
      console.log('טוען פרופיל עבור משתמש:', authUser.id, authUser.email);

      // תחילה ננסה לפי מזהה
      let { data, error } = await supabase
        .from('users_consultorio')
        .select('*')
        .eq('id', authUser.id)
        .single();

      // אם לא נמצא לפי מזהה, ננסה לפי אימייל
      if (error && error.code === 'PGRST116') {
        console.log('הפרופיל לא נמצא לפי מזהה, מנסה לפי האימייל...');

        const { data: profileByEmail, error: emailError } = await supabase
          .from('users_consultorio')
          .select('*')
          .eq('email', authUser.email)
          .single();

        if (emailError && emailError.code === 'PGRST116') {
          // הפרופיל לא קיים
          if (skipAutoCreate) {
            console.log('הפרופיל לא קיים והיצירה האוטומטית דולגה');
            setLoading(false);
            return;
          } else {
            // יצירה אוטומטית רק עבור התחברות (לא עבור רישום)
            console.log('הפרופיל לא קיים, יוצר באופן אוטומטי...');
            await createUserProfile(authUser);
            return;
          }
        } else if (emailError) {
          console.error('שגיאה בעת חיפוש פרופיל לפי אימייל:', emailError);
          setLoading(false);
          return;
        } else {
          // נמצא פרופיל לפי אימייל, מעדכן מזהה
          console.log('הפרופיל נמצא לפי אימייל, מעדכן מזהה...');
          const { data: updatedProfile, error: updateError } = await supabase
            .from('users_consultorio')
            .update({ id: authUser.id, updated_at: new Date().toISOString() })
            .eq('email', authUser.email)
            .select()
            .single();

          if (updateError) {
            console.error('שגיאה בעדכון מזהה הפרופיל:', updateError);
            setUser(profileByEmail); // שימוש בפרופיל גם ללא עדכון מזהה
          } else {
            setUser(updatedProfile);
          }
        }
      } else if (error) {
        console.error('שגיאה בטעינת פרופיל:', error);
        setLoading(false);
        return;
      } else {
        // פרופיל נמצא לפי מזהה
        console.log('הפרופיל נטען בהצלחה:', data);
        setUser(data);
      }
    } catch (error) {
      console.error('שגיאה בטעינת משתמש:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUserProfile = async (authUser) => {
    try {
      console.log('יוצר פרופיל אוטומטי עבור:', authUser.email);

      // נתוני ברירת מחדל למשתמש הדגמה
      const isDemo = authUser.email === 'admin@petcare.com';

      const profileData = {
        id: authUser.id,
        email: authUser.email,
        name: isDemo ? 'ד"ר ז׳ואאו סילבה' : authUser.user_metadata?.name || 'משתמש חדש',
        profession: 'וטרינר/ית',
        clinic: isDemo ? 'VetCare מרפאת' : 'המרפאה שלי',
        crmv: isDemo ? '12345-SP' : '',
        phone: isDemo ? '(11) 99999-9999' : '',
      };

      const { data, error } = await supabase
        .from('users_consultorio')
        .insert([profileData])
        .select()
        .single();

      if (error) {
        console.error('שגיאה ביצירת פרופיל אוטומטי:', error);
        setLoading(false);
        return;
      }

      console.log('פרופיל נוצר אוטומטית:', data);
      setUser(data);
    } catch (error) {
      console.error('שגיאה ביצירת פרופיל אוטומטי:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('מבצע התחברות...');

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password,
      });

      if (error) {
        console.error('שגיאה בהתחברות:', error);
        return { success: false, error: error.message };
      }

      console.log('התחברות בוצעה בהצלחה');
      return { success: true, data };
    } catch (error) {
      console.error('שגיאה בהתחברות:', error);
      return { success: false, error: 'שגיאה פנימית במערכת' };
    }
  };

  const register = async (userData) => {
    try {
      console.log('מתחיל רישום...');

      setIsRegistering(true); // סימון תהליך רישום פעיל

      const email = userData.email.toLowerCase().trim();

      // תחילה, יצירת משתמש בשכבת האימות
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
        console.error('שגיאה באימות:', authError);
        setIsRegistering(false);
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        setIsRegistering(false);
        return { success: false, error: 'יצירת המשתמש נכשלה' };
      }

      // אם נדרשת אימות אימייל לא תהיה סשן פעיל ולכן לא נכתוב בטבלה המוגנת.
      if (!authData.session) {
        setIsRegistering(false);
        return {
          success: true,
          requiresEmailConfirmation: true,
          message: 'החשבון נוצר. יש לאשר את האימייל לפני הכניסה.'
        };
      }

      console.log('משתמש נוצר בשכבת האימות, מזהה:', authData.user.id);

      // ממתין מעט כדי לוודא שאירוע SIGNED_IN טופל
      await new Promise(resolve => setTimeout(resolve, 500));

      // בדיקה אם הפרופיל כבר קיים (יצירה אוטומטית)
      const { data: existingProfile } = await supabase
        .from('users_consultorio')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (existingProfile) {
        console.log('הפרופיל כבר קיים, מעדכן לפי נתוני הטופס...');

        // מעדכן פרופיל קיים עם נתוני הטופס
        const { data: updatedProfile, error: updateError } = await supabase
          .from('users_consultorio')
          .update({
            name: userData.name.trim(),
            profession: userData.profession || 'וטרינר/ית',
            clinic: userData.clinic.trim(),
            crmv: userData.crmv.trim(),
            phone: userData.phone.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', authData.user.id)
          .select()
          .single();

        if (updateError) {
          console.error('שגיאה בעדכון פרופיל:', updateError);
          setIsRegistering(false);
          return {
            success: false,
            error: `שגיאה בעדכון פרופיל: ${updateError.message}`
          };
        }

        console.log('הפרופיל עודכן בהצלחה');
        setUser(updatedProfile);
        setIsRegistering(false);
        return { success: true, data: authData };
      } else {
        // יצירת פרופיל חדש עם נתוני הטופס
        const profileData = {
          id: authData.user.id,
          email: email,
          name: userData.name.trim(),
          profession: userData.profession || 'וטרינר/ית',
          clinic: userData.clinic.trim(),
          crmv: userData.crmv.trim(),
          phone: userData.phone.trim(),
        };

        console.log('יוצר פרופיל עם הנתונים:', profileData);

        const { data: profileResult, error: profileError } = await supabase
          .from('users_consultorio')
          .insert([profileData])
          .select()
          .single();

        if (profileError) {
          console.error('שגיאה ביצירת פרופיל:', profileError);

          // מנסה להתנתק אם יצירת הפרופיל נכשלה
          try {
            await supabase.auth.signOut();
          } catch (e) {
            console.error('שגיאה בעת ניקוי אחרי כישלון:', e);
          }

          setIsRegistering(false);
          return {
            success: false,
            error: `שגיאה ביצירת פרופיל: ${profileError.message}`
          };
        }

        console.log('פרופיל נוצר בהצלחה');
        setUser(profileResult);
        setIsRegistering(false);
        return { success: true, data: authData };
      }

    } catch (error) {
      console.error('שגיאה כללית בתהליך ההרשמה:', error);
      setIsRegistering(false);
      return { success: false, error: 'שגיאה פנימית במערכת' };
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      if (!user?.id) {
        return { success: false, error: 'משתמש לא נמצא' };
      }

      const { data, error } = await supabase
        .from('users_consultorio')
        .update({
          ...updatedData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      setUser(data);
      return { success: true };
    } catch (error) {
      console.error('שגיאה בעדכון פרופיל:', error);
      return { success: false, error: 'שגיאה בעדכון הפרופיל' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsRegistering(false);
    } catch (error) {
      console.error('שגיאה בהתנתקות:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        login,
        register,
        updateProfile,
        logout,
        isAuthenticated: !!user && !!session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('יש להשתמש ב-useAuth בתוך AuthProvider');
  }
  return context;
};
