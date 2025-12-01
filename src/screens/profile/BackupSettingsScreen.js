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
import { he } from 'date-fns/locale';
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
      console.error('שגיאה בטעינת הגיבויים:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    Alert.alert(
      'יצירת גיבוי',
      'להתחיל ליצור גיבוי מלא של הנתונים? הפעולה עשויה להימשך מספר דקות.',
      [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'צור',
          onPress: async () => {
            try {
              setCreating(true);
              const result = await BackupService.createBackup();
              
              if (result.success) {
                Alert.alert(
                  'הגיבוי נוצר',
                  `הגיבוי נוצר בהצלחה!\n\nקובץ: ${result.filename}\nגודל: ${result.size}\nפריטים: ${result.itemsCount}`
                );
                await loadBackups();
              } else {
                Alert.alert('שגיאה', result.error || 'שגיאה ביצירת הגיבוי');
              }
            } catch (error) {
              console.error('שגיאה ביצירת הגיבוי:', error);
              Alert.alert('שגיאה', 'שגיאה פנימית בעת יצירת גיבוי');
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
      'שחזור גיבוי',
      `להמשיך בשחזור הגיבוי מ-${format(new Date(backup.date), "dd MMMM 'בשעה' HH:mm", { locale: he })}?\n\nפעולה זו תחליף את כל הנתונים הנוכחיים!`,
      [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'שחזר',
          style: 'destructive',
          onPress: async () => {
            try {
              setRestoring(true);
              const result = await BackupService.restoreBackup(backup.id);
              
              if (result.success) {
                Alert.alert(
                  'הגיבוי שוחזר',
                  'הנתונים שוחזרו בהצלחה! האפליקציה תופעל מחדש.',
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
                Alert.alert('שגיאה', result.error || 'שגיאה בשחזור הגיבוי');
              }
            } catch (error) {
              console.error('שגיאה בשחזור הגיבוי:', error);
              Alert.alert('שגיאה', 'שגיאה פנימית בשחזור הגיבוי');
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
      'מחיקת גיבוי',
      `להמשיך במחיקת הגיבוי מ-${format(new Date(backup.date), 'dd MMMM', { locale: he })}?`,
      [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'מחק',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await BackupService.deleteBackup(backup.id);
              
              if (result.success) {
                await loadBackups();
              } else {
                Alert.alert('שגיאה', result.error || 'שגיאה במחיקת הגיבוי');
              }
            } catch (error) {
              console.error('שגיאה במחיקת הגיבוי:', error);
              Alert.alert('שגיאה', 'שגיאה פנימית במחיקת הגיבוי');
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
            {format(new Date(backup.date), "dd MMMM yyyy", { locale: he })}
          </Text>
          <Text style={styles.backupTime}>
            {format(new Date(backup.date), 'HH:mm', { locale: he })}
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
          <Text style={styles.headerTitle}>גיבוי ושחזור</Text>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Create Backup Section */}
        <View style={styles.createSection}>
          <Text style={styles.sectionTitle}>יצירת גיבוי</Text>
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
                {creating ? 'יוצר גיבוי...' : 'צור גיבוי חדש'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={20} color={Colors.info} />
            <Text style={styles.infoText}>
              הגיבוי כולל את כל הייעוצים, המטופלים, ההגדרות ונתוני האפליקציה.
            </Text>
          </View>
        </View>

        {/* Backups List */}
        <View style={styles.backupsSection}>
          <Text style={styles.sectionTitle}>גיבויים זמינים</Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>טוען גיבויים...</Text>
            </View>
          ) : backups.length > 0 ? (
            <View style={styles.backupsList}>
              {backups.map(renderBackupItem)}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="cloud-outline" size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyTitle}>לא נמצאו גיבויים</Text>
              <Text style={styles.emptySubtitle}>
                צרו את הגיבוי הראשון כדי להגן על הנתונים שלכם
              </Text>
            </View>
          )}
        </View>

        {/* Warning */}
        <View style={styles.warningSection}>
          <View style={styles.warningCard}>
            <Ionicons name="warning" size={24} color={Colors.warning} />
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>חשוב</Text>
                <Text style={styles.warningText}>
                  • שחזור גיבוי מחליף את כל הנתונים הקיימים{'\n'}
                  • בצעו גיבויים קבועים כדי להגן על הנתונים{'\n'}
                  • הגיבויים נשמרים מקומית במכשיר
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
            <Text style={styles.loadingModalText}>משחזר גיבוי...</Text>
            <Text style={styles.loadingModalSubtext}>אל תסגרו את האפליקציה</Text>
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