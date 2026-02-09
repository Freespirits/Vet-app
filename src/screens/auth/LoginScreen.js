import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { validateEmail } from '../../utils/validators';
import { formatPhone } from '../../utils/helpers';
import { Colors } from '../../constants/Colors';

const LoginScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    profession: 'וטרינר/ית',
    clinic: '',
    crmv: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login, register } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'אימייל הוא שדה חובה';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'אימייל לא תקין';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'סיסמה היא שדה חובה';
    } else if (formData.password.length < 6) {
      newErrors.password = 'הסיסמה חייבת להכיל לפחות 6 תווים';
    }

    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = 'שם הוא שדה חובה';
      }
      if (!formData.clinic.trim()) {
        newErrors.clinic = 'שם המרפאה הוא שדה חובה';
      }
      if (!formData.crmv.trim()) {
        newErrors.crmv = 'מספר CRMV הוא שדה חובה';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'טלפון הוא שדה חובה';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    let result;

    try {
      if (isLogin) {
        console.log('מנסה להתחבר...');
        result = await login(formData.email, formData.password);
      } else {
        console.log('מנסה לרשום משתמש...');
        result = await register(formData);
      }

      if (!result.success) {
        let errorMessage = result.error;

        // Tratar diferentes tipos de erro
        if (errorMessage.includes('Invalid login credentials')) {
          errorMessage = 'אימייל או סיסמה שגויים';
        } else if (errorMessage.includes('User already registered')) {
          errorMessage = 'האימייל הזה כבר רשום. נסה להתחבר.';
          setIsLogin(true);
        } else if (errorMessage.includes('Password should be at least 6 characters')) {
          errorMessage = 'הסיסמה חייבת להכיל לפחות 6 תווים';
        } else if (errorMessage.includes('Unable to validate email address')) {
          errorMessage = 'אימייל לא תקין';
        } else if (errorMessage.includes('Email not confirmed')) {
          errorMessage = 'האימייל לא אומת. בדוק את תיבת הדואר שלך.';
        } else if (errorMessage.includes('signup is disabled')) {
          errorMessage = 'הרשמת משתמשים חדשים מושבתת זמנית.';
        } else if (errorMessage.includes('permission denied')) {
          errorMessage = 'שגיאת הרשאה. בדוק את פרטי ההתחברות.';
        } else if (errorMessage.includes('PGRST116')) {
          errorMessage = 'שגיאת הגדרות פרופיל. נסה שוב.';
        } else if (errorMessage.includes('duplicate key value violates unique constraint')) {
          errorMessage = 'האימייל הזה כבר רשום. נסה להתחבר.';
          setIsLogin(true);
        }

        Alert.alert('שגיאה', errorMessage);
      } else if (!isLogin) {
        // Registro bem-sucedido
        Alert.alert(
          'ההרשמה הצליחה!',
          'החשבון שלך נוצר בהצלחה. אתה כבר מחובר!',
          [{ text: 'אישור' }]
        );
      } else {
        // התחברות מוצלחת - AuthContext מטפל בניווט
        console.log('התחברות בוצעה בהצלחה');
      }
    } catch (error) {
      console.error('שגיאה לא צפויה:', error);
      Alert.alert('שגיאה', 'שגיאה לא צפויה. בדוק את החיבור ונסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    let formattedValue = value;

    if (field === 'phone') {
      formattedValue = formatPhone(value);
    } else if (field === 'email') {
      formattedValue = value.toLowerCase().trim();
    } else if (field === 'crmv') {
      formattedValue = value.toUpperCase();
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));

    // ניקוי שגיאת שדה כאשר המשתמש מתחיל להקליד
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleTabChange = (newIsLogin) => {
    setIsLogin(newIsLogin);
    setErrors({});

    if (newIsLogin) {
      // Limpar campos de registro quando mudar para login
      setFormData(prev => ({
        email: prev.email, // Manter email
        password: prev.password, // Manter senha
        name: '',
        profession: 'וטרינר/ית',
        clinic: '',
        crmv: '',
        phone: ''
      }));
    }
  };

  const fillDemoCredentials = () => {
    updateField('email', 'admin@petcare.com');
    updateField('password', '123456');
  };

  const clearForm = () => {
    setFormData({
      email: '',
      password: '',
      name: '',
      profession: 'וטרינר/ית',
      clinic: '',
      crmv: '',
      phone: ''
    });
    setErrors({});
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Colors.primaryGradient}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* לוגו וכותרת */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={styles.logoPlaceholder}>
                  <Text style={styles.logoEmoji}>🐾</Text>
                </View>
              </View>
              <Text style={styles.appTitle}>פטקייר פרו</Text>
              <Text style={styles.appSubtitle}>
                מערכת שלמה לווטרינרים
              </Text>
            </View>

            {/* Auth Form */}
            <Card style={styles.authCard}>
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[styles.tab, isLogin && styles.activeTab]}
                  onPress={() => handleTabChange(true)}
                  disabled={loading}
                >
                  <Text style={[styles.tabText, isLogin && styles.activeTabText]}>
                    התחברות
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, !isLogin && styles.activeTab]}
                  onPress={() => handleTabChange(false)}
                  disabled={loading}
                >
                  <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>
                    הרשמה
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Campos de Registro */}
              {!isLogin && (
                <>
                  <Input
                    label="שם מלא"
                    value={formData.name}
                    onChangeText={(value) => updateField('name', value)}
                    placeholder="השם המלא שלך"
                    leftIcon="person"
                    error={errors.name}
                    required
                    editable={!loading}
                  />

                  <Input
                    label="מקצוע"
                    value={formData.profession}
                    onChangeText={(value) => updateField('profession', value)}
                    placeholder="וטרינר/ית"
                    leftIcon="medical"
                    editable={!loading}
                  />

                  <Input
                    label="מרפאה/בית חולים וטרינרי"
                    value={formData.clinic}
                    onChangeText={(value) => updateField('clinic', value)}
                    placeholder="שם המרפאה"
                    leftIcon="business"
                    error={errors.clinic}
                    required
                    editable={!loading}
                  />

                  <Input
                    label="CRMV"
                    value={formData.crmv}
                    onChangeText={(value) => updateField('crmv', value)}
                    placeholder="12345-UF"
                    leftIcon="card"
                    error={errors.crmv}
                    required
                    editable={!loading}
                    autoCapitalize="characters"
                  />

                  <Input
                    label="טלפון"
                    value={formData.phone}
                    onChangeText={(value) => updateField('phone', value)}
                    placeholder="(05X) 123-4567"
                    keyboardType="phone-pad"
                    leftIcon="call"
                    error={errors.phone}
                    required
                    editable={!loading}
                  />
                </>
              )}

              {/* Campos Comuns */}
              <Input
                label="אימייל"
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                placeholder="example@mail.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                leftIcon="mail"
                error={errors.email}
                required
                editable={!loading}
              />

              <Input
                label="סיסמה"
                value={formData.password}
                onChangeText={(value) => updateField('password', value)}
                placeholder="הסיסמה שלך"
                secureTextEntry
                leftIcon="lock-closed"
                error={errors.password}
                required
                editable={!loading}
              />

              {/* כפתור ראשי */}
              <Button
                title={isLogin ? 'התחברות' : 'הרשמה'}
                onPress={handleSubmit}
                loading={loading}
                style={styles.authButton}
                fullWidth
              />

              {/* נתוני הדגמה - רק במסך התחברות */}
              {/* {isLogin && (
                <View style={styles.demoContainer}>
                  <Text style={styles.demoTitle}>נתוני הדגמה:</Text>
                  <TouchableOpacity
                    onPress={fillDemoCredentials}
                    disabled={loading}
                    style={styles.demoCredentials}
                  >
                    <Text style={styles.demoText}>📧 אימייל: admin@petcare.com</Text>
                    <Text style={styles.demoText}>🔒 סיסמה: 123456</Text>
                    <Text style={styles.demoHint}>הקש כאן למילוי אוטומטי</Text>
                  </TouchableOpacity>
                </View>
              )} */}

              {/* תנאי שימוש - רק בהרשמה */}
              {!isLogin && (
                <View style={styles.termsContainer}>
                  <Text style={styles.termsText}>
                    בעת ההרשמה אתה מסכים ל{' '}
                    <Text style={styles.termsLink}>תנאי השימוש</Text> ו{' '}
                    <Text style={styles.termsLink}>מדיניות הפרטיות</Text> שלנו.
                  </Text>
                </View>
              )}

              {/* קישור לשחזור סיסמה - רק בהתחברות */}
              {isLogin && (
                <TouchableOpacity
                  style={styles.forgotPassword}
                  disabled={loading}
                >
                  <Text style={styles.forgotPasswordText}>
                    שכחת סיסמה?
                  </Text>
                </TouchableOpacity>
              )}

              {/* כפתור לניקוי הטופס */}
              {!loading && (formData.email || formData.password || formData.name) && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={clearForm}
                >
                  <Text style={styles.clearButtonText}>
                    ניקוי הטופס
                  </Text>
                </TouchableOpacity>
              )}
            </Card>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                © 2024 פטקייר פרו - פותח באהבה עבור וטרינרים
              </Text>
              <Text style={styles.footerVersion}>
                גרסה 1.0.0
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: 50,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.surface,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  appSubtitle: {
    fontSize: 16,
    color: Colors.surface,
    opacity: 0.9,
    textAlign: 'center',
    maxWidth: 250,
    lineHeight: 22,
  },
  authCard: {
    marginBottom: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.surface,
  },
  authButton: {
    marginTop: 8,
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  demoContainer: {
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.info,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  demoCredentials: {
    paddingVertical: 4,
  },
  demoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 2,
  },
  demoHint: {
    fontSize: 12,
    color: Colors.primary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  termsContainer: {
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  termsText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: '600',
  },
  forgotPassword: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  clearButton: {
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 8,
  },
  clearButtonText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 12,
    color: Colors.surface,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 18,
  },
  footerVersion: {
    fontSize: 10,
    color: Colors.surface,
    opacity: 0.5,
    marginTop: 4,
  },
});

export default LoginScreen;
