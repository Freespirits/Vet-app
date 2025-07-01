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
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { ConsultationService } from '../../services/ConsultationService';
import { ClientService } from '../../services/ClientService';
import { PetService } from '../../services/PetService';
import { validateRequired } from '../../utils/validators';
import { formatDateTime } from '../../utils/helpers';
import { TIPOS_CONSULTA } from '../../constants/Data';
import { Colors } from '../../constants/Colors';

const CustomSelector = ({
  label,
  value,
  placeholder,
  options,
  onSelect,
  error,
  required = false,
  disabled = false,
  displayValue,
  keyExtractor = (item) => item.value || item.id,
  labelExtractor = (item) => item.label || item.name
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (option) => {
    onSelect(keyExtractor(option));
    setModalVisible(false);
  };

  const selectedOption = options.find(option => keyExtractor(option) === value);
  const displayText = displayValue || (selectedOption ? labelExtractor(selectedOption) : placeholder);

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>

      <TouchableOpacity
        style={[
          styles.selectorButton,
          error && styles.selectorError,
          disabled && styles.selectorDisabled
        ]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
      >
        <Text style={[
          styles.selectorText,
          !selectedOption && styles.selectorPlaceholder,
          disabled && styles.selectorTextDisabled
        ]}>
          {displayText}
        </Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color={disabled ? Colors.textSecondary : Colors.primary}
        />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar {label}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={keyExtractor}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    keyExtractor(item) === value && styles.optionItemSelected
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={[
                    styles.optionText,
                    keyExtractor(item) === value && styles.optionTextSelected
                  ]}>
                    {labelExtractor(item)}
                  </Text>
                  {keyExtractor(item) === value && (
                    <Ionicons name="checkmark" size={20} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadInitialData();
    if (isEditing) {
      loadConsultation();
    } else {
      setLoadingData(false);
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
      setLoadingData(true);
      const consultation = await ConsultationService.getById(consultationId);
      if (consultation) {
        setFormData({
          clientId: consultation.client_id || consultation.clientId || '',
          petId: consultation.pet_id || consultation.petId || '',
          type: consultation.type || '',
          date: consultation.date || new Date().toISOString(),
          symptoms: consultation.symptoms || '',
          diagnosis: consultation.diagnosis || '',
          treatment: consultation.treatment || '',
          prescription: consultation.prescription || '',
          observations: consultation.observations || '',
          followUpDate: consultation.follow_up_date || consultation.followUpDate || '',
          weight: consultation.weight?.toString() || '',
          temperature: consultation.temperature?.toString() || '',
          heartRate: consultation.heart_rate?.toString() || consultation.heartRate?.toString() || '',
          price: consultation.price?.toString() || ''
        });
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar dados da consulta');
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
        client_id: formData.clientId,
        pet_id: formData.petId,
        type: formData.type,
        date: formData.date || new Date().toISOString(),
        symptoms: formData.symptoms.trim(),
        diagnosis: formData.diagnosis.trim(),
        treatment: formData.treatment.trim(),
        prescription: formData.prescription.trim(),
        observations: formData.observations.trim(),
        follow_up_date: formData.followUpDate || null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        temperature: formData.temperature ? parseFloat(formData.temperature) : null,
        heart_rate: formData.heartRate ? parseInt(formData.heartRate) : null,
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
      console.error('Erro ao salvar consulta:', error);
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

  // Preparar opções para os seletores
  const clientOptions = clients.map(client => ({
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone
  }));

  const petOptions = availablePets.map(pet => ({
    id: pet.id,
    name: `${pet.name} (${pet.species})`,
    species: pet.species,
    breed: pet.breed,
    gender: pet.gender
  }));

  const typeOptions = TIPOS_CONSULTA.map(tipo => ({
    value: tipo,
    label: tipo
  }));

  const selectedClient = clients.find(client => client.id === formData.clientId);
  const selectedPet = pets.find(pet => pet.id === formData.petId) || availablePets.find(pet => pet.id === formData.petId);

  if (loadingData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando dados...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
              <Ionicons name="medical" size={28} color={Colors.surface} />
            </View>
            <View>
              <Text style={styles.headerTitle}>
                {isEditing ? 'Editar Consulta' : 'Nova Consulta'}
              </Text>
              <Text style={styles.headerSubtitle}>
                {isEditing ? 'Atualize os dados da consulta' : 'Registre uma nova consulta'}
              </Text>
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
          {/* Seção: Paciente */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="people" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Paciente</Text>
            </View>

            {/* Cliente */}
            <CustomSelector
              label="Cliente"
              value={formData.clientId}
              placeholder="Selecione o cliente"
              options={clientOptions}
              onSelect={(value) => {
                updateField('clientId', value);
                updateField('petId', ''); // Reset pet selection
              }}
              error={errors.clientId}
              required
              keyExtractor={(item) => item.id}
              labelExtractor={(item) => item.name}
            />

            {selectedClient && (
              <View style={styles.infoBox}>
                <Ionicons name="information-circle" size={16} color={Colors.info} />
                <Text style={styles.infoText}>
                  {selectedClient.email} • {selectedClient.phone}
                </Text>
              </View>
            )}

            {/* Pet */}
            <CustomSelector
              label="Pet"
              value={formData.petId}
              placeholder="Selecione o pet"
              options={petOptions}
              onSelect={(value) => updateField('petId', value)}
              error={errors.petId}
              required
              disabled={!formData.clientId}
              keyExtractor={(item) => item.id}
              labelExtractor={(item) => item.name}
            />

            {selectedPet && (
              <View style={styles.infoBox}>
                <Ionicons name="paw" size={16} color={Colors.secondary} />
                <Text style={styles.infoText}>
                  {selectedPet.species} • {selectedPet.breed || 'SRD'} • {selectedPet.gender}
                </Text>
              </View>
            )}

            {/* Tipo de Consulta */}
            <CustomSelector
              label="Tipo de Consulta"
              value={formData.type}
              placeholder="Selecione o tipo de consulta"
              options={typeOptions}
              onSelect={(value) => updateField('type', value)}
              error={errors.type}
              required
              keyExtractor={(item) => item.value}
              labelExtractor={(item) => item.label}
            />
          </View>

          {/* Seção: Sinais Vitais */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="fitness" size={20} color={Colors.success} />
              <Text style={styles.sectionTitle}>Sinais Vitais</Text>
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Input
                  label="Peso (kg)"
                  value={formData.weight}
                  onChangeText={(value) => updateField('weight', value)}
                  placeholder="0.0"
                  keyboardType="decimal-pad"
                  leftIcon="fitness"
                />
              </View>
              <View style={styles.halfWidth}>
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

          {/* Seção: Consulta */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="medical" size={20} color={Colors.error} />
              <Text style={styles.sectionTitle}>Dados da Consulta</Text>
            </View>

            <Input
              label="Sintomas"
              value={formData.symptoms}
              onChangeText={(value) => updateField('symptoms', value)}
              placeholder="Descreva os sintomas apresentados pelo animal"
              multiline
              numberOfLines={3}
              error={errors.symptoms}
              required
              autoCapitalize="sentences"
            />

            <Input
              label="Diagnóstico"
              value={formData.diagnosis}
              onChangeText={(value) => updateField('diagnosis', value)}
              placeholder="Diagnóstico ou suspeita clínica"
              multiline
              numberOfLines={3}
              autoCapitalize="sentences"
            />

            <Input
              label="Tratamento"
              value={formData.treatment}
              onChangeText={(value) => updateField('treatment', value)}
              placeholder="Tratamento realizado ou recomendado"
              multiline
              numberOfLines={3}
              autoCapitalize="sentences"
            />

            <Input
              label="Prescrição"
              value={formData.prescription}
              onChangeText={(value) => updateField('prescription', value)}
              placeholder="Medicamentos prescritos e posologia"
              multiline
              numberOfLines={3}
              autoCapitalize="sentences"
            />

            <Input
              label="Observações"
              value={formData.observations}
              onChangeText={(value) => updateField('observations', value)}
              placeholder="Observações adicionais sobre a consulta"
              multiline
              numberOfLines={2}
              autoCapitalize="sentences"
            />
          </View>

          {/* Seção: Informações Adicionais */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle" size={20} color={Colors.info} />
              <Text style={styles.sectionTitle}>Informações Adicionais</Text>
            </View>

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

          {/* Resumo da Consulta */}
          {formData.clientId && formData.petId && formData.type && (
            <View style={styles.summarySection}>
              <View style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                  <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
                  <Text style={styles.summaryTitle}>Resumo da Consulta</Text>
                </View>

                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Tipo:</Text>
                  <Text style={styles.summaryValue}>{formData.type}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Cliente:</Text>
                  <Text style={styles.summaryValue}>{selectedClient?.name}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Pet:</Text>
                  <Text style={styles.summaryValue}>{selectedPet?.name} ({selectedPet?.species})</Text>
                </View>
                {formData.price && (
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Valor:</Text>
                    <Text style={styles.summaryValue}>R$ {formData.price}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Botões de Ação */}
        <View style={styles.actionContainer}>
          <Button
            title="Cancelar"
            variant="outline"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
            disabled={loading}
          />
          <Button
            title={isEditing ? 'Atualizar' : 'Registrar'}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
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
  section: {
    backgroundColor: Colors.surface,
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 12,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  required: {
    color: Colors.error,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 50,
  },
  selectorError: {
    borderColor: Colors.error,
    borderWidth: 2,
  },
  selectorDisabled: {
    backgroundColor: Colors.background,
    opacity: 0.6,
  },
  selectorText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  selectorPlaceholder: {
    color: Colors.textSecondary,
  },
  selectorTextDisabled: {
    color: Colors.textSecondary,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 6,
    marginLeft: 4,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 12,
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    width: '90%',
    maxHeight: '70%',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: `${Colors.border}50`,
  },
  optionItemSelected: {
    backgroundColor: `${Colors.primary}10`,
  },
  optionText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  optionTextSelected: {
    color: Colors.primary,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  summarySection: {
    margin: 16,
    marginTop: 0,
  },
  summaryCard: {
    backgroundColor: `${Colors.success}10`,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.success,
    marginLeft: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    width: 80,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 16,
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
  bottomSpacing: {
    height: 100,
  },
});

export default NewConsultationScreen;
