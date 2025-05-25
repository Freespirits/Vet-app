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
import { PetService } from '../../services/PetService';
import { ClientService } from '../../services/ClientService';
import { validateRequired } from '../../utils/validators';
import { formatDate, calculateAge } from '../../utils/helpers';
import { ESPECIES, RACAS_CAES, RACAS_GATOS } from '../../constants/Data';
import { Colors } from '../../constants/Colors';
import { globalStyles } from '../../styles/globalStyles';

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

  useEffect(() => {
    loadClients();
    if (isEditing) {
      loadPet();
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
      const pet = await PetService.getById(petId);
      if (pet) {
        setFormData(pet);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar dados do pet');
    }
  };

  const updateAvailableBreeds = () => {
    switch (formData.species) {
      case 'Cão':
        setAvailableBreeds(RACAS_CAES);
        break;
      case 'Gato':
        setAvailableBreeds(RACAS_GATOS);
        break;
      default:
        setAvailableBreeds(['SRD (Sem Raça Definida)', 'Outros']);
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
    if (!validateForm()) return;

    setLoading(true);
    try {
      let result;
      if (isEditing) {
        result = await PetService.update(petId, formData);
      } else {
        result = await PetService.create(formData);
      }

      if (result.success) {
        Alert.alert(
          'Sucesso', 
          `Pet ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso!`,
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

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={globalStyles.keyboardView}
      >
        <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
          <Card>
            <View style={styles.header}>
              <Ionicons name="paw" size={24} color={Colors.primary} />
              <Text style={styles.title}>
                {isEditing ? 'Editar Pet' : 'Novo Pet'}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informações Básicas</Text>
              
              <Input
                label="Nome do Pet"
                value={formData.name}
                onChangeText={(value) => updateField('name', value)}
                placeholder="Nome do animal"
                leftIcon="heart"
                error={errors.name}
                required
              />

              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>
                  Cliente <Text style={styles.required}>*</Text>
                </Text>
                <View style={[styles.pickerWrapper, errors.clientId && styles.pickerWrapperError]}>
                  <Picker
                    selectedValue={formData.clientId}
                    onValueChange={(value) => updateField('clientId', value)}
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
                  Espécie <Text style={styles.required}>*</Text>
                </Text>
                <View style={[styles.pickerWrapper, errors.species && styles.pickerWrapperError]}>
                  <Picker
                    selectedValue={formData.species}
                    onValueChange={(value) => updateField('species', value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Selecione a espécie..." value="" />
                    {ESPECIES.map(especie => (
                      <Picker.Item key={especie} label={especie} value={especie} />
                    ))}
                  </Picker>
                </View>
                {errors.species && <Text style={styles.errorText}>{errors.species}</Text>}
              </View>

              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Raça</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={formData.breed}
                    onValueChange={(value) => updateField('breed', value)}
                    style={styles.picker}
                    enabled={formData.species !== ''}
                  >
                    <Picker.Item label="Selecione a raça..." value="" />
                    {availableBreeds.map(raca => (
                      <Picker.Item key={raca} label={raca} value={raca} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>
                  Sexo <Text style={styles.required}>*</Text>
                </Text>
                <View style={[styles.pickerWrapper, errors.gender && styles.pickerWrapperError]}>
                  <Picker
                    selectedValue={formData.gender}
                    onValueChange={(value) => updateField('gender', value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Selecione o sexo..." value="" />
                    <Picker.Item label="Macho" value="Macho" />
                    <Picker.Item label="Fêmea" value="Fêmea" />
                  </Picker>
                </View>
                {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Detalhes Físicos</Text>
              
              <Input
                label="Data de Nascimento"
                value={formData.birthDate}
                onChangeText={(value) => updateField('birthDate', formatBirthDate(value))}
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
                leftIcon="calendar"
                maxLength={10}
              />

              {formData.birthDate && formData.birthDate.length === 10 && (
                <Text style={styles.ageInfo}>
                  Idade: {calculateAge(formData.birthDate)}
                </Text>
              )}

              <Input
                label="Peso (kg)"
                value={formData.weight}
                onChangeText={(value) => updateField('weight', value)}
                placeholder="Ex: 5.2"
                keyboardType="decimal-pad"
                leftIcon="fitness"
              />

              <Input
                label="Cor"
                value={formData.color}
                onChangeText={(value) => updateField('color', value)}
                placeholder="Cor predominante"
                leftIcon="color-palette"
              />

              <Input
                label="Microchip"
                value={formData.microchip}
                onChangeText={(value) => updateField('microchip', value)}
                placeholder="Número do microchip"
                leftIcon="radio"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Observações</Text>
              
              <Input
                label="Observações"
                value={formData.notes}
                onChangeText={(value) => updateField('notes', value)}
                placeholder="Observações sobre o pet (temperamento, alergias, etc.)"
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
  ageInfo: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginTop: -8,
    marginBottom: 16,
    textAlign: 'center',
    backgroundColor: Colors.background,
    padding: 8,
    borderRadius: 6,
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

export default NewPetScreen;