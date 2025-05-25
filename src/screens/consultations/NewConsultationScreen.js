import React, { useState, useEffect } from 'react';
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
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { ConsultationService } from '../../services/ConsultationService';
import { ClientService } from '../../services/ClientService';
import { PetService } from '../../services/PetService';
import { validateRequired } from '../../utils/validators';
import { formatDateTime } from '../../utils/helpers';
import { TIPOS_CONSULTA } from '../../constants/Data';
import { Colors } from '../../constants/Colors';
import { globalStyles } from '../../styles/globalStyles';

const NewConsultationScreen = ({ navigation, route }) => {
  const consultationId = route?.params?.consultationId;
  const selectedPetId = route?.params?.petId;
  const selectedClientId = route?.params?.clientId;
  const isEditing = !!consultationId;

  const [formData, setFormData] = useState({
    clientId: selectedClientId || '',
    petId: selectedPetId || '',
    type: '',
    date: new Date().toISOString(),
    symptoms: '',
    diagnosis: '',
    treatment: '',
    prescription: '',
    observations: '',
    followUpDate: '',
    weight: '',
    temperature: '',
    heartRate: '',
    price: ''
  });
  
  const [clients, setClients] = useState([]);
  const [pets, setPets] = useState([]);
  const [availablePets, setAvailablePets] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInitialData();
    if (isEditing) {
      loadConsultation();
    }
  }, [consultationId]);

  useEffect(() => {
    if (formData.clientId) {
      loadPetsForClient(formData.clientId);
    } else {
      setAvailablePets([]);
    }
  }, [formData.clientId]);

  const loadInitialData = async () => {
    try {
      const [clientList, petList] = await Promise.all([
        ClientService.getAll(),
        PetService.getAll()
      ]);
      setClients(clientList);
      setPets(petList);
      
      if (selectedClientId) {
        loadPetsForClient(selectedClientId);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar dados');
    }
  };

  const loadPetsForClient = async (clientId) => {
    try {
      const clientPets = await PetService.getByClientId(clientId);
      setAvailablePets(clientPets);
    } catch (error) {
      console.error('Erro ao carregar pets do cliente:', error);
    }
  };

  const loadConsultation = async () => {
    try {
      const consultation = await ConsultationService.getById(consultationId);
      if (consultation) {
        setFormData(consultation);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar dados da consulta');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateRequired(formData.clientId)) {
      newErrors.clientId = 'Cliente é obrigatório';
    }

    if (!validateRequired(formData.petId)) {
      newErrors.petId = 'Pet é obrigatório';
    }

    if (!validateRequired(formData.type)) {
      newErrors.type = 'Tipo de consulta é obrigatório';
    }

    if (!validateRequired(formData.symptoms)) {
      newErrors.symptoms = 'Sintomas são obrigatórios';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const consultationData = {
        ...formData,
        date: formData.date || new Date().toISOString(),
        price: formData.price ? parseFloat(formData.price) : 0
      };

      let result;
      if (isEditing) {
        result = await ConsultationService.update(consultationId, consultationData);
      } else {
        result = await ConsultationService.create(consultationData);
      }

      if (result.success) {
        Alert.alert(
          'Sucesso', 
          `Consulta ${isEditing ? 'atualizada' : 'registrada'} com sucesso!`,
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
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const formatDateTimeInput = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 4) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else if (cleaned.length <= 8) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    } else if (cleaned.length <= 10) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)} ${cleaned.slice(8, 10)}`;
    } else {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)} ${cleaned.slice(8, 10)}:${cleaned.slice(10, 12)}`;
    }
  };

  const selectedClient = clients.find(client => client.id === formData.clientId);
  const selectedPet = pets.find(pet => pet.id === formData.petId);

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={globalStyles.keyboardView}
      >
        <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
          <Card>
            <View style={styles.header}>
              <Ionicons name="medical" size={24} color={Colors.primary} />
              <Text style={styles.title}>
                {isEditing ? 'Editar Consulta' : 'Nova Consulta'}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Paciente</Text>
              
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>
                  Cliente <Text style={styles.required}>*</Text>
                </Text>
                <View style={[styles.pickerWrapper, errors.clientId && styles.pickerWrapperError]}>
                  <Picker
                    selectedValue={formData.clientId}
                    onValueChange={(value) => {
                      updateField('clientId', value);
                      updateField('petId', ''); // Reset pet selection
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item label="Selecione o cliente..." value="" />
                    {clients.map(client => (
                      <Picker.Item 
                        key={client.id} 
                        label={client.name} 
                        value={client.id} 
                      />
                    ))}
                  </Picker>
                </View>
                {errors.clientId && <Text style={styles.errorText}>{errors.clientId}</Text>}
                {selectedClient && (
                  <Text style={styles.clientInfo}>
                    📧 {selectedClient.email} • 📞 {selectedClient.phone}
                  </Text>
                )}
              </View>

              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>
                  Pet <Text style={styles.required}>*</Text>
                </Text>
                <View style={[styles.pickerWrapper, errors.petId && styles.pickerWrapperError]}>
                  <Picker
                    selectedValue={formData.petId}
                    onValueChange={(value) => updateField('petId', value)}
                    style={styles.picker}
                    enabled={formData.clientId !== ''}
                  >
                    <Picker.Item label="Selecione o pet..." value="" />
                    {availablePets.map(pet => (
                      <Picker.Item 
                        key={pet.id} 
                        label={`${pet.name} (${pet.species})`} 
                        value={pet.id} 
                      />
                    ))}
                  </Picker>
                </View>
                {errors.petId && <Text style={styles.errorText}>{errors.petId}</Text>}
                {selectedPet && (
                  <Text style={styles.petInfo}>
                    🐾 {selectedPet.species} • {selectedPet.breed} • {selectedPet.gender}
                  </Text>
                )}
              </View>

              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>
                  Tipo de Consulta <Text style={styles.required}>*</Text>
                </Text>
                <View style={[styles.pickerWrapper, errors.type && styles.pickerWrapperError]}>
                  <Picker
                    selectedValue={formData.type}
                    onValueChange={(value) => updateField('type', value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Selecione o tipo..." value="" />
                    {TIPOS_CONSULTA.map(tipo => (
                      <Picker.Item key={tipo} label={tipo} value={tipo} />
                    ))}
                  </Picker>
                </View>
                {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sinais Vitais</Text>
              
              <View style={styles.row}>
                <View style={styles.flex1}>
                  <Input
                    label="Peso (kg)"
                    value={formData.weight}
                    onChangeText={(value) => updateField('weight', value)}
                    placeholder="0.0"
                    keyboardType="decimal-pad"
                    leftIcon="fitness"
                  />
                </View>
                <View style={styles.flex1}>
                  <Input
                    label="Temperatura (°C)"
                    value={formData.temperature}
                    onChangeText={(value) => updateField('temperature', value)}
                    placeholder="0.0"
                    keyboardType="decimal-pad"
                    leftIcon="thermometer"
                  />
                </View>
              </View>

              <Input
                label="Frequência Cardíaca (bpm)"
                value={formData.heartRate}
                onChangeText={(value) => updateField('heartRate', value)}
                placeholder="0"
                keyboardType="numeric"
                leftIcon="heart"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Consulta</Text>
              
              <Input
                label="Sintomas"
                value={formData.symptoms}
                onChangeText={(value) => updateField('symptoms', value)}
                placeholder="Descreva os sintomas apresentados"
                multiline
                numberOfLines={3}
                error={errors.symptoms}
                required
              />

              <Input
                label="Diagnóstico"
                value={formData.diagnosis}
                onChangeText={(value) => updateField('diagnosis', value)}
                placeholder="Diagnóstico ou suspeita clínica"
                multiline
                numberOfLines={3}
              />

              <Input
                label="Tratamento"
                value={formData.treatment}
                onChangeText={(value) => updateField('treatment', value)}
                placeholder="Tratamento realizado ou recomendado"
                multiline
                numberOfLines={3}
              />

              <Input
                label="Prescrição"
                value={formData.prescription}
                onChangeText={(value) => updateField('prescription', value)}
                placeholder="Medicamentos prescritos"
                multiline
                numberOfLines={3}
              />

              <Input
                label="Observações"
                value={formData.observations}
                onChangeText={(value) => updateField('observations', value)}
                placeholder="Observações adicionais"
                multiline
                numberOfLines={2}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informações Adicionais</Text>
              
              <Input
                label="Data de Retorno"
                value={formData.followUpDate}
                onChangeText={(value) => updateField('followUpDate', formatDateTimeInput(value))}
                placeholder="DD/MM/AAAA HH:MM"
                keyboardType="numeric"
                leftIcon="calendar"
                maxLength={16}
              />

              <Input
                label="Valor da Consulta (R$)"
                value={formData.price}
                onChangeText={(value) => updateField('price', value)}
                placeholder="0.00"
                keyboardType="decimal-pad"
                leftIcon="card"
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
                title={isEditing ? 'Atualizar' : 'Registrar'}
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
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  required: {
    color: Colors.error,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    minHeight: 48,
  },
  pickerWrapperError: {
    borderColor: Colors.error,
  },
  picker: {
    height: 48,
    color: Colors.text,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
  },
  clientInfo: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    paddingLeft: 8,
  },
  petInfo: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    paddingLeft: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  flex1: {
    flex: 1,
    marginRight: 12,
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

export default NewConsultationScreen;