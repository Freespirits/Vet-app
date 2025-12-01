import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { ClientService } from '../../services/ClientService';
import { validateEmail, validateCPF, validatePhone, validateRequired } from '../../utils/validators';
import { formatCPF, formatPhone } from '../../utils/helpers';
import { Colors } from '../../constants/Colors';
import { globalStyles } from '../../styles/globalStyles';

const NewClientScreen = ({ navigation, route }) => {
  const clientId = route?.params?.clientId;
  const isEditing = !!clientId;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  React.useEffect(() => {
    if (isEditing) {
      loadClient();
    }
  }, [clientId]);

  const loadClient = async () => {
    try {
      setLoadingData(true);
      const client = await ClientService.getById(clientId);
      if (client) {
        setFormData({
          name: client.name || '',
          email: client.email || '',
          phone: client.phone || '',
          cpf: client.cpf || '',
          address: client.address || '',
          city: client.city || '',
          state: client.state || '',
          zipCode: client.zip_code || client.zipCode || '',
          notes: client.notes || ''
        });
      }
    } catch (error) {
      console.error('שגיאה בטעינת נתוני לקוח:', error);
      Alert.alert('שגיאה', 'אירעה שגיאה בעת טעינת נתוני הלקוח');
    } finally {
      setLoadingData(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateRequired(formData.name)) {
      newErrors.name = 'שם הלקוח הוא שדה חובה';
    }

    if (!validateRequired(formData.email)) {
      newErrors.email = 'האימייל הוא שדה חובה';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'האימייל לא תקין';
    }

    if (!validateRequired(formData.phone)) {
      newErrors.phone = 'טלפון הוא שדה חובה';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'טלפון לא תקין';
    }

    if (formData.cpf && !validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF לא תקין';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      console.log('שומר לקוח:', formData);
      
      let result;
      if (isEditing) {
        result = await ClientService.update(clientId, formData);
      } else {
        result = await ClientService.create(formData);
      }

      console.log('תוצאת השמירה:', result);

      if (result.success) {
        Alert.alert(
          'הצלחה',
          `הלקוח ${isEditing ? 'עודכן' : 'נוסף'} בהצלחה!`,
          [{ text: 'אישור', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('שגיאה', result.error || 'שגיאה לא ידועה');
      }
    } catch (error) {
      console.error('שגיאה בשמירת לקוח:', error);
      Alert.alert('שגיאה', 'אירעה שגיאה פנימית במערכת');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    let formattedValue = value;
    
    if (field === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (field === 'phone') {
      formattedValue = formatPhone(value);
    } else if (field === 'email') {
      formattedValue = value.toLowerCase().trim();
    } else if (field === 'state') {
      formattedValue = value.toUpperCase();
    }
    
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  if (loadingData) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <View style={[globalStyles.container, globalStyles.justifyCenter, globalStyles.alignCenter]}>
          <Text style={globalStyles.textRegular}>טוען נתוני לקוח...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Card>
            <View style={styles.header}>
              <Ionicons name="person-add" size={24} color={Colors.primary} />
              <Text style={styles.title}>
                {isEditing ? 'עריכת לקוח' : 'לקוח חדש'}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>פרטים אישיים</Text>

              <Input
                label="שם מלא"
                value={formData.name}
                onChangeText={(value) => updateField('name', value)}
                placeholder="שם הלקוח"
                leftIcon="person"
                error={errors.name}
                required
                editable={true}
                autoCapitalize="words"
              />

              <Input
                label="אימייל"
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                placeholder="email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                leftIcon="mail"
                error={errors.email}
                required
                editable={true}
              />

              <Input
                label="טלפון"
                value={formData.phone}
                onChangeText={(value) => updateField('phone', value)}
                placeholder="050-0000000"
                keyboardType="phone-pad"
                leftIcon="call"
                error={errors.phone}
                required
                editable={true}
              />

              <Input
                label="CPF"
                value={formData.cpf}
                onChangeText={(value) => updateField('cpf', value)}
                placeholder="000.000.000-00"
                keyboardType="numeric"
                leftIcon="card"
                error={errors.cpf}
                maxLength={14}
                editable={true}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>כתובת</Text>

              <Input
                label="כתובת"
                value={formData.address}
                onChangeText={(value) => updateField('address', value)}
                placeholder="רחוב, מספר, שכונה"
                leftIcon="location"
                editable={true}
                autoCapitalize="words"
              />

              <View style={styles.row}>
                <View style={styles.flex1}>
                  <Input
                    label="עיר"
                    value={formData.city}
                    onChangeText={(value) => updateField('city', value)}
                    placeholder="עיר"
                    editable={true}
                    autoCapitalize="words"
                  />
                </View>
                <View style={styles.stateContainer}>
                  <Input
                    label="מחוז"
                    value={formData.state}
                    onChangeText={(value) => updateField('state', value)}
                    placeholder="UF"
                    maxLength={2}
                    autoCapitalize="characters"
                    editable={true}
                  />
                </View>
              </View>

              <Input
                label="מיקוד"
                value={formData.zipCode}
                onChangeText={(value) => updateField('zipCode', value)}
                placeholder="00000-000"
                keyboardType="numeric"
                maxLength={9}
                editable={true}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>הערות</Text>

              <Input
                label="הערות"
                value={formData.notes}
                onChangeText={(value) => updateField('notes', value)}
                placeholder="הערות נוספות על הלקוח"
                multiline
                numberOfLines={3}
                maxLength={500}
                editable={true}
                autoCapitalize="sentences"
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title="ביטול"
                variant="outline"
                onPress={() => navigation.goBack()}
                style={styles.cancelButton}
                disabled={loading}
              />
              <Button
                title={isEditing ? 'עדכון' : 'שמירה'}
                onPress={handleSave}
                loading={loading}
                style={styles.saveButton}
              />
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  flex1: {
    flex: 1,
    marginRight: 12,
  },
  stateContainer: {
    width: 80,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    marginRight: 12,
  },
  saveButton: {
    flex: 1,
    marginLeft: 12,
  },
});

export default NewClientScreen;