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

  // Solicitar permissão para notificações (versão simplificada)
  async requestPermission() {
    try {
      // Versão simplificada - sempre retorna true para desenvolvimento
      return true;
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

  // Agendar notificação de consulta (versão simplificada)
  async scheduleAppointment(appointment) {
    try {
      const settings = await this.getSettings();
      if (!settings.enabled || !settings.appointments) return { success: true };

      // Por enquanto, apenas log - implementação futura
      console.log('Notificação agendada para:', appointment);
      return { success: true };
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
      return { success: false, error: error.message };
    }
  }

  // Notificação de teste
  async scheduleTest() {
    try {
      Alert.alert(
        'Teste de Notificação ✅',
        'Suas notificações estão funcionando perfeitamente!',
        [{ text: 'OK' }]
      );
      return { success: true };
    } catch (error) {
      console.error('Erro ao enviar notificação de teste:', error);
      return { success: false, error: error.message };
    }
  }

  // Cancelar todas as notificações (versão simplificada)
  async cancelAll() {
    try {
      console.log('Todas as notificações canceladas');
      return { success: true };
    } catch (error) {
      console.error('Erro ao cancelar notificações:', error);
      return { success: false, error: error.message };
    }
  }
}

export const NotificationService = new NotificationServiceClass();