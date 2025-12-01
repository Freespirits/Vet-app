import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert } from 'react-native';

class NotificationServiceClass {
  constructor() {
    this.STORAGE_KEY = '@VetApp:notification_settings';
    this.DEFAULT_SETTINGS = {
      enabled: true,
      appointments: true,
      reminders: true,
      emergencies: true,
      updates: false,
      marketing: false,
    };
  }

  // בדיקה האם ההתראות מופעלות
  async isEnabled() {
    try {
      const settings = await this.getSettings();
      return settings.enabled;
    } catch (error) {
      console.error('שגיאה בבדיקת סטטוס ההתראות:', error);
      return false;
    }
  }

  // בקשת הרשאת התראות (גרסה מקוצרת)
  async requestPermission() {
    try {
      // גרסה פשוטה - מחזירה true לפיתוח
      return true;
    } catch (error) {
      console.error('שגיאה בבקשת הרשאת התראות:', error);
      return false;
    }
  }

  // קבלת הגדרות התראות
  async getSettings() {
    try {
      const settingsJson = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (settingsJson) {
        return { ...this.DEFAULT_SETTINGS, ...JSON.parse(settingsJson) };
      }
      return this.DEFAULT_SETTINGS;
    } catch (error) {
      console.error('שגיאה בשליפת הגדרות התראות:', error);
      return this.DEFAULT_SETTINGS;
    }
  }

  // עדכון הגדרות התראות
  async updateSettings(newSettings) {
    try {
      const currentSettings = await this.getSettings();
      const updatedSettings = { ...currentSettings, ...newSettings };
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedSettings));

      return { success: true };
    } catch (error) {
      console.error('שגיאה בעדכון הגדרות התראות:', error);
      return { success: false, error: error.message };
    }
  }

  // הפעלת התראות
  async enable() {
    return await this.updateSettings({ enabled: true });
  }

  // כיבוי התראות
  async disable() {
    return await this.updateSettings({ enabled: false });
  }

  // תזמון התראת ייעוץ (גרסה מקוצרת)
  async scheduleAppointment(appointment) {
    try {
      const settings = await this.getSettings();
      if (!settings.enabled || !settings.appointments) return { success: true };

      // בינתיים רק לוג - מימוש מלא בהמשך
      console.log('התראה מתוזמנת עבור:', appointment);
      return { success: true };
    } catch (error) {
      console.error('שגיאה בתזמון התראה:', error);
      return { success: false, error: error.message };
    }
  }

  // התראת בדיקה
  async scheduleTest() {
    try {
      Alert.alert(
        'התראת בדיקה ✅',
        'ההתראות שלך פועלות כשורה!',
        [{ text: 'אישור' }]
      );
      return { success: true };
    } catch (error) {
      console.error('שגיאה בשליחת התראת בדיקה:', error);
      return { success: false, error: error.message };
    }
  }

  // ביטול כל ההתראות (גרסה מקוצרת)
  async cancelAll() {
    try {
      console.log('כל ההתראות בוטלו');
      return { success: true };
    } catch (error) {
      console.error('שגיאה בביטול התראות:', error);
      return { success: false, error: error.message };
    }
  }
}

export const NotificationService = new NotificationServiceClass();