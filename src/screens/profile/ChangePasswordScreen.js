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
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Colors } from '../../constants/Colors';
import { supabase } from '../../config/supabase';
import { validateRequired, validateMinLength } from '../../utils/validators';

const ChangePasswordScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!validateRequired(formData.newPassword)) {
      newErrors.newPassword = 'הסיסמה החדשה היא שדה חובה';
    } else if (!validateMinLength(formData.newPassword, 6)) {
      newErrors.newPassword = 'הסיסמה החדשה חייבת לכלול לפחות 6 תווים';
    }

    if (!validateRequired(formData.confirmPassword)) {
      newErrors.confirmPassword = 'יש לאשר את הסיסמה החדשה';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'הסיסמאות אינן זהות';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword
      });

      if (error) {
        Alert.alert('שגיאה', error.message);
        return;
      }

      Alert.alert(
        'הצלחה',
        'הסיסמה עודכנה בהצלחה!',
        [{ text: 'אישור', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('שגיאה בעת שינוי סיסמה:', error);
      Alert.alert('שגיאה', 'אירעה שגיאה פנימית במערכת');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
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
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.surface} />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <View style={styles.headerIconContainer}>
              <Ionicons name="lock-closed" size={28} color={Colors.surface} />
            </View>
            <View>
              <Text style={styles.headerTitle}>שינוי סיסמה</Text>
              <Text style={styles.headerSubtitle}>הגדירו סיסמה חדשה ובטוחה</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Ionicons name="information-circle" size={24} color={Colors.info} />
                <Text style={styles.infoTitle}>טיפים לאבטחה</Text>
              </View>
              <Text style={styles.infoText}>
                • השתמשו בלפחות 6 תווים{'\n'}
                • שלבו אותיות, מספרים וסימנים{'\n'}
                • הימנעו ממידע אישי גלוי{'\n'}
                • השתמשו בסיסמה ייחודית לחשבון זה
              </Text>
            </View>

            <View style={styles.section}>
              <Input
                label="סיסמה חדשה"
                value={formData.newPassword}
                onChangeText={(value) => updateField('newPassword', value)}
                placeholder="הקלידו סיסמה חדשה"
                secureTextEntry
                leftIcon="lock-closed"
                error={errors.newPassword}
                required
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Input
                label="אישור סיסמה חדשה"
                value={formData.confirmPassword}
                onChangeText={(value) => updateField('confirmPassword', value)}
                placeholder="הקלידו שוב את הסיסמה החדשה"
                secureTextEntry
                leftIcon="lock-closed"
                error={errors.confirmPassword}
                required
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.warningCard}>
              <View style={styles.warningHeader}>
                <Ionicons name="warning" size={20} color={Colors.warning} />
                <Text style={styles.warningTitle}>חשוב לדעת</Text>
              </View>
              <Text style={styles.warningText}>
                לאחר שינוי הסיסמה תתבצע התנתקות ממכשירים אחרים לצורך אבטחה.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <Button
            title="ביטול"
            variant="outline"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
            disabled={loading}
          />
          <Button
            title="עדכון סיסמה"
            onPress={handleChangePassword}
            loading={loading}
            style={styles.saveButton}
          />
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.surface,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.surface,
    opacity: 0.9,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: `${Colors.info}10`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.info,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.info,
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  warningCard: {
    backgroundColor: `${Colors.warning}10`,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.warning,
    marginLeft: 8,
  },
  warningText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 32,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 2,
  },
});

export default ChangePasswordScreen;