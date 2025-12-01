import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';

const AboutScreen = ({ navigation }) => {
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);

  const appInfo = {
    name: 'VetApp',
    version: '1.0.0',
    build: '100',
    developer: 'VetTech Solutions',
    website: 'https://www.vetapp.com',
    email: 'contato@vetapp.com',
  };

  const faqData = [
    {
      id: 1,
      question: 'מהו ה-VetApp?',
      answer: 'VetApp הוא פתרון מלא לניהול מרפאה וטרינרית: קביעת תורים, ניהול מטופלים, מעקב אחרי היסטוריה רפואית וארגון שוטף של המרפאה.',
    },
    {
      id: 2,
      question: 'איך קובעים תור במערכת?',
      answer: 'ניתן לקבוע תורים ישירות באפליקציה, לבחור תאריך, שעה וסוג ביקור. המערכת שולחת תזכורות אוטומטיות ומאפשרת שינויי מועד.',
    },
    {
      id: 3,
      question: 'האם המידע שלי מאובטח?',
      answer: 'בהחלט. אנו משתמשים בהצפנה מתקדמת ונצמדים לפרקטיקות אבטחה מחמירות. אפשר גם לבצע גיבויים מקומיים.',
    },
    {
      id: 4,
      question: 'אפשר להשתמש בכמה מכשירים?',
      answer: 'כן. הנתונים מסתנכרנים לענן, כך שתוכל לגשת מכל מכשיר עם החשבון שלך.',
    },
    {
      id: 5,
      question: 'איך פועלת ספריית התרופות?',
      answer: 'הספרייה מאפשרת לקטלג תרופות, חיסונים ופרוצדורות עם מינונים, התוויות נגד ופרוטוקולים מותאמים.',
    },
    {
      id: 6,
      question: 'האם יש מצב לא מקוון?',
      answer: 'כן. האפליקציה פועלת גם ללא חיבור, והסנכרון מתבצע אוטומטית כשיש רשת.',
    },
    {
      id: 7,
      question: 'איך מגבים את הנתונים?',
      answer: 'היכנס לפרופיל > גיבוי ושחזור. מומלץ לבצע גיבויים תקופתיים כדי להגן על המידע.',
    },
    {
      id: 8,
      question: 'האם יש מגבלה על מספר המטופלים?',
      answer: 'אין מגבלה. ניתן לרשום כל כמות של מטופלים בהתאם לצורך.',
    },
  ];

  const features = [
    {
      icon: 'calendar-outline',
      title: 'יומן תורים',
      description: 'מערכת מלאה לתיאום וניהול ייעוצים',
    },
    {
      icon: 'paw-outline',
      title: 'ניהול מטופלים',
      description: 'רישום ומעקב היסטורי מלא לחיות המחמד',
    },
    {
      icon: 'medical-outline',
      title: 'היסטוריה רפואית',
      description: 'תיק רפואי דיגיטלי מקיף',
    },
    {
      icon: 'library-outline',
      title: 'ספרייה וטרינרית',
      description: 'תרופות, חיסונים ופרוטוקולים מסודרים',
    },
    {
      icon: 'notifications-outline',
      title: 'תזכורות',
      description: 'התראות אוטומטיות ומותאמות אישית',
    },
    {
      icon: 'cloud-outline',
      title: 'גיבוי מאובטח',
      description: 'הנתונים שלך נשמרים ומוגנים תמיד',
    },
  ];

  const toggleQuestion = (id) => {
    setExpandedQuestionId(expandedQuestionId === id ? null : id);
  };

  const openWebsite = () => {
    Linking.openURL(appInfo.website);
  };

  const sendEmail = () => {
    Linking.openURL(`mailto:${appInfo.email}`);
  };

  const renderFeature = (feature, index) => (
    <View key={index} style={styles.featureItem}>
      <View style={[styles.featureIcon, { backgroundColor: `${Colors.primary}15` }]}>
        <Ionicons name={feature.icon} size={24} color={Colors.primary} />
      </View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{feature.title}</Text>
        <Text style={styles.featureDescription}>{feature.description}</Text>
      </View>
    </View>
  );

  const renderQuestionItem = (item) => {
    const isExpanded = expandedQuestionId === item.id;

    return (
      <View key={item.id} style={styles.faqItem}>
        <TouchableOpacity
          style={styles.faqHeader}
          onPress={() => toggleQuestion(item.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.faqQuestion}>{item.question}</Text>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.faqAnswer}>
            <Text style={styles.faqAnswerText}>{item.answer}</Text>
          </View>
        )}
      </View>
    );
  };

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
          <Text style={styles.headerTitle}>אודות</Text>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Info */}
        <View style={styles.appInfoSection}>
          <LinearGradient
            colors={[Colors.surface, '#FAFAFA']}
            style={styles.appInfoCard}
          >
            <View style={styles.appIcon}>
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={styles.appIconGradient}
              >
                <Ionicons name="medical" size={40} color={Colors.surface} />
              </LinearGradient>
            </View>
            <Text style={styles.appName}>{appInfo.name}</Text>
            <Text style={styles.appVersion}>גרסה {appInfo.version} (Build {appInfo.build})</Text>
            <Text style={styles.appDeveloper}>פותח על ידי {appInfo.developer}</Text>

            <View style={styles.appActions}>
              <TouchableOpacity style={styles.appAction} onPress={openWebsite}>
                <Ionicons name="globe-outline" size={20} color={Colors.primary} />
                <Text style={styles.appActionText}>אתר</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.appAction} onPress={sendEmail}>
                <Ionicons name="mail-outline" size={20} color={Colors.primary} />
                <Text style={styles.appActionText}>יצירת קשר</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>יכולות</Text>
          <View style={styles.featuresList}>
            {features.map(renderFeature)}
          </View>
        </View>

        {/* שאלות נפוצות */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>שאלות נפוצות</Text>
          <View style={styles.faqList}>
            {faqData.map(renderQuestionItem)}
          </View>
        </View>

        {/* Legal */}
        <View style={styles.legalSection}>
          <Text style={styles.sectionTitle}>מידע משפטי</Text>
          <View style={styles.legalList}>
            <TouchableOpacity
              style={styles.legalItem}
              onPress={() => navigation.navigate('Privacy')}
            >
              <Text style={styles.legalText}>מדיניות פרטיות</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.legalItem}
              onPress={() => navigation.navigate('TermsOfService')}
            >
              <Text style={styles.legalText}>תנאי שימוש</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Credits */}
        <View style={styles.creditsSection}>
          <Text style={styles.creditsText}>
            © 2025 VetTech Solutions. כל הזכויות שמורות.
          </Text>
          <Text style={styles.creditsSubtext}>
            נוצר באהבה עבור וטרינרים
          </Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  // App Info Section
  appInfoSection: {
    padding: 20,
  },
  appInfoCard: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  appIcon: {
    marginBottom: 16,
  },
  appIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  appDeveloper: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  appActions: {
    flexDirection: 'row',
    gap: 16,
  },
  appAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary}15`,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  appActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  // Features Section
  featuresSection: {
    padding: 20,
    paddingTop: 0,
  },
  featuresList: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: `${Colors.border}30`,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  // שאלות נפוצות
  faqSection: {
    padding: 20,
    paddingTop: 0,
  },
  faqList: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: `${Colors.border}30`,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginRight: 12,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  faqAnswerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  // Legal Section
  legalSection: {
    padding: 20,
    paddingTop: 0,
  },
  legalList: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: `${Colors.border}30`,
  },
  legalText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  // Credits Section
  creditsSection: {
    padding: 20,
    paddingTop: 0,
    alignItems: 'center',
  },
  creditsText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  creditsSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  bottomPadding: {
    height: 40,
  },
});

export default AboutScreen;
