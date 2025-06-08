import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';
import { AppointmentService } from './AppointmentService';
import { PatientService } from './PatientService';
import { LibraryService } from './LibraryService';

class BackupServiceClass {
  constructor() {
    this.BACKUP_PREFIX = 'VetApp_Backup_';
    this.BACKUP_EXTENSION = '.json';
    this.BACKUP_DIRECTORY = `${FileSystem.documentDirectory}backups/`;
  }

  // Criar diretório de backup se não existir
  async ensureBackupDirectory() {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.BACKUP_DIRECTORY);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.BACKUP_DIRECTORY, { intermediates: true });
      }
    } catch (error) {
      console.error('Erro ao criar diretório:', error);
    }
  }

  // Criar backup completo
  async createBackup() {
    try {
      await this.ensureBackupDirectory();

      // Coletar todos os dados
      const [appointments, patients, library, settings] = await Promise.all([
        AppointmentService.getAll(),
        PatientService.getAll(),
        LibraryService.getAll(),
        this.getAllSettings(),
      ]);

      // Estruturar dados do backup
      const backupData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        platform: 'mobile',
        data: {
          appointments: appointments || [],
          patients: patients || [],
          library: library || [],
          settings: settings || {},
        },
        metadata: {
          appointmentsCount: appointments?.length || 0,
          patientsCount: patients?.length || 0,
          libraryCount: library?.length || 0,
          totalSize: 0,
        },
      };

      // Calcular tamanho aproximado
      const dataString = JSON.stringify(backupData);
      backupData.metadata.totalSize = new Blob([dataString]).size;

      // Gerar nome do arquivo
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `${this.BACKUP_PREFIX}${timestamp}${this.BACKUP_EXTENSION}`;
      const filepath = `${this.BACKUP_DIRECTORY}${filename}`;

      // Salvar arquivo
      await FileSystem.writeAsStringAsync(filepath, dataString);

      // Salvar informações do backup
      await this.saveBackupInfo({
        id: timestamp,
        filename,
        filepath,
        date: new Date().toISOString(),
        size: this.formatFileSize(dataString.length),
        itemsCount: backupData.metadata.appointmentsCount + 
                   backupData.metadata.patientsCount + 
                   backupData.metadata.libraryCount,
        appointments: backupData.metadata.appointmentsCount,
        patients: backupData.metadata.patientsCount,
        library: backupData.metadata.libraryCount,
      });

      return {
        success: true,
        filename,
        size: this.formatFileSize(dataString.length),
        itemsCount: backupData.metadata.appointmentsCount + 
                   backupData.metadata.patientsCount + 
                   backupData.metadata.libraryCount,
      };
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      return { success: false, error: error.message };
    }
  }

  // Restaurar backup
  async restoreBackup(backupId) {
    try {
      const backups = await this.listBackups();
      const backup = backups.find(b => b.id === backupId);
      
      if (!backup) {
        return { success: false, error: 'Backup não encontrado' };
      }

      // Ler arquivo de backup
      const backupContent = await FileSystem.readAsStringAsync(backup.filepath);
      const backupData = JSON.parse(backupContent);

      // Validar estrutura do backup
      if (!backupData.data) {
        return { success: false, error: 'Arquivo de backup inválido' };
      }

      // Limpar dados existentes
      await this.clearAllData();

      // Restaurar dados
      const { appointments, patients, library, settings } = backupData.data;

      // Restaurar cada categoria de dados
      if (patients?.length > 0) {
        for (const patient of patients) {
          await PatientService.create(patient);
        }
      }

      if (appointments?.length > 0) {
        for (const appointment of appointments) {
          await AppointmentService.create(appointment);
        }
      }

      if (library?.length > 0) {
        for (const item of library) {
          await LibraryService.create(item);
        }
      }

      if (settings) {
        await this.restoreSettings(settings);
      }

      return {
        success: true,
        itemsRestored: (appointments?.length || 0) + 
                      (patients?.length || 0) + 
                      (library?.length || 0),
      };
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      return { success: false, error: error.message };
    }
  }

  // Listar backups disponíveis
  async listBackups() {
    try {
      const backupsInfo = await AsyncStorage.getItem('@VetApp:backups_info');
      return backupsInfo ? JSON.parse(backupsInfo) : [];
    } catch (error) {
      console.error('Erro ao listar backups:', error);
      return [];
    }
  }

  // Excluir backup
  async deleteBackup(backupId) {
    try {
      const backups = await this.listBackups();
      const backup = backups.find(b => b.id === backupId);
      
      if (!backup) {
        return { success: false, error: 'Backup não encontrado' };
      }

      // Excluir arquivo
      const fileInfo = await FileSystem.getInfoAsync(backup.filepath);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(backup.filepath);
      }

      // Remover da lista
      const updatedBackups = backups.filter(b => b.id !== backupId);
      await AsyncStorage.setItem('@VetApp:backups_info', JSON.stringify(updatedBackups));

      return { success: true };
    } catch (error) {
      console.error('Erro ao excluir backup:', error);
      return { success: false, error: error.message };
    }
  }

  // Exportar backup para compartilhar
  async exportBackup(backupId) {
    try {
      const backups = await this.listBackups();
      const backup = backups.find(b => b.id === backupId);
      
      if (!backup) {
        return { success: false, error: 'Backup não encontrado' };
      }

      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        return { success: false, error: 'Compartilhamento não disponível' };
      }

      await Sharing.shareAsync(backup.filepath, {
        mimeType: 'application/json',
        dialogTitle: 'Exportar Backup VetApp',
      });

      return { success: true };
    } catch (error) {
      console.error('Erro ao exportar backup:', error);
      return { success: false, error: error.message };
    }
  }

  // Importar backup de arquivo externo
  async importBackup() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.type === 'cancel') {
        return { success: false, error: 'Importação cancelada' };
      }

      // Ler e validar arquivo
      const content = await FileSystem.readAsStringAsync(result.uri);
      const backupData = JSON.parse(content);

      if (!backupData.data || !backupData.version) {
        return { success: false, error: 'Arquivo de backup inválido' };
      }

      // Copiar para diretório de backups
      await this.ensureBackupDirectory();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `${this.BACKUP_PREFIX}imported_${timestamp}${this.BACKUP_EXTENSION}`;
      const filepath = `${this.BACKUP_DIRECTORY}${filename}`;

      await FileSystem.copyAsync({
        from: result.uri,
        to: filepath,
      });

      // Salvar informações do backup
      await this.saveBackupInfo({
        id: `imported_${timestamp}`,
        filename,
        filepath,
        date: new Date().toISOString(),
        size: this.formatFileSize(content.length),
        itemsCount: (backupData.data.appointments?.length || 0) + 
                   (backupData.data.patients?.length || 0) + 
                   (backupData.data.library?.length || 0),
        imported: true,
      });

      return { success: true, filename };
    } catch (error) {
      console.error('Erro ao importar backup:', error);
      return { success: false, error: error.message };
    }
  }

  // Salvar informações do backup
  async saveBackupInfo(backupInfo) {
    try {
      const backups = await this.listBackups();
      backups.push(backupInfo);
      // Manter apenas os 10 backups mais recentes
      const sortedBackups = backups
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);
      
      await AsyncStorage.setItem('@VetApp:backups_info', JSON.stringify(sortedBackups));
    } catch (error) {
      console.error('Erro ao salvar info do backup:', error);
    }
  }

  // Obter todas as configurações
  async getAllSettings() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const settingsKeys = keys.filter(key => key.startsWith('@VetApp:'));
      const settings = {};
      
      for (const key of settingsKeys) {
        const value = await AsyncStorage.getItem(key);
        settings[key] = value;
      }
      
      return settings;
    } catch (error) {
      console.error('Erro ao obter configurações:', error);
      return {};
    }
  }

  // Restaurar configurações
  async restoreSettings(settings) {
    try {
      for (const [key, value] of Object.entries(settings)) {
        if (value !== null) {
          await AsyncStorage.setItem(key, value);
        }
      }
    } catch (error) {
      console.error('Erro ao restaurar configurações:', error);
    }
  }

  // Limpar todos os dados
  async clearAllData() {
    try {
      // Limpar AsyncStorage (mantendo apenas configurações críticas)
      const keys = await AsyncStorage.getAllKeys();
      const keysToRemove = keys.filter(key => 
        !key.includes('auth_token') && 
        !key.includes('user_preferences')
      );
      
      await AsyncStorage.multiRemove(keysToRemove);
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
    }
  }

  // Formatar tamanho do arquivo
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Verificar integridade do backup
  async verifyBackup(backupId) {
    try {
      const backups = await this.listBackups();
      const backup = backups.find(b => b.id === backupId);
      
      if (!backup) {
        return { success: false, error: 'Backup não encontrado' };
      }

      const fileInfo = await FileSystem.getInfoAsync(backup.filepath);
      if (!fileInfo.exists) {
        return { success: false, error: 'Arquivo de backup não existe' };
      }

      const content = await FileSystem.readAsStringAsync(backup.filepath);
      const backupData = JSON.parse(content);

      // Verificar estrutura básica
      const isValid = backupData.version && 
                     backupData.timestamp && 
                     backupData.data &&
                     typeof backupData.data === 'object';

      return { success: isValid, valid: isValid };
    } catch (error) {
      console.error('Erro ao verificar backup:', error);
      return { success: false, error: error.message };
    }
  }
}

export const BackupService = new BackupServiceClass();