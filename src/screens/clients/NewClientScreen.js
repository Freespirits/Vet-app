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

  React.useEffect(() => {
    if (isEditing) {
      loadClient();
    }
  }, [clientId]);

  const loadClient = async () => {
    try {
      const client = await ClientService.getById(clientId);
      if (client) {
        setFormData(client);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar dados do cliente');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateRequired(formData.name)) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!validateRequired(formData.email)) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!validateRequired(formData.phone)) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Telefone inválido';
    }

    if (formData.cpf && !validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      let result;
      if (isEditing) {
        result = await ClientService.update(clientId, formData);
      } else {
        result = await ClientService.create(formData);
      }

      if (result.success) {
        Alert.alert(
          'Sucesso', 
          `Cliente ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso!`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('Erro', result.error);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro interno do sistema');
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
    }
    
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={globalStyles.keyboardView}
      >
        <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
          <Card>
            <View style={styles.header}>
              <Ionicons name="person-add" size={24} color={Colors.primary} />
              <Text style={styles.title}>
                {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dados Pessoais</Text>
              
              <Input
                label="Nome Completo"
                value={formData.name}
                onChangeText={(value) => updateField('name', value)}
                placeholder="Nome do cliente"
                leftIcon="person"
                error={errors.name}
                required
              />

              <Input
                label="Email"
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                placeholder="email@exemplo.com"
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon="mail"
                error={errors.email}
                required
              />

              <Input
                label="Telefone"
                value={formData.phone}
                onChangeText={(value) => updateField('phone', value)}
                placeholder="(11) 99999-9999"
                keyboardType="phone-pad"
                leftIcon="call"
                error={errors.phone}
                required
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
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Endereço</Text>
              
              <Input
                label="Endereço"
                value={formData.address}
                onChangeText={(value) => updateField('address', value)}
                placeholder="Rua, número, bairro"
                leftIcon="location"
              />

              <View style={styles.row}>
                <View style={styles.flex1}>
                  <Input
                    label="Cidade"
                    value={formData.city}
                    onChangeText={(value) => updateField('city', value)}
                    placeholder="Cidade"
                  />
                </View>
                <View style={styles.stateContainer}>
                  <Input
                    label="Estado"
                    value={formData.state}
                    onChangeText={(value) => updateField('state', value)}
                    placeholder="UF"
                    maxLength={2}
                    autoCapitalize="characters"
                  />
                </View>
              </View>

              <Input
                label="CEP"
                value={formData.zipCode}
                onChangeText={(value) => updateField('zipCode', value)}
                placeholder="00000-000"
                keyboardType="numeric"
                maxLength={9}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Observações</Text>
              
              <Input
                label="Observações"
                value={formData.notes}
                onChangeText={(value) => updateField('notes', value)}
                placeholder="Observações adicionais sobre o cliente"
                multiline
                numberOfLines={3}
                maxLength={500}
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title="Cancelar"
                variant="outline"
                onPress={() => navigation.goBack()}
                style={styles.cancelButton}
              />
              <Button
                title={isEditing ? 'Atualizar' : 'Cadastrar'}
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