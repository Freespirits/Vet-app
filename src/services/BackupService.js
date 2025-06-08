import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

class BackupServiceClass {
  constructor() {
    this.BACKUP_PREFIX = 'VetApp_Backup_';
    this.BACKUP_EXTENSION = '.json';
    this.STORAGE_KEY = '@VetApp:backups_info';
  }

  // Criar backup completo
  async createBackup() {
    try {
      const timestamp = new Date().toISOString();
      
      // Coletar todos os dados do AsyncStorage
      const allData = await this.getAllStorageData();
      
      // Estruturar dados do backup
      const backupData = {
        version: '1.0.0',
        timestamp,
        platform: 'mobile',
        data: allData,
        metadata: {
          totalItems: Object.keys(allData).length,
          totalSize: JSON.stringify(allData).length,
        },
      };

      // Gerar informações do backup
      const backupInfo = {
        id: timestamp.replace(/[:.]/g, '-').slice(0, 19),
        filename: `${this.BACKUP_PREFIX}${timestamp.replace(/[:.]/g, '-').slice(0, 19)}${this.BACKUP_EXTENSION}`,
        date: timestamp,
        size: this.formatFileSize(JSON.stringify(backupData).length),
        itemsCount: backupData.metadata.totalItems,
        data: JSON.stringify(backupData), // Armazenar os dados do backup
      };

      // Salvar informações do backup
      await this.saveBackupInfo(backupInfo);

      return {
        success: true,
        filename: backupInfo.filename,
        size: backupInfo.size,
        itemsCount: backupInfo.itemsCount,
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

      // Parse dos dados do backup
      const backupData = JSON.parse(backup.data);
      
      if (!backupData.data) {
        return { success: false, error: 'Arquivo de backup inválido' };
      }

      // Limpar dados existentes (exceto backups)
      await this.clearAllData();

      // Restaurar dados
      let restoredCount = 0;
      for (const [key, value] of Object.entries(backupData.data)) {
        if (!key.includes('backups_info')) { // Não restaurar informações de backup
          await AsyncStorage.setItem(key, value);
          restoredCount++;
        }
      }

      return {
        success: true,
        itemsRestored: restoredCount,
      };
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      return { success: false, error: error.message };
    }
  }

  // Listar backups disponíveis
  async listBackups() {
    try {
      const backupsInfo = await AsyncStorage.getItem(this.STORAGE_KEY);
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
      const updatedBackups = backups.filter(b => b.id !== backupId);
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedBackups));
      return { success: true };
    } catch (error) {
      console.error('Erro ao excluir backup:', error);
      return { success: false, error: error.message };
    }
  }

  // Exportar backup (versão simplificada - mostra dados)
  async exportBackup(backupId) {
    try {
      const backups = await this.listBackups();
      const backup = backups.find(b => b.id === backupId);
      
      if (!backup) {
        return { success: false, error: 'Backup não encontrado' };
      }

      // Por enquanto, apenas mostra os dados em um alert
      Alert.alert(
        'Dados do Backup',
        `Backup: ${backup.filename}\nTamanho: ${backup.size}\nData: ${new Date(backup.date).toLocaleDateString('pt-BR')}`,
        [
          { text: 'OK' },
          { 
            text: 'Copiar Dados', 
            onPress: () => {
              // Em uma implementação futura, poderia copiar para clipboard
              console.log('Dados do backup:', backup.data);
            }
          }
        ]
      );

      return { success: true };
    } catch (error) {
      console.error('Erro ao exportar backup:', error);
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
      
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(sortedBackups));
    } catch (error) {
      console.error('Erro ao salvar info do backup:', error);
    }
  }

  // Obter todos os dados do AsyncStorage
  async getAllStorageData() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const stores = await AsyncStorage.multiGet(keys);
      const data = {};
      
      stores.forEach(([key, value]) => {
        if (key !== this.STORAGE_KEY) { // Não incluir informações de backup no backup
          data[key] = value;
        }
      });
      
      return data;
    } catch (error) {
      console.error('Erro ao obter dados do storage:', error);
      return {};
    }
  }

  // Limpar todos os dados (exceto backups)
  async clearAllData() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const keysToRemove = keys.filter(key => 
        key !== this.STORAGE_KEY && // Manter informações de backup
        !key.includes('auth_token') && // Manter token de auth
        !key.includes('user_session') // Manter sessão
      );
      
      if (keysToRemove.length > 0) {
        await AsyncStorage.multiRemove(keysToRemove);
      }
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

      if (!backup.data) {
        return { success: false, error: 'Dados do backup não encontrados' };
      }

      const backupData = JSON.parse(backup.data);

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

  // Obter estatísticas dos backups
  async getBackupStats() {
    try {
      const backups = await this.listBackups();
      
      if (backups.length === 0) {
        return {
          total: 0,
          totalSize: '0 Bytes',
          lastBackup: null,
          oldestBackup: null,
        };
      }

      const sortedByDate = backups.sort((a, b) => new Date(b.date) - new Date(a.date));
      const totalSizeBytes = backups.reduce((sum, backup) => {
        return sum + (backup.data ? backup.data.length : 0);
      }, 0);

      return {
        total: backups.length,
        totalSize: this.formatFileSize(totalSizeBytes),
        lastBackup: sortedByDate[0],
        oldestBackup: sortedByDate[sortedByDate.length - 1],
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return {
        total: 0,
        totalSize: '0 Bytes',
        lastBackup: null,
        oldestBackup: null,
      };
    }
  }

  // Backup automático (para uso futuro)
  async scheduleAutoBackup() {
    try {
      // Implementação futura - por enquanto apenas log
      console.log('Backup automático agendado');
      return { success: true };
    } catch (error) {
      console.error('Erro ao agendar backup automático:', error);
      return { success: false, error: error.message };
    }
  }
}

export const BackupService = new BackupServiceClass();