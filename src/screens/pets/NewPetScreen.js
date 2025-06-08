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
import { PetService } from '../../services/PetService';
import { ClientService } from '../../services/ClientService';
import { validateRequired } from '../../utils/validators';
import { formatDate, calculateAge } from '../../utils/helpers';
import { ESPECIES, RACAS_CAES, RACAS_GATOS } from '../../constants/Data';
import { Colors } from '../../constants/Colors';
import { globalStyles } from '../../styles/globalStyles';

const { width } = Dimensions.get('window');

const NewPetScreen = ({ navigation, route }) => {
  const petId = route?.params?.petId;
  const selectedClientId = route?.params?.clientId;
  const isEditing = !!petId;

  const [formData, setFormData] = useState({
    name: '',
    clientId: selectedClientId || '',
    species: '',
    breed: '',
    gender: '',
    birthDate: '',
    weight: '',
    color: '',
    microchip: '',
    notes: ''
  });

  const [clients, setClients] = useState([]);
  const [availableBreeds, setAvailableBreeds] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadClients();
    if (isEditing) {
      loadPet();
    } else {
      setLoadingData(false);
    }
  }, [petId]);

  useEffect(() => {
    updateAvailableBreeds();
  }, [formData.species]);

  const loadClients = async () => {
    try {
      const clientList = await ClientService.getAll();
      setClients(clientList);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar clientes');
    }
  };

  const loadPet = async () => {
    try {
      setLoadingData(true);
      const pet = await PetService.getById(petId);
      if (pet) {
        setFormData({
          name: pet.name || '',
          clientId: pet.clientId || pet.client_id || '',
          species: pet.species || '',
          breed: pet.breed || '',
          gender: pet.gender || '',
          birthDate: pet.birthDate || pet.birth_date || '',
          weight: pet.weight?.toString() || '',
          color: pet.color || '',
          microchip: pet.microchip || '',
          notes: pet.notes || ''
        });
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar dados do pet');
    } finally {
      setLoadingData(false);
    }
  };

  const updateAvailableBreeds = () => {
    let breeds = [];
    switch (formData.species) {
      case 'Cão':
        breeds = RACAS_CAES;
        break;
      case 'Gato':
        breeds = RACAS_GATOS;
        break;
      default:
        breeds = ['SRD (Sem Raça Definida)', 'Outros'];
    }
    setAvailableBreeds(breeds);

    if (formData.breed && !breeds.includes(formData.breed)) {
      setFormData(prev => ({ ...prev, breed: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateRequired(formData.name)) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!validateRequired(formData.clientId)) {
      newErrors.clientId = 'Cliente é obrigatório';
    }

    if (!validateRequired(formData.species)) {
      newErrors.species = 'Espécie é obrigatória';
    }

    if (!validateRequired(formData.gender)) {
      newErrors.gender = 'Sexo é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Verificar se o cliente foi selecionado
    if (!formData.clientId) {
      Alert.alert('Erro', 'Por favor, selecione um cliente para o pet');
      return;
    }

    setLoading(true);
    try {
      const petData = {
        name: formData.name.trim(),
        client_id: formData.clientId,
        species: formData.species,
        breed: formData.breed || null,
        gender: formData.gender,
        birth_date: formData.birthDate || null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        color: formData.color.trim() || null,
        microchip: formData.microchip.trim() || null,
        notes: formData.notes.trim() || null
      };

      console.log('Dados do pet a serem salvos:', petData); // Debug

      let result;
      if (isEditing) {
        result = await PetService.update(petId, petData);
      } else {
        result = await PetService.create(petData);
      }

      if (result.success) {
        Alert.alert(
          'Sucesso',
          `Pet ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso!`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('Erro', result.error || 'Erro ao salvar pet');
      }
    } catch (error) {
      console.error('Erro ao salvar pet:', error);
      Alert.alert('Erro', 'Erro interno do sistema. Verifique os dados e tente novamente.');
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

  const formatBirthDate = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 4) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    }
  };

  const selectedClient = clients.find(client => client.id === formData.clientId);

  const getSpeciesIcon = (species) => {
    switch (species) {
      case 'Cão': return 'paw';
      case 'Gato': return 'paw';
      case 'Pássaro': return 'airplane';
      case 'Peixe': return 'fish';
      case 'Hamster': return 'ellipse';
      case 'Coelho': return 'ellipse';
      case 'Réptil': return 'bug';
      default: return 'heart';
    }
  };

  const getSpeciesColor = (species) => {
    switch (species) {
      case 'Cão': return Colors.primary;
      case 'Gato': return Colors.secondary;
      case 'Pássaro': return Colors.info;
      case 'Peixe': return '#00BCD4';
      case 'Hamster': return '#FF9800';
      case 'Coelho': return '#795548';
      case 'Réptil': return Colors.success;
      default: return Colors.textSecondary;
    }
  };

  if (loadingData) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <View style={[globalStyles.container, globalStyles.justifyCenter, globalStyles.alignCenter]}>
          <Text style={globalStyles.textRegular}>Carregando dados do pet...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Gradiente */}
      <LinearGradient
        colors={[Colors.secondary, Colors.accent]}
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
            <View style={styles.petIconContainer}>
              <Ionicons name="paw" size={28} color={Colors.surface} />
            </View>
            <View>
              <Text style={styles.headerTitle}>
                {isEditing ? 'Editar Pet' : 'Novo Pet'}
              </Text>
              <Text style={styles.headerSubtitle}>
                {isEditing ? 'Atualize as informações do pet' : 'Cadastre um novo amiguinho'}
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
            {/* Seção: Informações Básicas */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  style={styles.sectionIconGradient}
                >
                  <Ionicons name="heart" size={20} color={Colors.surface} />
                </LinearGradient>
                <Text style={styles.sectionTitle}>Informações Básicas</Text>
              </View>

              <View style={styles.inputContainer}>
                <Input
                  label="Nome do Pet"
                  value={formData.name}
                  onChangeText={(value) => updateField('name', value)}
                  placeholder="Como o pet se chama?"
                  leftIcon="heart"
                  error={errors.name}
                  required
                  autoCapitalize="words"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  style={styles.inputField}
                />
              </View>

              {/* Cliente Selector com design melhorado */}
              <View style={styles.pickerSection}>
                <Text style={styles.pickerLabel}>
                  Proprietário <Text style={styles.required}>*</Text>
                </Text>
                <View style={[styles.pickerContainer, errors.clientId && styles.pickerError]}>
                  <LinearGradient
                    colors={['#F8F9FA', '#FFFFFF']}
                    style={styles.pickerGradient}
                  >
                    <Ionicons name="person" size={20} color={Colors.primary} style={styles.pickerIcon} />
                    <Picker
                      selectedValue={formData.clientId}
                      onValueChange={(value) => updateField('clientId', value)}
                      style={styles.picker}
                      mode="dropdown"
                      dropdownIconColor={Colors.primary}
                    >
                      <Picker.Item label="Selecione o proprietário..." value="" />
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

              {/* Espécie com ícones visuais */}
              <View style={styles.pickerSection}>
                <Text style={styles.pickerLabel}>
                  Espécie <Text style={styles.required}>*</Text>
                </Text>
                <View style={[styles.speciesContainer, errors.species && styles.pickerError]}>
                  {ESPECIES.map(especie => (
                    <TouchableOpacity
                      key={especie}
                      style={[
                        styles.speciesOption,
                        formData.species === especie && styles.speciesOptionSelected,
                        { borderColor: getSpeciesColor(especie) }
                      ]}
                      onPress={() => {
                        updateField('species', especie);
                        updateField('breed', '');
                      }}
                    >
                      <LinearGradient
                        colors={formData.species === especie ?
                          [getSpeciesColor(especie), `${getSpeciesColor(especie)}CC`] :
                          ['transparent', 'transparent']
                        }
                        style={styles.speciesOptionGradient}
                      >
                        <Ionicons
                          name={getSpeciesIcon(especie)}
                          size={24}
                          color={formData.species === especie ? Colors.surface : getSpeciesColor(especie)}
                        />
                        <Text style={[
                          styles.speciesOptionText,
                          formData.species === especie && styles.speciesOptionTextSelected
                        ]}>
                          {especie}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.species && <Text style={styles.errorText}>{errors.species}</Text>}
              </View>

              {/* Raça */}
              <View style={styles.pickerSection}>
                <Text style={styles.pickerLabel}>Raça</Text>
                <View style={[styles.pickerContainer, !formData.species && styles.pickerDisabled]}>
                  <LinearGradient
                    colors={formData.species ? ['#F8F9FA', '#FFFFFF'] : ['#F5F5F5', '#F0F0F0']}
                    style={styles.pickerGradient}
                  >
                    <Ionicons
                      name="paw"
                      size={20}
                      color={formData.species ? Colors.primary : Colors.textSecondary}
                      style={styles.pickerIcon}
                    />
                    <Picker
                      selectedValue={formData.breed}
                      onValueChange={(value) => updateField('breed', value)}
                      style={styles.picker}
                      enabled={formData.species !== ''}
                      mode="dropdown"
                      dropdownIconColor={formData.species ? Colors.primary : Colors.textSecondary}
                    >
                      <Picker.Item label="Selecione a raça..." value="" />
                      {availableBreeds.map(raca => (
                        <Picker.Item key={raca} label={raca} value={raca} />
                      ))}
                    </Picker>
                  </LinearGradient>
                </View>
              </View>

              {/* Sexo com botões visuais */}
              <View style={styles.pickerSection}>
                <Text style={styles.pickerLabel}>
                  Sexo <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.genderContainer}>
                  <TouchableOpacity
                    style={[
                      styles.genderOption,
                      formData.gender === 'Macho' && styles.genderOptionSelected,
                      { borderColor: Colors.info }
                    ]}
                    onPress={() => updateField('gender', 'Macho')}
                  >
                    <LinearGradient
                      colors={formData.gender === 'Macho' ?
                        [Colors.info, `${Colors.info}CC`] :
                        ['transparent', 'transparent']
                      }
                      style={styles.genderOptionGradient}
                    >
                      <Ionicons
                        name="male"
                        size={24}
                        color={formData.gender === 'Macho' ? Colors.surface : Colors.info}
                      />
                      <Text style={[
                        styles.genderOptionText,
                        formData.gender === 'Macho' && styles.genderOptionTextSelected
                      ]}>
                        Macho
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.genderOption,
                      formData.gender === 'Fêmea' && styles.genderOptionSelected,
                      { borderColor: Colors.warning }
                    ]}
                    onPress={() => updateField('gender', 'Fêmea')}
                  >
                    <LinearGradient
                      colors={formData.gender === 'Fêmea' ?
                        [Colors.warning, `${Colors.warning}CC`] :
                        ['transparent', 'transparent']
                      }
                      style={styles.genderOptionGradient}
                    >
                      <Ionicons
                        name="female"
                        size={24}
                        color={formData.gender === 'Fêmea' ? Colors.surface : Colors.warning}
                      />
                      <Text style={[
                        styles.genderOptionText,
                        formData.gender === 'Fêmea' && styles.genderOptionTextSelected
                      ]}>
                        Fêmea
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
                {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
              </View>
            </View>

            {/* Seção: Detalhes Físicos */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <LinearGradient
                  colors={[Colors.secondary, Colors.accent]}
                  style={styles.sectionIconGradient}
                >
                  <Ionicons name="fitness" size={20} color={Colors.surface} />
                </LinearGradient>
                <Text style={styles.sectionTitle}>Detalhes Físicos</Text>
              </View>

              <Input
                label="Data de Nascimento"
                value={formData.birthDate}
                onChangeText={(value) => updateField('birthDate', formatBirthDate(value))}
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
                leftIcon="calendar"
                maxLength={10}
                returnKeyType="next"
                blurOnSubmit={false}
                style={styles.inputField}
              />

              {formData.birthDate && formData.birthDate.length === 10 && (
                <View style={styles.ageDisplay}>
                  <LinearGradient
                    colors={[Colors.success, `${Colors.success}20`]}
                    style={styles.ageGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Ionicons name="time" size={16} color={Colors.surface} />
                    <Text style={styles.ageText}>
                      Idade: {calculateAge(formData.birthDate)}
                    </Text>
                  </LinearGradient>
                </View>
              )}

              <View style={styles.rowInputs}>
                <View style={styles.halfInput}>
                  <Input
                    label="Peso (kg)"
                    value={formData.weight}
                    onChangeText={(value) => updateField('weight', value)}
                    placeholder="5.2"
                    keyboardType="decimal-pad"
                    leftIcon="fitness"
                    returnKeyType="next"
                    blurOnSubmit={false}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Input
                    label="Cor Principal"
                    value={formData.color}
                    onChangeText={(value) => updateField('color', value)}
                    placeholder="Dourado"
                    leftIcon="color-palette"
                    autoCapitalize="words"
                    returnKeyType="next"
                    blurOnSubmit={false}
                  />
                </View>
              </View>

              <Input
                label="Microchip"
                value={formData.microchip}
                onChangeText={(value) => updateField('microchip', value)}
                placeholder="Número do microchip (opcional)"
                leftIcon="radio"
                returnKeyType="next"
                blurOnSubmit={false}
                style={styles.inputField}
              />
            </View>

            {/* Seção: Observações */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <LinearGradient
                  colors={[Colors.info, `${Colors.info}CC`]}
                  style={styles.sectionIconGradient}
                >
                  <Ionicons name="document-text" size={20} color={Colors.surface} />
                </LinearGradient>
                <Text style={styles.sectionTitle}>Observações</Text>
              </View>

              <Input
                label="Observações Especiais"
                value={formData.notes}
                onChangeText={(value) => updateField('notes', value)}
                placeholder="Temperamento, alergias, medicamentos contínuos..."
                multiline
                numberOfLines={4}
                maxLength={500}
                autoCapitalize="sentences"
                returnKeyType="done"
                blurOnSubmit={true}
                style={styles.textAreaField}
              />
            </View>
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
              title={isEditing ? 'Atualizar Pet' : 'Cadastrar Pet'}
              onPress={handleSave}
              loading={loading}
              style={styles.saveButton}
              icon={<Ionicons name={isEditing ? "checkmark" : "add"} size={16} color={Colors.surface} />}
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
  petIconContainer: {
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
  inputContainer: {
    marginBottom: 16,
  },
  inputField: {
    marginBottom: 0,
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
  speciesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  speciesOption: {
    width: (width - 88) / 3,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
  },
  speciesOptionSelected: {
    transform: [{ scale: 1.05 }],
  },
  speciesOptionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  speciesOptionText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.text,
    marginTop: 4,
    textAlign: 'center',
  },
  speciesOptionTextSelected: {
    color: Colors.surface,
    fontWeight: '600',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  genderOption: {
    flex: 1,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
  },
  genderOptionSelected: {
    transform: [{ scale: 1.02 }],
  },
  genderOptionGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  genderOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginLeft: 8,
  },
  genderOptionTextSelected: {
    color: Colors.surface,
    fontWeight: '600',
  },
  ageDisplay: {
    marginTop: -8,
    marginBottom: 16,
    overflow: 'hidden',
    borderRadius: 8,
  },
  ageGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  ageText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.surface,
    marginLeft: 8,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 16,
  },
  halfInput: {
    flex: 1,
  },
  textAreaField: {
    marginBottom: 0,
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

export default NewPetScreen;