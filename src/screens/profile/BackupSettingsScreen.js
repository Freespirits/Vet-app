import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Colors } from '../../constants/Colors';
import { BackupService } from '../../services/BackupService';

const BackupSettingsScreen = ({ navigation }) => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = async () => {
    try {
      setLoading(true);
      const backupList = await BackupService.listBackups();
      setBackups(backupList);
    } catch (error) {
      console.error('Erro ao carregar backups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    Alert.alert(
      'Criar Backup',
      'Deseja criar um backup completo dos seus dados? Isso pode levar alguns minutos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Criar',
          onPress: async () => {
            try {
              setCreating(true);
              const result = await BackupService.createBackup();
              
              if (result.success) {
                Alert.alert(
                  'Backup Criado',
                  `Backup criado com sucesso!\n\nArquivo: ${result.filename}\nTamanho: ${result.size}\nItens: ${result.itemsCount}`
                );
                await loadBackups();
              } else {
                Alert.alert('Erro', result.error || 'Erro ao criar backup');
              }
            } catch (error) {
              console.error('Erro ao criar backup:', error);
              Alert.alert('Erro', 'Erro interno ao criar backup');
            } finally {
              setCreating(false);
            }
          }
        }
      ]
    );
  };

  const handleRestoreBackup = (backup) => {
    Alert.alert(
      'Restaurar Backup',
      `Deseja restaurar o backup de ${format(new Date(backup.date), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}?\n\nISTO SUBSTITUIRÁ TODOS OS DADOS ATUAIS!`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restaurar',
          style: 'destructive',
          onPress: async () => {
            try {
              setRestoring(true);
              const result = await BackupService.restoreBackup(backup.id);
              
              if (result.success) {
                Alert.alert(
                  'Backup Restaurado',
                  'Dados restaurados com sucesso! O aplicativo será reiniciado.',
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        navigation.reset({
                          index: 0,
                          routes: [{ name: 'Home' }],
                        });
                      }
                    }
                  ]
                );
              } else {
                Alert.alert('Erro', result.error || 'Erro ao restaurar backup');
              }
            } catch (error) {
              console.error('Erro ao restaurar backup:', error);
              Alert.alert('Erro', 'Erro interno ao restaurar backup');
            } finally {
              setRestoring(false);
            }
          }
        }
      ]
    );
  };

  const handleDeleteBackup = (backup) => {
    Alert.alert(
      'Excluir Backup',
      `Deseja excluir o backup de ${format(new Date(backup.date), "dd 'de' MMMM", { locale: ptBR })}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await BackupService.deleteBackup(backup.id);
              
              if (result.success) {
                await loadBackups();
              } else {
                Alert.alert('Erro', result.error || 'Erro ao excluir backup');
              }
            } catch (error) {
              console.error('Erro ao excluir backup:', error);
              Alert.alert('Erro', 'Erro interno ao excluir backup');
            }
          }
        }
      ]
    );
  };

  const renderBackupItem = (backup) => (
    <View key={backup.id} style={styles.backupItem}>
      <View style={styles.backupInfo}>
        <View style={styles.backupHeader}>
          <Text style={styles.backupDate}>
            {format(new Date(backup.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </Text>
          <Text style={styles.backupTime}>
            {format(new Date(backup.date), 'HH:mm', { locale: ptBR })}
          </Text>
        </View>
        <Text style={styles.backupDetails}>
          {backup.size} • {backup.itemsCount} itens
        </Text>
      </View>
      <View style={styles.backupActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleRestoreBackup(backup)}
          disabled={restoring}
        >
          <Ionicons name="download-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteBackup(backup)}
        >
          <Ionicons name="trash-outline" size={20} color={Colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Backup e Restauração</Text>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Create Backup Section */}
        <View style={styles.createSection}>
          <Text style={styles.sectionTitle}>Criar Backup</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateBackup}
            disabled={creating}
          >
            <LinearGradient
              colors={[Colors.success, `${Colors.success}CC`]}
              style={styles.createButtonGradient}
            >
              {creating ? (
                <ActivityIndicator size="small" color={Colors.surface} />
              ) : (
                <Ionicons name="cloud-upload-outline" size={24} color={Colors.surface} />
              )}
              <Text style={styles.createButtonText}>
                {creating ? 'Criando Backup...' : 'Criar Novo Backup'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={20} color={Colors.info} />
            <Text style={styles.infoText}>
              O backup inclui todas as consultas, pacientes, configurações e dados do aplicativo.
            </Text>
          </View>
        </View>

        {/* Backups List */}
        <View style={styles.backupsSection}>
          <Text style={styles.sectionTitle}>Backups Disponíveis</Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Carregando backups...</Text>
            </View>
          ) : backups.length > 0 ? (
            <View style={styles.backupsList}>
              {backups.map(renderBackupItem)}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="cloud-outline" size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyTitle}>Nenhum backup encontrado</Text>
              <Text style={styles.emptySubtitle}>
                Crie seu primeiro backup para proteger seus dados
              </Text>
            </View>
          )}
        </View>

        {/* Warning */}
        <View style={styles.warningSection}>
          <View style={styles.warningCard}>
            <Ionicons name="warning" size={24} color={Colors.warning} />
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>Importante</Text>
              <Text style={styles.warningText}>
                • Restaurar um backup substitui todos os dados atuais{'\n'}
                • Mantenha backups regulares para proteger seus dados{'\n'}
                • Backups são armazenados localmente no dispositivo
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Loading Overlay */}
      {restoring && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingModal}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingModalText}>Restaurando backup...</Text>
            <Text style={styles.loadingModalSubtext}>Não feche o aplicativo</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.surface,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  // Create Section
  createSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  createButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.surface,
  },
  infoCard: {
    backgroundColor: `${Colors.info}10`,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  // Backups Section
  backupsSection: {
    padding: 20,
    paddingTop: 0,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 16,
  },
  backupsList: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  backupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: `${Colors.border}30`,
  },
  backupInfo: {
    flex: 1,
  },
  backupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  backupDate: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  backupTime: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  backupDetails: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  backupActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: `${Colors.error}15`,
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  // Warning Section
  warningSection: {
    padding: 20,
    paddingTop: 0,
  },
  warningCard: {
    backgroundColor: `${Colors.warning}10`,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.warning,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  // Loading Overlay
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingModal: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    margin: 40,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  loadingModalText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
  },
  loadingModalSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  bottomPadding: {
    height: 40,
  },
});

export default BackupSettingsScreen;