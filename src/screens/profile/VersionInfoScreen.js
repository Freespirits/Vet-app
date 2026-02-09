import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';

const VersionInfoScreen = ({ navigation }) => {
  const currentVersion = {
    version: '1.0.0',
    build: '100',
    releaseDate: '01/07/2025',
    size: '25.4 MB',
  };

  const changelog = [
    {
      version: '1.0.0',
      date: '01/07/2025',
      type: 'major',
      changes: [
        'השקה ראשונית של VetApp',
        'מערכת מלאה לתיאום פגישות',
        'ניהול מטופלים עם היסטוריה רפואית',
        'ספרייה וטרינרית עם תרופות',
        'מערכת התראות ותזכורות',
        'גיבוי ושחזור נתונים',
        'ממשק מודרני ואינטואיטיבי',
      ],
    },
    {
      version: '0.9.5',
      date: '15/12/2023',
      type: 'minor',
      changes: [
        'שיפורים בסנכרון נתונים',
        'תיקוני באגים בספריית התרופות',
        'שיפור ביצועים כללי',
        'שיפורי ממשק משתמש',
      ],
    },
    {
      version: '0.9.0',
      date: '01/12/2023',
      type: 'minor',
      changes: [
        'נוספה יכולת גיבוי אוטומטי',
        'מערכת קטגוריות חדשה לתרופות',
        'שיפורים במערכת החיפוש',
        'תיקוני יציבות',
      ],
    },
    {
      version: '0.8.5',
      date: '15/11/2023',
      type: 'patch',
      changes: [
        'תיקון באגים קריטיים',
        'שיפורים בסנכרון לא מקוון',
        'אופטימיזציה של צריכת הסוללה',
        'שיפורי ממשק קטנים',
      ],
    },
    {
      version: '0.8.0',
      date: '01/11/2023',
      type: 'minor',
      changes: [
        'ספריית תרופות חדשה',
        'מערכת תבניות לביקורים',
        'שיפורים בלוח הזמנים לתורים',
        'תמיכה בריבוי שפות',
      ],
    },
    {
      version: '0.7.0',
      date: '15/10/2023',
      type: 'minor',
      changes: [
        'מערכת התראות פוש',
        'דוחות וסטטיסטיקות',
        'מצב כהה',
        'שיפורי נגישות',
      ],
    },
  ];

  const techInfo = [
    { label: 'פלטפורמה', value: 'React Native' },
    { label: 'גרסה מינימלית', value: 'iOS 12.0 / Android 6.0' },
    { label: 'מסד נתונים', value: 'Supabase' },
    { label: 'אימות', value: 'JWT + OAuth' },
    { label: 'אחסון', value: 'מוצפן' },
    { label: 'סנכרון', value: 'בזמן אמת' },
  ];

  const getVersionTypeColor = (type) => {
    switch (type) {
      case 'major': return Colors.error;
      case 'minor': return Colors.info;
      case 'patch': return Colors.success;
      default: return Colors.textSecondary;
    }
  };

  const getVersionTypeLabel = (type) => {
    switch (type) {
      case 'major': return 'MAJOR';
      case 'minor': return 'MINOR';
      case 'patch': return 'PATCH';
      default: return 'UPDATE';
    }
  };

  const openAppStore = () => {
    // קישור לחנות האפליקציות
    const appStoreUrl = 'https://apps.apple.com/app/vetapp';
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.vetapp';

    // זיהוי הפלטפורמה ופתיחת החנות המתאימה
    Linking.openURL(Platform.OS === 'ios' ? appStoreUrl : playStoreUrl);
  };

  const renderVersionInfo = () => (
    <View style={styles.versionInfoCard}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        style={styles.versionGradient}
      >
        <Ionicons name="information-circle" size={48} color={Colors.surface} />
        <Text style={styles.currentVersionTitle}>גרסת אפליקציה נוכחית</Text>
        <Text style={styles.currentVersionNumber}>
          {currentVersion.version} ({currentVersion.build})
        </Text>
        <Text style={styles.currentVersionDate}>
          שוחררה ב-{currentVersion.releaseDate}
        </Text>
        <Text style={styles.currentVersionSize}>
          גודל: {currentVersion.size}
        </Text>
      </LinearGradient>
    </View>
  );

  const renderTechInfo = () => (
    <View style={styles.techInfoSection}>
      <Text style={styles.sectionTitle}>מידע טכני</Text>
      <View style={styles.techInfoList}>
        {techInfo.map((info, index) => (
          <View key={index} style={styles.techInfoItem}>
            <Text style={styles.techInfoLabel}>{info.label}</Text>
            <Text style={styles.techInfoValue}>{info.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderChangelogItem = (item) => (
    <View key={item.version} style={styles.changelogItem}>
      <View style={styles.changelogHeader}>
        <View style={styles.changelogTitleContainer}>
          <Text style={styles.changelogVersion}>v{item.version}</Text>
          <View style={[
            styles.changelogTypeBadge,
            { backgroundColor: `${getVersionTypeColor(item.type)}20` }
          ]}>
            <Text style={[
              styles.changelogTypeText,
              { color: getVersionTypeColor(item.type) }
            ]}>
              {getVersionTypeLabel(item.type)}
            </Text>
          </View>
        </View>
        <Text style={styles.changelogDate}>{item.date}</Text>
      </View>

      <View style={styles.changesList}>
        {item.changes.map((change, index) => (
          <View key={index} style={styles.changeItem}>
            <View style={styles.changeBullet} />
            <Text style={styles.changeText}>{change}</Text>
          </View>
        ))}
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
          <Text style={styles.headerTitle}>גרסה</Text>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={openAppStore}
          >
            <Ionicons name="download-outline" size={24} color={Colors.surface} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Version */}
        <View style={styles.currentVersionSection}>
          {renderVersionInfo()}
        </View>

        {/* Tech Info */}
        {renderTechInfo()}

        {/* Update Button */}
        <View style={styles.updateSection}>
          <TouchableOpacity
            style={styles.updateActionButton}
            onPress={openAppStore}
          >
            <LinearGradient
              colors={[Colors.success, `${Colors.success}CC`]}
              style={styles.updateActionGradient}
            >
              <Ionicons name="download" size={20} color={Colors.surface} />
              <Text style={styles.updateActionText}>בדיקת עדכונים</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Changelog */}
        <View style={styles.changelogSection}>
          <Text style={styles.sectionTitle}>יומן שינויים</Text>
          <View style={styles.changelogList}>
            {changelog.map(renderChangelogItem)}
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color={Colors.info} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>עדכונים אוטומטיים</Text>
              <Text style={styles.infoText}>
                שמרו את האפליקציה מעודכנת כדי לקבל את הפיצ'רים האחרונים ותיקוני האבטחה החשובים.
                הפעילו עדכונים אוטומטיים בחנות האפליקציות שלכם.
              </Text>
            </View>
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
  updateButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  // Current Version
  currentVersionSection: {
    padding: 20,
  },
  versionInfoCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  versionGradient: {
    padding: 32,
    alignItems: 'center',
  },
  currentVersionTitle: {
    fontSize: 16,
    color: Colors.surface,
    marginTop: 16,
    marginBottom: 8,
  },
  currentVersionNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.surface,
    marginBottom: 8,
  },
  currentVersionDate: {
    fontSize: 14,
    color: Colors.surface,
    opacity: 0.9,
    marginBottom: 4,
  },
  currentVersionSize: {
    fontSize: 12,
    color: Colors.surface,
    opacity: 0.8,
  },
  // Tech Info
  techInfoSection: {
    padding: 20,
    paddingTop: 0,
  },
  techInfoList: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  techInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: `${Colors.border}30`,
  },
  techInfoLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  techInfoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  // Update Section
  updateSection: {
    padding: 20,
    paddingTop: 0,
  },
  updateActionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  updateActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  updateActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.surface,
  },
  // Changelog
  changelogSection: {
    padding: 20,
    paddingTop: 0,
  },
  changelogList: {
    gap: 16,
  },
  changelogItem: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  changelogHeader: {
    marginBottom: 16,
  },
  changelogTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  changelogVersion: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  changelogTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changelogTypeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  changelogDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  changesList: {
    gap: 8,
  },
  changeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  changeBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 6,
  },
  changeText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  // Info Section
  infoSection: {
    padding: 20,
    paddingTop: 0,
  },
  infoCard: {
    backgroundColor: `${Colors.info}10`,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.info,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 40,
  },
});

export default VersionInfoScreen;
