import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import { NotificationService } from '../../services/NotificationService';

const NotificationSettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    enabled: true,
    appointments: true,
    reminders: true,
    emergencies: true,
    updates: false,
    marketing: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const currentSettings = await NotificationService.getSettings();
      setSettings(currentSettings);
    } catch (error) {
      console.error('שגיאה בטעינת ההגדרות:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key, value) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      await NotificationService.updateSettings(newSettings);
      
      if (key === 'enabled' && value === false) {
        await NotificationService.cancelAll();
      }
    } catch (error) {
      console.error('שגיאה בעדכון ההגדרה:', error);
      Alert.alert('שגיאה', 'לא ניתן היה לעדכן את ההגדרה');
    }
  };

  const testNotification = async () => {
    try {
      await NotificationService.scheduleTest();
      Alert.alert('הצלחה', 'התראת בדיקה נשלחה!');
    } catch (error) {
      console.error('שגיאה בשליחת התראת הבדיקה:', error);
      Alert.alert('שגיאה', 'לא ניתן היה לשלוח את התראת הבדיקה');
    }
  };

  const notificationOptions = [
    {
      key: 'enabled',
      title: 'התראות',
      subtitle: 'הפעלת או כיבוי כל ההתראות',
      icon: 'notifications',
      color: Colors.primary,
    },
    {
      key: 'appointments',
      title: 'ייעוצים',
      subtitle: 'תזכורות לתורים מתוזמנים',
      icon: 'calendar',
      color: Colors.info,
      disabled: !settings.enabled,
    },
    {
      key: 'reminders',
      title: 'תזכורות',
      subtitle: 'חזרות ותרופות',
      icon: 'alarm',
      color: Colors.warning,
      disabled: !settings.enabled,
    },
    {
      key: 'emergencies',
      title: 'התראות דחופות',
      subtitle: 'התראות קריטיות ודחופות',
      icon: 'medical',
      color: Colors.error,
      disabled: !settings.enabled,
    },
    {
      key: 'updates',
      title: 'עדכונים',
      subtitle: 'חדשות האפליקציה',
      icon: 'refresh',
      color: Colors.success,
      disabled: !settings.enabled,
    },
    {
      key: 'marketing',
      title: 'קידום מכירות',
      subtitle: 'הצעות וטיפים וטרינריים',
      icon: 'gift',
      color: Colors.secondary,
      disabled: !settings.enabled,
    },
  ];

  const renderNotificationOption = (option) => (
    <View key={option.key} style={[
      styles.optionItem,
      option.disabled && styles.optionItemDisabled
    ]}>
      <View style={styles.optionContent}>
        <View style={[
          styles.optionIcon,
          { backgroundColor: `${option.color}15` }
        ]}>
          <Ionicons
            name={option.icon}
            size={20}
            color={option.disabled ? Colors.textSecondary : option.color}
          />
        </View>
        <View style={styles.optionInfo}>
          <Text style={[
            styles.optionTitle,
            option.disabled && { color: Colors.textSecondary }
          ]}>
            {option.title}
          </Text>
          <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
        </View>
        <Switch
          value={settings[option.key]}
          onValueChange={(value) => updateSetting(option.key, value)}
          disabled={option.disabled}
          trackColor={{ 
            false: Colors.border, 
            true: `${option.color}40` 
          }}
          thumbColor={settings[option.key] ? option.color : Colors.textSecondary}
        />
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
          <Text style={styles.headerTitle}>התראות</Text>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.description}>
            הגדירו מתי וכיצד תרצו לקבל התראות מהאפליקציה.
          </Text>
        </View>

        {/* Notification Options */}
        <View style={styles.optionsSection}>
          <Text style={styles.sectionTitle}>סוגי התראות</Text>
          <View style={styles.optionsList}>
            {notificationOptions.map(renderNotificationOption)}
          </View>
        </View>

        {/* Test Section */}
        <View style={styles.testSection}>
          <Text style={styles.sectionTitle}>בדיקה</Text>
          <TouchableOpacity
            style={styles.testButton}
            onPress={testNotification}
            disabled={!settings.enabled}
          >
            <LinearGradient
              colors={settings.enabled ? 
                [Colors.primary, Colors.primaryDark] : 
                [Colors.textSecondary, Colors.textSecondary]
              }
              style={styles.testButtonGradient}
            >
              <Ionicons name="send" size={20} color={Colors.surface} />
              <Text style={styles.testButtonText}>
                שליחת התראת בדיקה
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color={Colors.info} />
            <Text style={styles.infoText}>
              התראות הן חיוניות כדי לשמור אתכם מעודכנים לגבי ייעוצים 
              ותזכורות חשובות. ניתן להתאים אישית כל סוג לפי העדפתכם.
            </Text>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
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
  descriptionSection: {
    padding: 20,
    paddingBottom: 10,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
    marginLeft: 4,
  },
  optionsSection: {
    padding: 20,
    paddingTop: 10,
  },
  optionsList: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  optionItem: {
    borderBottomWidth: 1,
    borderBottomColor: `${Colors.border}30`,
  },
  optionItemDisabled: {
    opacity: 0.6,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  optionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  testSection: {
    padding: 20,
    paddingTop: 10,
  },
  testButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  testButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.surface,
  },
  infoSection: {
    padding: 20,
    paddingTop: 10,
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
  bottomPadding: {
    height: 40,
  },
});

export default NotificationSettingsScreen;