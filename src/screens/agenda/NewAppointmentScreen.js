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
  Dimensions
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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

const { width } = Dimensions.get('window');

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

  const appointmentTypes = [
    { value: 'Consulta de Rotina', icon: 'medical', color: Colors.primary },
    { value: 'Vacinação', icon: 'shield-checkmark', color: Colors.success },
    { value: 'Cirurgia', icon: 'cut', color: Colors.error },
    { value: 'Exame', icon: 'search', color: Colors.info },
    { value: 'Emergência', icon: 'alarm', color: Colors.warning },
    { value: 'Retorno', icon: 'refresh', color: Colors.secondary },
    { value: 'Banho e Tosa', icon: 'water', color: '#00BCD4' },
    { value: 'Castração', icon: 'medical', color: '#9C27B0' },
  ];

  const durations = [
    { value: '15', label: '15 min', icon: 'timer' },
    { value: '30', label: '30 min', icon: 'timer' },
    { value: '45', label: '45 min', icon: 'timer' },
    { value: '60', label: '1 hora', icon: 'time' },
    { value: '90', label: '1h 30min', icon: 'time' },
    { value: '120', label: '2 horas', icon: 'time' },
  ];

  const statusOptions = [
    { value: 'scheduled', label: 'Agendado', color: Colors.info, icon: 'calendar' },
    { value: 'confirmed', label: 'Confirmado', color: Colors.success, icon: 'checkmark-circle' },
    { value: 'in-progress', label: 'Em andamento', color: Colors.warning, icon: 'play-circle' },
    { value: 'completed', label: 'Concluído', color: Colors.primary, icon: 'checkmark-done' },
    { value: 'cancelled', label: 'Cancelado', color: Colors.error, icon: 'close-circle' },
  ];

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
      newErrors.title = 'Tipo de consulta é obrigatório';
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
  const selectedAppointmentType = appointmentTypes.find(type => type.value === formData.title);
  const selectedDuration = durations.find(duration => duration.value === formData.duration);
  const selectedStatus = statusOptions.find(status => status.value === formData.status);

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
    <SafeAreaView style={styles.container}>
      {/* Header Gradiente */}
      <LinearGradient
        colors={[Colors.info, '#1976D2']}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.surface} />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <View style={styles.calendarIconContainer}>
              <Ionicons name="calendar" size={28} color={Colors.surface} />
            </View>
            <View>
              <Text style={styles.headerTitle}>
                {isEditing ? 'Editar Agendamento' : 'Novo Agendamento'}
              </Text>
              <Text style={styles.headerSubtitle}>
                {isEditing ? 'Atualize os dados do agendamento' : 'Agende uma nova consulta'}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
          removeClippedSubviews={false}
        >
          {/* Card Principal */}
          <View style={styles.mainCard}>
            {/* Seção: Tipo de Consulta */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  style={styles.sectionIconGradient}
                >
                  <Ionicons name="medical" size={20} color={Colors.surface} />
                </LinearGradient>
                <Text style={styles.sectionTitle}>Tipo de Consulta</Text>
              </View>
              
              <View style={styles.appointmentTypesContainer}>
                {appointmentTypes.map(type => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.appointmentTypeOption,
                      formData.title === type.value && styles.appointmentTypeSelected,
                      { borderColor: type.color }
                    ]}
                    onPress={() => updateField('title', type.value)}
                  >
                    <LinearGradient
                      colors={formData.title === type.value ? 
                        [type.color, `${type.color}CC`] : 
                        ['transparent', 'transparent']
                      }
                      style={styles.appointmentTypeGradient}
                    >
                      <Ionicons 
                        name={type.icon} 
                        size={20} 
                        color={formData.title === type.value ? Colors.surface : type.color} 
                      />
                      <Text style={[
                        styles.appointmentTypeText,
                        formData.title === type.value && styles.appointmentTypeTextSelected
                      ]}>
                        {type.value}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

              <Input
                label="Descrição Adicional"
                value={formData.description}
                onChangeText={(value) => updateField('description', value)}
                placeholder="Detalhes específicos da consulta (opcional)"
                multiline
                numberOfLines={3}
                leftIcon="document-text"
                autoCapitalize="sentences"
                returnKeyType="next"
                blurOnSubmit={false}
                style={styles.inputField}
              />
            </View>

            {/* Seção: Paciente */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <LinearGradient
                  colors={[Colors.secondary, Colors.accent]}
                  style={styles.sectionIconGradient}
                >
                  <Ionicons name="paw" size={20} color={Colors.surface} />
                </LinearGradient>
                <Text style={styles.sectionTitle}>Paciente</Text>
              </View>
              
              {/* Cliente Selector */}
              <View style={styles.pickerSection}>
                <Text style={styles.pickerLabel}>
                  Cliente <Text style={styles.required}>*</Text>
                </Text>
                <View style={[styles.pickerContainer, errors.clientId && styles.pickerError]}>
                  <LinearGradient
                    colors={['#F8F9FA', '#FFFFFF']}
                    style={styles.pickerGradient}
                  >
                    <Ionicons name="person" size={20} color={Colors.primary} style={styles.pickerIcon} />
                    <Picker
                      selectedValue={formData.clientId}
                      onValueChange={(value) => {
                        updateField('clientId', value);
                        updateField('petId', '');
                      }}
                      style={styles.picker}
                      mode="dropdown"
                      dropdownIconColor={Colors.primary}
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
                  </LinearGradient>
                </View>
                {errors.clientId && <Text style={styles.errorText}>{errors.clientId}</Text>}
                {selectedClient && (
                  <View style={styles.selectedClientInfo}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                    <Text style={styles.clientInfoText}>
                      {selectedClient.email} • {selectedClient.phone}
                    </Text>
                  </View>
                )}
              </View>

              {/* Pet Selector */}
              <View style={styles.pickerSection}>
                <Text style={styles.pickerLabel}>
                  Pet <Text style={styles.required}>*</Text>
                </Text>
                <View style={[styles.pickerContainer, errors.petId && styles.pickerError, !formData.clientId && styles.pickerDisabled]}>
                  <LinearGradient
                    colors={formData.clientId ? ['#F8F9FA', '#FFFFFF'] : ['#F5F5F5', '#F0F0F0']}
                    style={styles.pickerGradient}
                  >
                    <Ionicons 
                      name="paw" 
                      size={20} 
                      color={formData.clientId ? Colors.primary : Colors.textSecondary} 
                      style={styles.pickerIcon} 
                    />
                    <Picker
                      selectedValue={formData.petId}
                      onValueChange={(value) => updateField('petId', value)}
                      style={styles.picker}
                      enabled={formData.clientId !== ''}
                      mode="dropdown"
                      dropdownIconColor={formData.clientId ? Colors.primary : Colors.textSecondary}
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
                  </LinearGradient>
                </View>
                {errors.petId && <Text style={styles.errorText}>{errors.petId}</Text>}
                {selectedPet && (
                  <View style={styles.selectedPetInfo}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                    <Text style={styles.petInfoText}>
                      {selectedPet.species} • {selectedPet.breed} • {selectedPet.gender}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Seção: Data e Configurações */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <LinearGradient
                  colors={[Colors.info, `${Colors.info}CC`]}
                  style={styles.sectionIconGradient}
                >
                  <Ionicons name="time" size={20} color={Colors.surface} />
                </LinearGradient>
                <Text style={styles.sectionTitle}>Data e Configurações</Text>
              </View>
              
              <Input
                label="Data e Hora"
                value={formatDateTime(formData.date)}
                onChangeText={(value) => updateField('date', value)}
                placeholder="DD/MM/AAAA HH:MM"
                keyboardType="numeric"
                leftIcon="calendar"
                error={errors.date}
                required
                maxLength={16}
                returnKeyType="next"
                blurOnSubmit={false}
                style={styles.inputField}
              />

              {/* Duração com botões visuais */}
              <View style={styles.pickerSection}>
                <Text style={styles.pickerLabel}>Duração</Text>
                <View style={styles.durationContainer}>
                  {durations.map(duration => (
                    <TouchableOpacity
                      key={duration.value}
                      style={[
                        styles.durationOption,
                        formData.duration === duration.value && styles.durationOptionSelected
                      ]}
                      onPress={() => updateField('duration', duration.value)}
                    >
                      <LinearGradient
                        colors={formData.duration === duration.value ? 
                          [Colors.primary, `${Colors.primary}CC`] : 
                          ['transparent', 'transparent']
                        }
                        style={styles.durationOptionGradient}
                      >
                        <Ionicons 
                          name={duration.icon} 
                          size={16} 
                          color={formData.duration === duration.value ? Colors.surface : Colors.primary} 
                        />
                        <Text style={[
                          styles.durationOptionText,
                          formData.duration === duration.value && styles.durationOptionTextSelected
                        ]}>
                          {duration.label}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Status com botões visuais */}
              <View style={styles.pickerSection}>
                <Text style={styles.pickerLabel}>Status</Text>
                <View style={styles.statusContainer}>
                  {statusOptions.map(status => (
                    <TouchableOpacity
                      key={status.value}
                      style={[
                        styles.statusOption,
                        formData.status === status.value && styles.statusOptionSelected,
                        { borderColor: status.color }
                      ]}
                      onPress={() => updateField('status', status.value)}
                    >
                      <LinearGradient
                        colors={formData.status === status.value ? 
                          [status.color, `${status.color}CC`] : 
                          ['transparent', 'transparent']
                        }
                        style={styles.statusOptionGradient}
                      >
                        <Ionicons 
                          name={status.icon} 
                          size={16} 
                          color={formData.status === status.value ? Colors.surface : status.color} 
                        />
                        <Text style={[
                          styles.statusOptionText,
                          formData.status === status.value && styles.statusOptionTextSelected
                        ]}>
                          {status.label}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Resumo do Agendamento */}
            {formData.title && formData.clientId && formData.petId && (
              <View style={styles.summarySection}>
                <LinearGradient
                  colors={[`${Colors.success}15`, `${Colors.success}05`]}
                  style={styles.summaryGradient}
                >
                  <View style={styles.summaryHeader}>
                    <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
                    <Text style={styles.summaryTitle}>Resumo do Agendamento</Text>
                  </View>
                  
                  <View style={styles.summaryContent}>
                    <View style={styles.summaryItem}>
                      <Ionicons name="medical" size={16} color={Colors.success} />
                      <Text style={styles.summaryText}>{formData.title}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                      <Ionicons name="person" size={16} color={Colors.success} />
                      <Text style={styles.summaryText}>{selectedClient?.name}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                      <Ionicons name="paw" size={16} color={Colors.success} />
                      <Text style={styles.summaryText}>{selectedPet?.name} ({selectedPet?.species})</Text>
                    </View>
                    <View style={styles.summaryItem}>
                      <Ionicons name="time" size={16} color={Colors.success} />
                      <Text style={styles.summaryText}>{selectedDuration?.label}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                      <Ionicons name={selectedStatus?.icon} size={16} color={Colors.success} />
                      <Text style={styles.summaryText}>{selectedStatus?.label}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            )}
          </View>
        </ScrollView>
        
        {/* Botões de Ação Fixos */}
        <LinearGradient
          colors={[Colors.surface, `${Colors.surface}F0`]}
          style={styles.actionContainer}
        >
          <View style={styles.actionButtons}>
            <Button
              title="Cancelar"
              variant="outline"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
              disabled={loading}
              icon={<Ionicons name="close" size={16} color={Colors.textSecondary} />}
            />
            <Button
              title={isEditing ? 'Atualizar' : 'Agendar'}
              onPress={handleSave}
              loading={loading}
              style={styles.saveButton}
              icon={<Ionicons name={isEditing ? "checkmark" : "calendar"} size={16} color={Colors.surface} />}
            />
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
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
  calendarIconContainer: {
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
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 120,
  },
  mainCard: {
    backgroundColor: Colors.surface,
    margin: 16,
    borderRadius: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    overflow: 'hidden',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: `${Colors.border}50`,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionIconGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  inputField: {
    marginBottom: 0,
  },
  appointmentTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  appointmentTypeOption: {
    width: (width - 88) / 2,
    height: 70,
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
  },
  appointmentTypeSelected: {
    transform: [{ scale: 1.02 }],
  },
  appointmentTypeGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  appointmentTypeText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text,
    marginTop: 6,
    textAlign: 'center',
  },
  appointmentTypeTextSelected: {
    color: Colors.surface,
    fontWeight: '600',
  },
  pickerSection: {
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 12,
  },
  required: {
    color: Colors.error,
  },
  pickerContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pickerError: {
    borderColor: Colors.error,
  },
  pickerDisabled: {
    opacity: 0.6,
  },
  pickerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
  },
  pickerIcon: {
    marginLeft: 16,
    marginRight: 8,
  },
  picker: {
    flex: 1,
    color: Colors.text,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 6,
    marginLeft: 4,
  },
  selectedClientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 8,
    backgroundColor: `${Colors.success}15`,
    borderRadius: 8,
  },
  clientInfoText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  selectedPetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 8,
    backgroundColor: `${Colors.success}15`,
    borderRadius: 8,
  },
  petInfoText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  durationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  durationOption: {
    width: (width - 88) / 3,
    height: 50,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    overflow: 'hidden',
  },
  durationOptionSelected: {
    transform: [{ scale: 1.05 }],
  },
  durationOptionGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  durationOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
    marginLeft: 4,
  },
  durationOptionTextSelected: {
    color: Colors.surface,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusOption: {
    width: (width - 88) / 2,
    height: 50,
    borderRadius: 10,
    borderWidth: 2,
    overflow: 'hidden',
  },
  statusOptionSelected: {
    transform: [{ scale: 1.02 }],
  },
  statusOptionGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  statusOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text,
    marginLeft: 4,
  },
  statusOptionTextSelected: {
    color: Colors.surface,
    fontWeight: '600',
  },
  summarySection: {
    padding: 20,
    borderBottomWidth: 0,
  },
  summaryGradient: {
    borderRadius: 16,
    padding: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.success,
    marginLeft: 8,
  },
  summaryContent: {
    gap: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: `${Colors.border}30`,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 2,
  },
});

export default NewAppointmentScreen;