import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  StyleSheet,
  Dimensions,
  RefreshControl,
  Modal,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import SearchBar from '../../components/common/SearchBar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { LibraryService } from '../../services/LibraryService';
import { Colors } from '../../constants/Colors';

const { width } = Dimensions.get('window');

const VetLibraryScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    category: 'medicamento',
    description: '',
    dosage: '',
    frequency: '',
    contraindications: '',
    observations: '',
    species: '',
    diseases: '',
    schedule: '',
    booster: '',
    duration: '',
    price: '',
  });

  const categories = [
    { id: 'all', name: 'Todos', icon: 'medical', color: Colors.primary },
    { id: 'medicamento', name: 'Medicamentos', icon: 'medical', color: Colors.success },
    { id: 'vacina', name: 'Vacinas', icon: 'shield-checkmark', color: Colors.info },
    { id: 'procedimento', name: 'Procedimentos', icon: 'cut', color: Colors.warning },
    { id: 'exame', name: 'Exames', icon: 'search', color: Colors.error },
    { id: 'tratamento', name: 'Tratamentos', icon: 'fitness', color: Colors.secondary },
  ];

  const speciesOptions = ['Cão', 'Gato', 'Aves', 'Bovinos', 'Equinos', 'Suínos', 'Todos'];

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      setLoading(true);
      const data = await LibraryService.getAll();
      setMedications(data);
    } catch (error) {
      console.error('Erro ao carregar medicamentos:', error);
      Alert.alert('Erro', 'Erro ao carregar a biblioteca de medicamentos');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMedications();
    setRefreshing(false);
  };

  const filteredMedications = medications.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         med.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || med.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleMedicationPress = (medication) => {
    Alert.alert(
      medication.name,
      `Categoria: ${medication.category}\n\nDescrição: ${medication.description || 'Não informada'}\n\nDosagem: ${medication.dosage || 'Não informada'}\nFrequência: ${medication.frequency || 'Não informada'}\n\nEspécies: ${medication.species || 'Não informada'}\n\nContraindicações: ${medication.contraindications || 'Não informadas'}`,
      [
        { text: 'OK' },
        { text: 'Editar', onPress: () => openEditModal(medication) }
      ],
      { cancelable: true }
    );
  };

  const openAddModal = () => {
    setEditingMedication(null);
    setFormData({
      name: '',
      category: 'medicamento',
      description: '',
      dosage: '',
      frequency: '',
      contraindications: '',
      observations: '',
      species: '',
      diseases: '',
      schedule: '',
      booster: '',
      duration: '',
      price: '',
    });
    setModalVisible(true);
  };

  const openEditModal = (medication) => {
    setEditingMedication(medication);
    setFormData({
      name: medication.name || '',
      category: medication.category || 'medicamento',
      description: medication.description || '',
      dosage: medication.dosage || '',
      frequency: medication.frequency || '',
      contraindications: medication.contraindications || '',
      observations: medication.observations || '',
      species: medication.species || '',
      diseases: Array.isArray(medication.diseases) ? medication.diseases.join(', ') : (medication.diseases || ''),
      schedule: medication.schedule || '',
      booster: medication.booster || '',
      duration: medication.duration?.toString() || '',
      price: medication.price?.toString() || '',
    });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingMedication(null);
    setFormData({
      name: '',
      category: 'medicamento',
      description: '',
      dosage: '',
      frequency: '',
      contraindications: '',
      observations: '',
      species: '',
      diseases: '',
      schedule: '',
      booster: '',
      duration: '',
      price: '',
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return;
    }

    setSaving(true);
    try {
      const medicationData = {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim(),
        dosage: formData.dosage.trim(),
        frequency: formData.frequency.trim(),
        contraindications: formData.contraindications.trim(),
        observations: formData.observations.trim(),
        species: formData.species.trim(),
        diseases: formData.diseases.split(',').map(d => d.trim()).filter(d => d),
        schedule: formData.schedule.trim(),
        booster: formData.booster.trim(),
        duration: formData.duration ? parseInt(formData.duration) : null,
        price: formData.price ? parseFloat(formData.price) : null,
      };

      let result;
      if (editingMedication) {
        result = await LibraryService.update(editingMedication.id, medicationData);
      } else {
        result = await LibraryService.create(medicationData);
      }

      if (result.success) {
        closeModal();
        await loadMedications();
        Alert.alert(
          'Sucesso',
          `${editingMedication ? 'Medicamento atualizado' : 'Medicamento adicionado'} com sucesso!`
        );
      } else {
        Alert.alert('Erro', result.error || 'Erro ao salvar medicamento');
      }
    } catch (error) {
      console.error('Erro ao salvar medicamento:', error);
      Alert.alert('Erro', 'Erro interno do sistema');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (medication) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir "${medication.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await LibraryService.delete(medication.id);
              if (result.success) {
                await loadMedications();
                Alert.alert('Sucesso', 'Medicamento excluído com sucesso');
              } else {
                Alert.alert('Erro', result.error || 'Erro ao excluir medicamento');
              }
            } catch (error) {
              console.error('Erro ao excluir medicamento:', error);
              Alert.alert('Erro', 'Erro interno do sistema');
            }
          }
        }
      ]
    );
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getCategoryColor = (category) => {
    const categoryConfig = categories.find(cat => cat.id === category);
    return categoryConfig ? categoryConfig.color : Colors.textSecondary;
  };

  const getCategoryIcon = (category) => {
    const categoryConfig = categories.find(cat => cat.id === category);
    return categoryConfig ? categoryConfig.icon : 'medical';
  };

  const renderMedicationCard = (medication) => (
    <TouchableOpacity
      key={medication.id}
      style={styles.medicationCard}
      onPress={() => handleMedicationPress(medication)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={[Colors.surface, '#FAFAFA']}
        style={styles.medicationGradient}
      >
        <View style={styles.medicationHeader}>
          <View style={[styles.categoryBadge, { backgroundColor: `${getCategoryColor(medication.category)}20` }]}>
            <Ionicons 
              name={getCategoryIcon(medication.category)} 
              size={16} 
              color={getCategoryColor(medication.category)} 
            />
          </View>
          <View style={styles.medicationInfo}>
            <Text style={styles.medicationName}>{medication.name}</Text>
            <Text style={styles.medicationCategory}>{medication.category}</Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(medication)}
          >
            <Ionicons name="trash" size={16} color={Colors.error} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.medicationDescription} numberOfLines={2}>
          {medication.description || 'Sem descrição'}
        </Text>
        
        <View style={styles.medicationDetails}>
          {medication.dosage && (
            <View style={styles.detailItem}>
              <Ionicons name="scale" size={14} color={Colors.primary} />
              <Text style={styles.detailText}>{medication.dosage}</Text>
            </View>
          )}
          {medication.frequency && (
            <View style={styles.detailItem}>
              <Ionicons name="time" size={14} color={Colors.primary} />
              <Text style={styles.detailText}>{medication.frequency}</Text>
            </View>
          )}
        </View>
        
        {medication.species && (
          <View style={styles.speciesContainer}>
            <View style={styles.speciesBadge}>
              <Text style={styles.speciesText}>{medication.species}</Text>
            </View>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTitleContainer}>
            <View style={styles.headerIconContainer}>
              <Ionicons name="library" size={28} color={Colors.surface} />
            </View>
            <View>
              <Text style={styles.headerTitle}>Biblioteca Veterinária</Text>
              <Text style={styles.headerSubtitle}>Medicamentos e protocolos</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Buscar medicamento..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
          style={styles.searchBar}
        />
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                activeCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => setActiveCategory(category.id)}
            >
              <LinearGradient
                colors={activeCategory === category.id ? 
                  [category.color, `${category.color}CC`] : 
                  ['transparent', 'transparent']
                }
                style={styles.categoryGradient}
              >
                <Ionicons 
                  name={category.icon} 
                  size={16} 
                  color={activeCategory === category.id ? Colors.surface : category.color} 
                />
                <Text style={[
                  styles.categoryText,
                  activeCategory === category.id && styles.categoryTextActive
                ]}>
                  {category.name}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Medications List */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredMedications.length} item{filteredMedications.length !== 1 ? 's' : ''} encontrado{filteredMedications.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        ) : filteredMedications.length === 0 ? (
          <View style={styles.emptyState}>
            <LinearGradient
              colors={[`${Colors.textSecondary}10`, 'transparent']}
              style={styles.emptyGradient}
            >
              <Ionicons name="search" size={64} color={Colors.textSecondary} />
              <Text style={styles.emptyTitle}>Nenhum item encontrado</Text>
              <Text style={styles.emptyDescription}>
                {searchQuery ? 'Tente ajustar os filtros ou termos de busca' : 'Adicione o primeiro item à sua biblioteca'}
              </Text>
              <Button
                title="Adicionar Item"
                onPress={openAddModal}
                style={styles.addButton}
                icon={<Ionicons name="add" size={16} color={Colors.surface} />}
              />
            </LinearGradient>
          </View>
        ) : (
          <View style={styles.medicationsList}>
            {filteredMedications.map(renderMedicationCard)}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={openAddModal}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.fabGradient}
          >
            <Ionicons name="add" size={24} color={Colors.surface} />
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.fabLabel}>Adicionar</Text>
      </View>

      {/* Modal para Adicionar/Editar */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Modal Header */}
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.modalHeader}
          >
            <View style={styles.modalHeaderContent}>
              <TouchableOpacity onPress={closeModal} style={styles.modalCloseButton}>
                <Ionicons name="close" size={24} color={Colors.surface} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {editingMedication ? 'Editar Item' : 'Novo Item'}
              </Text>
              <View style={styles.modalHeaderSpacer} />
            </View>
          </LinearGradient>

          {/* Modal Content */}
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalKeyboardView}
          >
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.formContainer}>
                <Input
                  label="Nome"
                  value={formData.name}
                  onChangeText={(value) => updateField('name', value)}
                  placeholder="Nome do medicamento/procedimento"
                  required
                  autoCapitalize="words"
                />

                <View style={styles.pickerContainer}>
                  <Text style={styles.pickerLabel}>Categoria</Text>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={formData.category}
                      onValueChange={(value) => updateField('category', value)}
                      style={styles.picker}
                    >
                      <Picker.Item label="Medicamento" value="medicamento" />
                      <Picker.Item label="Vacina" value="vacina" />
                      <Picker.Item label="Procedimento" value="procedimento" />
                      <Picker.Item label="Exame" value="exame" />
                      <Picker.Item label="Tratamento" value="tratamento" />
                    </Picker>
                  </View>
                </View>

                <Input
                  label="Descrição"
                  value={formData.description}
                  onChangeText={(value) => updateField('description', value)}
                  placeholder="Descrição detalhada"
                  multiline
                  numberOfLines={3}
                  autoCapitalize="sentences"
                />

                <Input
                  label="Dosagem"
                  value={formData.dosage}
                  onChangeText={(value) => updateField('dosage', value)}
                  placeholder="Ex: 2-4 mg/kg, 1 comprimido"
                />

                <Input
                  label="Frequência"
                  value={formData.frequency}
                  onChangeText={(value) => updateField('frequency', value)}
                  placeholder="Ex: A cada 12 horas, Uma vez ao dia"
                />

                <Input
                  label="Espécies"
                  value={formData.species}
                  onChangeText={(value) => updateField('species', value)}
                  placeholder="Ex: Cão, Gato, Aves"
                />

                <Input
                  label="Doenças/Indicações"
                  value={formData.diseases}
                  onChangeText={(value) => updateField('diseases', value)}
                  placeholder="Separar por vírgulas"
                  multiline
                  numberOfLines={2}
                />

                <Input
                  label="Contraindicações"
                  value={formData.contraindications}
                  onChangeText={(value) => updateField('contraindications', value)}
                  placeholder="Quando não usar"
                  multiline
                  numberOfLines={3}
                />

                <Input
                  label="Cronograma/Protocolo"
                  value={formData.schedule}
                  onChangeText={(value) => updateField('schedule', value)}
                  placeholder="Ex: 6-8 semanas, 10-12 semanas"
                />

                <Input
                  label="Reforço"
                  value={formData.booster}
                  onChangeText={(value) => updateField('booster', value)}
                  placeholder="Ex: Anual, Semestral"
                />

                <View style={styles.rowInputs}>
                  <View style={styles.halfInput}>
                    <Input
                      label="Duração (dias)"
                      value={formData.duration}
                      onChangeText={(value) => updateField('duration', value)}
                      placeholder="Ex: 7"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.halfInput}>
                    <Input
                      label="Preço (R$)"
                      value={formData.price}
                      onChangeText={(value) => updateField('price', value)}
                      placeholder="Ex: 25.90"
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>

                <Input
                  label="Observações"
                  value={formData.observations}
                  onChangeText={(value) => updateField('observations', value)}
                  placeholder="Observações adicionais"
                  multiline
                  numberOfLines={3}
                  autoCapitalize="sentences"
                />
              </View>
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <Button
                title="Cancelar"
                variant="outline"
                onPress={closeModal}
                style={styles.cancelButton}
                disabled={saving}
              />
              <Button
                title={editingMedication ? 'Atualizar' : 'Salvar'}
                onPress={handleSave}
                loading={saving}
                style={styles.saveButton}
              />
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
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
  searchContainer: {
    padding: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: `${Colors.border}30`,
  },
  searchBar: {
    marginBottom: 16,
  },
  categoriesScroll: {
    flexGrow: 0,
  },
  categoriesContainer: {
    gap: 12,
  },
  categoryButton: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  categoryButtonActive: {
    borderColor: 'transparent',
    transform: [{ scale: 1.05 }],
  },
  categoryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text,
    marginLeft: 6,
  },
  categoryTextActive: {
    color: Colors.surface,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
  },
  resultsCount: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  medicationsList: {
    padding: 16,
    gap: 12,
  },
  medicationCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  medicationGradient: {
    padding: 16,
  },
  medicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  medicationCategory: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${Colors.error}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicationDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  medicationDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    fontSize: 12,
    color: Colors.text,
    marginLeft: 4,
    fontWeight: '500',
  },
  speciesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  speciesBadge: {
    backgroundColor: `${Colors.primary}15`,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  speciesText: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  emptyGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  addButton: {
    paddingHorizontal: 24,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 8,
    textAlign: 'center',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  modalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.surface,
    textAlign: 'center',
  },
  modalHeaderSpacer: {
    width: 40,
  },
  modalKeyboardView: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
    paddingBottom: 100,
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    minHeight: 48,
  },
  picker: {
    height: 48,
    color: Colors.text,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 16,
  },
  halfInput: {
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 32,
    gap: 12,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 2,
  },
});

export default VetLibraryScreen;