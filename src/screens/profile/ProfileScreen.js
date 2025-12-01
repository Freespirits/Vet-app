import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Switch,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { AuthService } from '../../services/AuthService';
import { NotificationService } from '../../services/NotificationService';
import { BackupService } from '../../services/BackupService';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const enabled = await NotificationService.isEnabled();
      setNotificationsEnabled(enabled);
    } catch (error) {
      console.error('שגיאה בטעינת הגדרות ההתראות:', error);
    }
  };

  const handleNotificationToggle = async (value) => {
    try {
      if (value) {
        const permission = await NotificationService.requestPermission();
        if (permission) {
          await NotificationService.enable();
          setNotificationsEnabled(true);
        } else {
          Alert.alert(
            'ההרשאה נדחתה',
            'כדי לקבל התראות, יש לאפשר אותן בהגדרות המכשיר.',
            [
              { text: 'אישור' },
              { text: 'הגדרות', onPress: () => Linking.openSettings() }
            ]
          );
        }
      } else {
        await NotificationService.disable();
        setNotificationsEnabled(false);
      }
    } catch (error) {
      console.error('שגיאה בשינוי הגדרות ההתראות:', error);
      Alert.alert('שגיאה', 'לא ניתן היה לעדכן את הגדרות ההתראות');
    }
  };

  const handleBackup = async () => {
    Alert.alert(
      'גיבוי נתונים',
      'האם לגבות את כל הנתונים? הפעולה תכלול ייעוצים, מטופלים והגדרות.',
      [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'ביצוע גיבוי',
          onPress: async () => {
            try {
              const result = await BackupService.createBackup();
              if (result.success) {
                Alert.alert(
                  'הגיבוי הושלם',
                  `הגיבוי נוצר בהצלחה!\nקובץ: ${result.filename}\nגודל: ${result.size}`
                );
              } else {
                Alert.alert('שגיאה', result.error || 'אירעה שגיאה בעת יצירת הגיבוי');
              }
            } catch (error) {
              console.error('שגיאה בעת יצירת הגיבוי:', error);
              Alert.alert('שגיאה', 'שגיאה פנימית בעת יצירת הגיבוי');
            }
          }
        }
      ]
    );
  };

  const handleRestore = async () => {
    Alert.alert(
      'שחזור גיבוי',
      'להחזיר נתונים מגיבוי? פעולה זו תחליף את כל המידע הקיים.',
      [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'שחזור',
          style: 'destructive',
          onPress: () => navigation.navigate('BackupSettings')
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'התנתקות',
      'האם לצאת מהחשבון?',
      [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'התנתקות',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('שגיאה בעת התנתקות:', error);
              Alert.alert('שגיאה', 'אירעה שגיאה בעת היציאה מהחשבון');
            }
          }
        }
      ]
    );
  };

  const profileSections = [
    {
      title: 'חשבון',
      items: [
        {
          id: 'edit-profile',
          title: 'עריכת פרופיל',
          subtitle: 'שם, אימייל ופרטים אישיים',
          icon: 'person-outline',
          onPress: () => navigation.navigate('EditProfile'),
        },
        {
          id: 'change-password',
          title: 'החלפת סיסמה',
          subtitle: 'עדכון סיסמת גישה',
          icon: 'lock-closed-outline',
          onPress: () => navigation.navigate('ChangePassword'),
        },
      ],
    },
    {
      title: 'הגדרות',
      items: [
        {
          id: 'notifications',
          title: 'התראות',
          subtitle: 'תזכורות והתראות',
          icon: 'notifications-outline',
          showSwitch: true,
          switchValue: notificationsEnabled,
          onSwitchChange: handleNotificationToggle,
          onPress: () => navigation.navigate('NotificationSettings'),
        },
        {
          id: 'backup',
          title: 'גיבוי ושחזור',
          subtitle: 'הגנה על הנתונים שלך',
          icon: 'cloud-outline',
          onPress: () => navigation.navigate('BackupSettings'),
        },
      ],
    },
    {
      title: 'תמיכה',
      items: [
        {
          id: 'help',
          title: 'עזרה ותמיכה',
          subtitle: 'מרכז עזרה ויצירת קשר',
          icon: 'help-circle-outline',
          onPress: () => navigation.navigate('HelpSupport'),
        },
        {
          id: 'about',
          title: 'אודות',
          subtitle: 'שאלות נפוצות ומידע',
          icon: 'information-circle-outline',
          onPress: () => navigation.navigate('About'),
        },
        {
          id: 'privacy',
          title: 'פרטיות',
          subtitle: 'מדיניות פרטיות',
          icon: 'shield-outline',
          onPress: () => navigation.navigate('Privacy'),
        },
        {
          id: 'version',
          title: 'גרסה',
          subtitle: 'יומן שינויים ועדכונים',
          icon: 'code-outline',
          onPress: () => navigation.navigate('VersionInfo'),
        },
      ],
    },
    {
      title: 'סשן',
      items: [
        {
          id: 'logout',
          title: 'התנתקות',
          subtitle: 'התנתקות מהחשבון',
          icon: 'log-out-outline',
          onPress: handleLogout,
          danger: true,
        },
      ],
    },
  ];

  const renderProfileItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.profileItem, item.danger && styles.profileItemDanger]}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.profileItemContent}>
        <View style={[
          styles.profileItemIcon,
          { backgroundColor: item.danger ? `${Colors.error}15` : `${Colors.primary}15` }
        ]}>
          <Ionicons
            name={item.icon}
            size={20}
            color={item.danger ? Colors.error : Colors.primary}
          />
        </View>
        <View style={styles.profileItemInfo}>
          <Text style={[
            styles.profileItemTitle,
            item.danger && { color: Colors.error }
          ]}>
            {item.title}
          </Text>
          <Text style={styles.profileItemSubtitle}>{item.subtitle}</Text>
        </View>
        {item.showSwitch ? (
          <Switch
            value={item.switchValue}
            onValueChange={item.onSwitchChange}
            trackColor={{ false: Colors.border, true: `${Colors.primary}40` }}
            thumbColor={item.switchValue ? Colors.primary : Colors.textSecondary}
          />
        ) : (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.textSecondary}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSection = (section) => (
    <View key={section.title} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionItems}>
        {section.items.map(renderProfileItem)}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Sections */}
        <View style={styles.sectionsWrapper}>
          {profileSections.map(renderSection)}
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
  content: {
    flex: 1,
  },
  sectionsWrapper: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionItems: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileItem: {
    borderBottomWidth: 1,
    borderBottomColor: `${Colors.border}30`,
  },
  profileItemDanger: {
    backgroundColor: `${Colors.error}05`,
  },
  profileItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  profileItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileItemInfo: {
    flex: 1,
  },
  profileItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  profileItemSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  bottomPadding: {
    height: 40,
  },
});

export default ProfileScreen;