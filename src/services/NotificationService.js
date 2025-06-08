import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Configurar comportamento das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

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

  // Verificar se as notificações estão habilitadas
  async isEnabled() {
    try {
      const settings = await this.getSettings();
      return settings.enabled;
    } catch (error) {
      console.error('Erro ao verificar notificações:', error);
      return false;
    }
  }

  // Solicitar permissão para notificações
  async requestPermission() {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === 'granted';
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      return false;
    }
  }

  // Obter configurações de notificação
  async getSettings() {
    try {
      const settingsJson = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (settingsJson) {
        return { ...this.DEFAULT_SETTINGS, ...JSON.parse(settingsJson) };
      }
      return this.DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Erro ao obter configurações:', error);
      return this.DEFAULT_SETTINGS;
    }
  }

  // Atualizar configurações de notificação
  async updateSettings(newSettings) {
    try {
      const currentSettings = await this.getSettings();
      const updatedSettings = { ...currentSettings, ...newSettings };
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedSettings));
      
      // Se as notificações foram desabilitadas, cancelar todas
      if (!updatedSettings.enabled) {
        await this.cancelAll();
      }
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      return { success: false, error: error.message };
    }
  }

  // Habilitar notificações
  async enable() {
    return await this.updateSettings({ enabled: true });
  }

  // Desabilitar notificações
  async disable() {
    return await this.updateSettings({ enabled: false });
  }

  // Agendar notificação de consulta
  async scheduleAppointment(appointment) {
    try {
      const settings = await this.getSettings();
      if (!settings.enabled || !settings.appointments) return;

      const appointmentDate = new Date(appointment.dateTime);
      const now = new Date();

      // Notificação 1 dia antes
      const oneDayBefore = new Date(appointmentDate);
      oneDayBefore.setDate(oneDayBefore.getDate() - 1);
      oneDayBefore.setHours(9, 0, 0, 0); // 9h da manhã

      if (oneDayBefore > now) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Consulta Amanhã 📅',
            body: `${appointment.patient?.name} tem consulta às ${appointmentDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
            data: { 
              type: 'appointment_reminder',
              appointmentId: appointment.id,
              timing: 'day_before'
            },
            sound: 'default',
          },
          trigger: oneDayBefore,
        });
      }

      // Notificação 2 horas antes
      const twoHoursBefore = new Date(appointmentDate);
      twoHoursBefore.setHours(twoHoursBefore.getHours() - 2);

      if (twoHoursBefore > now) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Consulta em 2 horas ⏰',
            body: `${appointment.patient?.name} - ${appointment.type || 'Consulta'}`,
            data: { 
              type: 'appointment_reminder',
              appointmentId: appointment.id,
              timing: 'two_hours'
            },
            sound: 'default',
          },
          trigger: twoHoursBefore,
        });
      }

      // Notificação na hora
      if (appointmentDate > now) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Consulta Agora! 🩺',
            body: `${appointment.patient?.name} - Consulta marcada para agora`,
            data: { 
              type: 'appointment_now',
              appointmentId: appointment.id,
              timing: 'now'
            },
            sound: 'default',
          },
          trigger: appointmentDate,
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
      return { success: false, error: error.message };
    }
  }

  // Agendar lembrete de medicação
  async scheduleMedicationReminder(medication, schedule) {
    try {
      const settings = await this.getSettings();
      if (!settings.enabled || !settings.reminders) return;

      // Agendar para cada horário do cronograma
      for (const time of schedule.times) {
        const reminderDate = new Date();
        const [hours, minutes] = time.split(':');
        reminderDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        // Se o horário já passou hoje, agendar para amanhã
        if (reminderDate <= new Date()) {
          reminderDate.setDate(reminderDate.getDate() + 1);
        }

        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Medicação 💊',
            body: `Hora de administrar ${medication.name} - ${medication.dosage}`,
            data: { 
              type: 'medication_reminder',
              medicationId: medication.id,
              scheduleId: schedule.id
            },
            sound: 'default',
          },
          trigger: {
            repeats: true,
            dateComponents: {
              hour: parseInt(hours),
              minute: parseInt(minutes),
            },
          },
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao agendar lembrete:', error);
      return { success: false, error: error.message };
    }
  }

  // Notificação de emergência
  async sendEmergencyNotification(message) {
    try {
      const settings = await this.getSettings();
      if (!settings.enabled || !settings.emergencies) return;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Emergência! 🚨',
          body: message,
          data: { type: 'emergency' },
          sound: 'default',
          priority: 'high',
        },
        trigger: null, // Imediata
      });

      return { success: true };
    } catch (error) {
      console.error('Erro ao enviar notificação de emergência:', error);
      return { success: false, error: error.message };
    }
  }

  // Notificação de teste
  async scheduleTest() {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Teste de Notificação ✅',
          body: 'Suas notificações estão funcionando perfeitamente!',
          data: { type: 'test' },
          sound: 'default',
        },
        trigger: { seconds: 2 },
      });

      return { success: true };
    } catch (error) {
      console.error('Erro ao enviar notificação de teste:', error);
      return { success: false, error: error.message };
    }
  }

  // Cancelar notificação específica
  async cancelNotification(notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      return { success: true };
    } catch (error) {
      console.error('Erro ao cancelar notificação:', error);
      return { success: false, error: error.message };
    }
  }

  // Cancelar todas as notificações
  async cancelAll() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      return { success: true };
    } catch (error) {
      console.error('Erro ao cancelar notificações:', error);
      return { success: false, error: error.message };
    }
  }

  // Cancelar notificações de uma consulta específica
  async cancelAppointmentNotifications(appointmentId) {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      
      for (const notification of scheduledNotifications) {
        if (notification.content.data?.appointmentId === appointmentId) {
          await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao cancelar notificações da consulta:', error);
      return { success: false, error: error.message };
    }
  }

  // Obter token de push notification (para backend)
  async getPushToken() {
    try {
      const token = await Notifications.getExpoPushTokenAsync();
      return { success: true, token: token.data };
    } catch (error) {
      console.error('Erro ao obter push token:', error);
      return { success: false, error: error.message };
    }
  }

  // Configurar canal de notificação (Android)
  async setupNotificationChannel() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'VetApp Notifications',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'default',
      });

      await Notifications.setNotificationChannelAsync('emergency', {
        name: 'Emergency Notifications',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 500, 250, 500],
        lightColor: '#FF0000',
        sound: 'default',
      });
    }
  }
}

export const NotificationService = new NotificationServiceClass();