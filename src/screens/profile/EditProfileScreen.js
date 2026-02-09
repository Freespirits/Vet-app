import React, { useState, useEffect } from 'react';
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
import { useAuth } from '../../contexts/AuthContext';
import { validateEmail, validateRequired } from '../../utils/validators';
import { formatPhone } from '../../utils/helpers';

const EditProfileScreen = ({ navigation }) => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    clinic: '',
    crmv: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        profession: user.profession || '',
        clinic: user.clinic || '',
        crmv: user.crmv || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!validateRequired(formData.name)) {
      newErrors.name = 'שם הוא שדה חובה';
    }

    if (!validateRequired(formData.profession)) {
      newErrors.profession = 'מקצוע הוא שדה חובה';
    }

    if (!validateRequired(formData.clinic)) {
      newErrors.clinic = 'שם המרפאה הוא שדה חובה';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await updateProfile(formData);
      
      if (result.success) {
        Alert.alert(
          'הצלחה',
          'הפרופיל עודכן בהצלחה!',
          [{ text: 'אישור', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('שגיאה', result.error || 'שגיאה בעת עדכון הפרופיל');
      }
    } catch (error) {
      console.error('שגיאה בעדכון פרופיל:', error);
      Alert.alert('שגיאה', 'אירעה שגיאה פנימית במערכת');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    let formattedValue = value;
    
    if (field === 'phone') {
      formattedValue = formatPhone(value);
    } else if (field === 'crmv') {
      formattedValue = value.toUpperCase();
    }
    
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
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
              <Ionicons name="person" size={28} color={Colors.surface} />
            </View>
            <View>
              <Text style={styles.headerTitle}>עריכת פרופיל</Text>
              <Text style={styles.headerSubtitle}>עדכנו את פרטי המרפאה והצוות</Text>
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
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>פרטים אישיים</Text>

              <Input
                label="שם מלא"
                value={formData.name}
                onChangeText={(value) => updateField('name', value)}
                placeholder="הקלידו שם מלא"
                leftIcon="person"
                error={errors.name}
                required
                autoCapitalize="words"
              />

              <Input
                label="אימייל"
                value={user?.email || ''}
                placeholder="user@email.com"
                leftIcon="mail"
                editable={false}
                style={styles.disabledInput}
              />
              <Text style={styles.helperText}>
                לא ניתן לשנות את האימייל במערכת
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>פרטים מקצועיים</Text>

              <Input
                label="מקצוע"
                value={formData.profession}
                onChangeText={(value) => updateField('profession', value)}
                placeholder="וטרינר/ית"
                leftIcon="medical"
                error={errors.profession}
                required
              />

              <Input
                label="שם המרפאה"
                value={formData.clinic}
                onChangeText={(value) => updateField('clinic', value)}
                placeholder="שם המרפאה"
                leftIcon="business"
                error={errors.clinic}
                required
              />

              <Input
                label="CRMV"
                value={formData.crmv}
                onChangeText={(value) => updateField('crmv', value)}
                placeholder="12345-IL"
                leftIcon="card"
                autoCapitalize="characters"
              />

              <Input
                label="טלפון"
                value={formData.phone}
                onChangeText={(value) => updateField('phone', value)}
                placeholder="050-0000000"
                keyboardType="phone-pad"
                leftIcon="call"
              />
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
            title="שמירה"
            onPress={handleSave}
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
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 20,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  disabledInput: {
    opacity: 0.6,
  },
  helperText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: -12,
    marginBottom: 16,
    paddingLeft: 4,
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

export default EditProfileScreen;