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
  TouchableOpacity
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { AppointmentService } from '../../services/AppointmentService';
import { ClientService } from '../../services/ClientService';
import { PetService } from '../../services/PetService';
import { validateRequired } from '../../utils/validators';
import { formatDateTime } from '../../utils/helpers';
import { Colors } from '../../constants/Colors';
import { globalStyles } from '../../styles/globalStyles';

const NewAppointmentScreen = ({ navigation, route }) => {
  const appointmentId = route?.params?.appointmentId;
  const selectedPetId = route?.params?.petId;
  const selectedClientId = route?.params?.clientId;
  const selectedDateParam = route?.params?.selectedDate;
  const isEditing = !!appointmentId;

  const [formData, setFormData] = useState({
    clientId: selectedClientId || '',
    petId: selectedPetId || '',
    title: '',
    description: '',
    date: selectedDateParam || new Date().toISOString(),
    duration: '30',
    status: 'scheduled'
  });
  
  const [clients, setClients] = useState([]);
  const [pets, setPets] = useState([]);
  const [availablePets, setAvailablePets] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadInitialData();
    if (isEditing) {
      loadAppointment();
    } else {
      setLoadingData(false);
    }
  }, [appointmentId]);

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

  const loadAppointment = async () => {
    try {
      setLoadingData(true);
      const appointment = await AppointmentService.getById(appointmentId);
      if (appointment) {
        setFormData({
          clientId: appointment.client_id || appointment.clientId || '',
          petId: appointment.pet_id || appointment.petId || '',
          title: appointment.title || '',
          description: appointment.description || '',
          date: appointment.date || '',
          duration: appointment.duration?.toString() || '30',
          status: appointment.status || 'scheduled'
        });
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar dados do agendamento');
    } finally {
      setLoadingData(false);
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

    if (!validateRequired(formData.title)) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!validateRequired(formData.date)) {
      newErrors.date = 'Data e hora são obrigatórias';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const appointmentData = {
        client_id: formData.clientId,
        pet_id: formData.petId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: formData.date,
        duration: parseInt(formData.duration),
        status: formData.status,
      };

      let result;
      if (isEditing) {
        result = await AppointmentService.update(appointmentId, appointmentData);
      } else {
        result = await AppointmentService.create(appointmentData);
      }

      if (result.success) {
        Alert.alert(
          'Sucesso', 
          `Agendamento ${isEditing ? 'atualizado' : 'criado'} com sucesso!`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('Erro', result.error);
      }
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
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

  if (loadingData) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <View style={[globalStyles.container, globalStyles.justifyCenter, globalStyles.alignCenter]}>
          <Text style={globalStyles.textRegular}>Carregando dados...</Text>
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
          nestedScrollEnabled={true}
        >
          <Card>
            <View style={styles.header}>
              <Ionicons name="calendar" size={24} color={Colors.primary} />
              <Text style={styles.title}>
                {isEditing ? 'Editar Agendamento' : 'Novo Agendamento'}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informações do Agendamento</Text>
              
              <Input
                label="Título"
                value={formData.title}
                onChangeText={(value) => updateField('title', value)}
                placeholder="Ex: Consulta de rotina, Vacinação..."
                leftIcon="bookmark"
                error={errors.title}
                required
                editable={true}
                autoCapitalize="words"
              />

              <Input
                label="Descrição"
                value={formData.description}
                onChangeText={(value) => updateField('description', value)}
                placeholder="Detalhes do agendamento (opcional)"
                multiline
                numberOfLines={3}
                leftIcon="document-text"
                editable={true}
                autoCapitalize="sentences"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cliente e Pet</Text>
              
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>
                  Cliente <Text style={styles.required}>*</Text>
                </Text>
                <View style={[styles.pickerWrapper, errors.clientId && styles.pickerWrapperError]}>
                  <Picker
                    selectedValue={formData.clientId}
                    onValueChange={(value) => {
                      updateField('clientId', value);
                      updateField('petId', '');
                    }}
                    style={styles.picker}
                    enabled={true}
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
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Data e Duração</Text>
              
              <Input
                label="Data e Hora"
                value={formatDateTime(formData.date)}
                onChangeText={(value) => updateField('date', formatDateTimeInput(value))}
                placeholder="DD/MM/AAAA HH:MM"
                keyboardType="numeric"
                leftIcon="calendar"
                error={errors.date}
                required
                maxLength={16}
                editable={true}
              />

              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Duração</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={formData.duration}
                    onValueChange={(value) => updateField('duration', value)}
                    style={styles.picker}
                    enabled={true}
                  >
                    <Picker.Item label="15 minutos" value="15" />
                    <Picker.Item label="30 minutos" value="30" />
                    <Picker.Item label="45 minutos" value="45" />
                    <Picker.Item label="60 minutos" value="60" />
                    <Picker.Item label="90 minutos" value="90" />
                    <Picker.Item label="120 minutos" value="120" />
                  </Picker>
                </View>
              </View>

              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Status</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={formData.status}
                    onValueChange={(value) => updateField('status', value)}
                    style={styles.picker}
                    enabled={true}
                  >
                    <Picker.Item label="Agendado" value="scheduled" />
                    <Picker.Item label="Confirmado" value="confirmed" />
                    <Picker.Item label="Em andamento" value="in-progress" />
                    <Picker.Item label="Concluído" value="completed" />
                    <Picker.Item label="Cancelado" value="cancelled" />
                  </Picker>
                </View>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title="Cancelar"
                variant="outline"
                onPress={() => navigation.goBack()}
                style={styles.cancelButton}
                disabled={loading}
              />
              <Button
                title={isEditing ? 'Atualizar' : 'Agendar'}
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

export default NewAppointmentScreen;