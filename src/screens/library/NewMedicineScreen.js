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
import { MedicineService } from '../../services/MedicineService';
import { validateRequired } from '../../utils/validators';
import { Colors } from '../../constants/Colors';
import { globalStyles } from '../../styles/globalStyles';

const { width } = Dimensions.get('window');

const NewMedicineScreen = ({ navigation, route }) => {
  const medicineId = route?.params?.medicineId;
  const isEditing = !!medicineId;

  const [formData, setFormData] = useState({
    name: '',
    activeIngredient: '',
    concentration: '',
    form: '',
    manufacturer: '',
    indication: '',
    dosage: '',
    contraindications: '',
    sideEffects: '',
    storage: '',
    expirationDate: '',
    batchNumber: '',
    registrationNumber: '',
    price: '',
    stock: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const medicationForms = [
    { value: 'Comprimido', icon: 'medical', color: Colors.primary },
    { value: 'Cápsula', icon: 'ellipse', color: Colors.secondary },
    { value: 'Xarope', icon: 'water', color: '#FF9800' },
    { value: 'Injeção', icon: 'medical', color: Colors.error },
    { value: 'Pomada', icon: 'bandage', color: Colors.success },
    { value: 'Colírio', icon: 'eye', color: Colors.info },
    { value: 'Spray', icon: 'cloud', color: '#9C27B0' },
    { value: 'Pó', icon: 'snow', color: '#795548' },
  ];

  const storageConditions = [
    { value: 'Temperatura ambiente', icon: 'thermometer', color: Colors.primary },
    { value: 'Refrigerado (2-8°C)', icon: 'snow', color: Colors.info },
    { value: 'Congelado (-18°C)', icon: 'ice-cream', color: '#00BCD4' },
    { value: 'Proteger da luz', icon: 'sunny', color: Colors.warning },
    { value: 'Local seco', icon: 'water-outline', color: Colors.success },
  ];

  useEffect(() => {
    if (isEditing) {
      loadMedicine();
    } else {
      setLoadingData(false);
    }
  }, [medicineId]);

  const loadMedicine = async () => {
    try {
      setLoadingData(true);
      const medicine = await MedicineService.getById(medicineId);
      if (medicine) {
        setFormData({
          name: medicine.name || '',
          activeIngredient: medicine.activeIngredient || medicine.active_ingredient || '',
          concentration: medicine.concentration || '',
          form: medicine.form || '',
          manufacturer: medicine.manufacturer || '',
          indication: medicine.indication || '',
          dosage: medicine.dosage || '',
          contraindications: medicine.contraindications || '',
          sideEffects: medicine.sideEffects || medicine.side_effects || '',
          storage: medicine.storage || '',
          expirationDate: medicine.expirationDate || medicine.expiration_date || '',
          batchNumber: medicine.batchNumber || medicine.batch_number || '',
          registrationNumber: medicine.registrationNumber || medicine.registration_number || '',
          price: medicine.price?.toString() || '',
          stock: medicine.stock?.toString() || '',
          notes: medicine.notes || ''
        });
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar dados do medicamento');
    } finally {
      setLoadingData(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateRequired(formData.name)) {
      newErrors.name = 'Nome do medicamento é obrigatório';
    }

    if (!validateRequired(formData.activeIngredient)) {
      newErrors.activeIngredient = 'Princípio ativo é obrigatório';
    }

    if (!validateRequired(formData.form)) {
      newErrors.form = 'Forma farmacêutica é obrigatória';
    }

    if (!validateRequired(formData.indication)) {
      newErrors.indication = 'Indicação é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const medicineData = {
        name: formData.name.trim(),
        active_ingredient: formData.activeIngredient.trim(),
        concentration: formData.concentration.trim(),
        form: formData.form,
        manufacturer: formData.manufacturer.trim(),
        indication: formData.indication.trim(),
        dosage: formData.dosage.trim(),
        contraindications: formData.contraindications.trim(),
        side_effects: formData.sideEffects.trim(),
        storage: formData.storage,
        expiration_date: formData.expirationDate || null,
        batch_number: formData.batchNumber.trim(),
        registration_number: formData.registrationNumber.trim(),
        price: formData.price ? parseFloat(formData.price) : null,
        stock: formData.stock ? parseInt(formData.stock) : null,
        notes: formData.notes.trim()
      };

      let result;
      if (isEditing) {
        result = await MedicineService.update(medicineId, medicineData);
      } else {
        result = await MedicineService.create(medicineData);
      }

      if (result.success) {
        Alert.alert(
          'Sucesso', 
          `Medicamento ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso!`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('Erro', result.error);
      }
    } catch (error) {
      console.error('Erro ao salvar medicamento:', error);
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

  const formatExpirationDate = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 4) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    }
  };

  const formatPrice = (text) => {
    const cleaned = text.replace(/[^\d.,]/g, '');
    return cleaned;
  };

  if (loadingData) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <View style={[globalStyles.container, globalStyles.justifyCenter, globalStyles.alignCenter]}>
          <Text style={globalStyles.textRegular}>Carregando dados do medicamento...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Gradiente */}
      <LinearGradient
        colors={[Colors.success, '#4CAF50']}
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
            <View style={styles.medicineIconContainer}>
              <Ionicons name="medical" size={28} color={Colors.surface} />
            </View>
            <View>
              <Text style={styles.headerTitle}>
                {isEditing ? 'Editar Medicamento' : 'Novo Medicamento'}
              </Text>
              <Text style={styles.headerSubtitle}>
                {isEditing ? 'Atualize as informações do medicamento' : 'Cadastre um novo medicamento'}
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
                  <Ionicons name="information-circle" size={20} color={Colors.surface} />
                </LinearGradient>
                <Text style={styles.sectionTitle}>Informações Básicas</Text>
              </View>
              
              <Input
                label="Nome do Medicamento"
                value={formData.name}
                onChangeText={(value) => updateField('name', value)}
                placeholder="Ex: Amoxicilina"
                leftIcon="medical"
                error={errors.name}
                required
                autoCapitalize="words"
                returnKeyType="next"
                blurOnSubmit={false}
                style={styles.inputField}
              />

              <Input
                label="Princípio Ativo"
                value={formData.activeIngredient}
                onChangeText={(value) => updateField('activeIngredient', value)}
                placeholder="Ex: Amoxicilina tri-hidratada"
                leftIcon="flask"
                error={errors.activeIngredient}
                required
                autoCapitalize="words"
                returnKeyType="next"
                blurOnSubmit={false}
                style={styles.inputField}
              />

              <View style={styles.rowInputs}>
                <View style={styles.halfInput}>
                  <Input
                    label="Concentração"
                    value={formData.concentration}
                    onChangeText={(value) => updateField('concentration', value)}
                    placeholder="Ex: 500mg"
                    leftIcon="speedometer"
                    returnKeyType="next"
                    blurOnSubmit={false}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Input
                    label="Fabricante"
                    value={formData.manufacturer}
                    onChangeText={(value) => updateField('manufacturer', value)}
                    placeholder="Ex: Laboratório XYZ"
                    leftIcon="business"
                    autoCapitalize="words"
                    returnKeyType="next"
                    blurOnSubmit={false}
                  />
                </View>
              </View>

              {/* Forma Farmacêutica */}
              <View style={styles.pickerSection}>
                <Text style={styles.pickerLabel}>
                  Forma Farmacêutica <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.formsContainer}>
                  {medicationForms.map(form => (
                    <TouchableOpacity
                      key={form.value}
                      style={[
                        styles.formOption,
                        formData.form === form.value && styles.formOptionSelected,
                        { borderColor: form.color }
                      ]}
                      onPress={() => updateField('form', form.value)}
                    >
                      <LinearGradient
                        colors={formData.form === form.value ? 
                          [form.color, `${form.color}CC`] : 
                          ['transparent', 'transparent']
                        }
                        style={styles.formOptionGradient}
                      >
                        <Ionicons 
                          name={form.icon} 
                          size={20} 
                          color={formData.form === form.value ? Colors.surface : form.color} 
                        />
                        <Text style={[
                          styles.formOptionText,
                          formData.form === form.value && styles.formOptionTextSelected
                        ]}>
                          {form.value}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.form && <Text style={styles.errorText}>{errors.form}</Text>}
              </View>
            </View>

            {/* Seção: Indicações e Dosagem */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <LinearGradient
                  colors={[Colors.info, `${Colors.info}CC`]}
                  style={styles.sectionIconGradient}
                >
                  <Ionicons name="fitness" size={20} color={Colors.surface} />
                </LinearGradient>
                <Text style={styles.sectionTitle}>Indicações e Dosagem</Text>
              </View>
              
              <Input
                label="Indicações"
                value={formData.indication}
                onChangeText={(value) => updateField('indication', value)}
                placeholder="Para que é indicado este medicamento?"
                leftIcon="heart"
                error={errors.indication}
                required
                multiline
                numberOfLines={3}
                autoCapitalize="sentences"
                returnKeyType="next"
                blurOnSubmit={false}
                style={styles.textAreaField}
              />

              <Input
                label="Dosagem e Posologia"
                value={formData.dosage}
                onChangeText={(value) => updateField('dosage', value)}
                placeholder="Como administrar? Dose recomendada?"
                leftIcon="timer"
                multiline
                numberOfLines={3}
                autoCapitalize="sentences"
                returnKeyType="next"
                blurOnSubmit={false}
                style={styles.textAreaField}
              />

              <Input
                label="Contraindicações"
                value={formData.contraindications}
                onChangeText={(value) => updateField('contraindications', value)}
                placeholder="Quando NÃO usar este medicamento?"
                leftIcon="warning"
                multiline
                numberOfLines={2}
                autoCapitalize="sentences"
                returnKeyType="next"
                blurOnSubmit={false}
                style={styles.textAreaField}
              />

              <Input
                label="Efeitos Colaterais"
                value={formData.sideEffects}
                onChangeText={(value) => updateField('sideEffects', value)}
                placeholder="Possíveis efeitos adversos"
                leftIcon="alert-circle"
                multiline
                numberOfLines={2}
                autoCapitalize="sentences"
                returnKeyType="next"
                blurOnSubmit={false}
                style={styles.textAreaField}
              />
            </View>

            {/* Seção: Armazenamento */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <LinearGradient
                  colors={[Colors.warning, `${Colors.warning}CC`]}
                  style={styles.sectionIconGradient}
                >
                  <Ionicons name="archive" size={20} color={Colors.surface} />
                </LinearGradient>
                <Text style={styles.sectionTitle}>Armazenamento</Text>
              </View>
              
              {/* Condições de Armazenamento */}
              <View style={styles.pickerSection}>
                <Text style={styles.pickerLabel}>Condições de Armazenamento</Text>
                <View style={styles.storageContainer}>
                  {storageConditions.map(condition => (
                    <TouchableOpacity
                      key={condition.value}
                      style={[
                        styles.storageOption,
                        formData.storage === condition.value && styles.storageOptionSelected,
                        { borderColor: condition.color }
                      ]}
                      onPress={() => updateField('storage', condition.value)}
                    >
                      <LinearGradient
                        colors={formData.storage === condition.value ? 
                          [condition.color, `${condition.color}CC`] : 
                          ['transparent', 'transparent']
                        }
                        style={styles.storageOptionGradient}
                      >
                        <Ionicons 
                          name={condition.icon} 
                          size={18} 
                          color={formData.storage === condition.value ? Colors.surface : condition.color} 
                        />
                        <Text style={[
                          styles.storageOptionText,
                          formData.storage === condition.value && styles.storageOptionTextSelected
                        ]}>
                          {condition.value}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.rowInputs}>
                <View style={styles.halfInput}>
                  <Input
                    label="Data de Validade"
                    value={formData.expirationDate}
                    onChangeText={(value) => updateField('expirationDate', formatExpirationDate(value))}
                    placeholder="DD/MM/AAAA"
                    keyboardType="numeric"
                    leftIcon="calendar"
                    maxLength={10}
                    returnKeyType="next"
                    blurOnSubmit={false}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Input
                    label="Número do Lote"
                    value={formData.batchNumber}
                    onChangeText={(value) => updateField('batchNumber', value)}
                    placeholder="Ex: LOT123456"
                    leftIcon="barcode"
                    returnKeyType="next"
                    blurOnSubmit={false}
                  />
                </View>
              </View>

              <Input
                label="Registro ANVISA"
                value={formData.registrationNumber}
                onChangeText={(value) => updateField('registrationNumber', value)}
                placeholder="Número de registro na ANVISA"
                leftIcon="document-text"
                returnKeyType="next"
                blurOnSubmit={false}
                style={styles.inputField}
              />
            </View>

            {/* Seção: Controle de Estoque */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <LinearGradient
                  colors={[Colors.secondary, Colors.accent]}
                  style={styles.sectionIconGradient}
                >
                  <Ionicons name="layers" size={20} color={Colors.surface} />
                </LinearGradient>
                <Text style={styles.sectionTitle}>Controle de Estoque</Text>
              </View>
              
              <View style={styles.rowInputs}>
                <View style={styles.halfInput}>
                  <Input
                    label="Preço (R$)"
                    value={formData.price}
                    onChangeText={(value) => updateField('price', formatPrice(value))}
                    placeholder="0,00"
                    keyboardType="decimal-pad"
                    leftIcon="cash"
                    returnKeyType="next"
                    blurOnSubmit={false}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Input
                    label="Estoque Atual"
                    value={formData.stock}
                    onChangeText={(value) => updateField('stock', value)}
                    placeholder="Quantidade"
                    keyboardType="numeric"
                    leftIcon="cube"
                    returnKeyType="next"
                    blurOnSubmit={false}
                  />
                </View>
              </View>

              <Input
                label="Observações Gerais"
                value={formData.notes}
                onChangeText={(value) => updateField('notes', value)}
                placeholder="Informações adicionais sobre o medicamento"
                multiline
                numberOfLines={3}
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
              title={isEditing ? 'Atualizar' : 'Cadastrar'}
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
  medicineIconContainer: {
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
    marginBottom: 16,
  },
  textAreaField: {
    marginBottom: 16,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
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
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 6,
    marginLeft: 4,
  },
  formsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  formOption: {
    width: (width - 88) / 2,
    height: 70,
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
  },
  formOptionSelected: {
    transform: [{ scale: 1.02 }],
  },
  formOptionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  formOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text,
    marginTop: 6,
    textAlign: 'center',
  },
  formOptionTextSelected: {
    color: Colors.surface,
    fontWeight: '600',
  },
  storageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  storageOption: {
    width: (width - 88) / 2,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
  },
  storageOptionSelected: {
    transform: [{ scale: 1.02 }],
  },
  storageOptionGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  storageOptionText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.text,
    marginLeft: 6,
    textAlign: 'center',
  },
  storageOptionTextSelected: {
    color: Colors.surface,
    fontWeight: '600',
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

export default NewMedicineScreen;