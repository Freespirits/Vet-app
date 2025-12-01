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
import SearchBar from '../../components/common/SearchBar';
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

  const [modalVisible, setModalVisible] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);
  const [saving, setSaving] = useState(false);

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
    { id: 'all', name: 'הכול', icon: 'medical', color: Colors.primary },
    { id: 'medicamento', name: 'תרופות', icon: 'medical', color: Colors.success },
    { id: 'vacina', name: 'חיסונים', icon: 'shield-checkmark', color: Colors.info },
    { id: 'procedimento', name: 'פרוצדורות', icon: 'cut', color: Colors.warning },
    { id: 'exame', name: 'בדיקות', icon: 'search', color: Colors.error },
    { id: 'tratamento', name: 'טיפולים', icon: 'fitness', color: Colors.secondary },
  ];

  const categoryOptions = [
    { value: 'medicamento', label: 'תרופה', icon: 'medical', color: Colors.success },
    { value: 'vacina', label: 'חיסון', icon: 'shield-checkmark', color: Colors.info },
    { value: 'procedimento', label: 'פרוצדורה', icon: 'cut', color: Colors.warning },
    { value: 'exame', label: 'בדיקה', icon: 'search', color: Colors.error },
    { value: 'tratamento', label: 'טיפול', icon: 'fitness', color: Colors.secondary },
  ];

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      setLoading(true);
      const data = await LibraryService.getAll();
      setMedications(data);
    } catch (error) {
      console.error('שגיאה בטעינת פריטי הספרייה:', error);
      Alert.alert('שגיאה', 'לא ניתן היה לטעון את פריטי הספרייה.');
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
    const name = (med.name || '').toLowerCase();
    const description = (med.description || '').toLowerCase();
    const search = searchQuery.toLowerCase();
    const matchesSearch = name.includes(search) || description.includes(search);
    const matchesCategory = activeCategory === 'all' || med.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleMedicationPress = (medication) => {
    Alert.alert(
      medication.name,
      `קטגוריה: ${getCategoryLabel(medication.category)}\n\nתיאור: ${medication.description || 'ללא תיאור'}\n\nמינון: ${medication.dosage || 'לא צוין'}\nתדירות: ${medication.frequency || 'לא צוין'}\n\nמינים: ${medication.species || 'לא צוין'}\n\nהתוויות נגד: ${medication.contraindications || 'לא צוין'}`,
      [
        { text: 'סגור' },
        { text: 'עריכה', onPress: () => openEditModal(medication) }
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
      Alert.alert('שגיאה', 'נא להזין שם לפריט.');
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
        diseases: formData.diseases
          .split(',')
          .map(d => d.trim())
          .filter(d => d),
        schedule: formData.schedule.trim(),
        booster: formData.booster.trim(),
        duration: formData.duration ? parseInt(formData.duration, 10) : null,
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
        Alert.alert('הצלחה', editingMedication ? 'הפריט עודכן בהצלחה.' : 'הפריט נוסף בהצלחה.');
      } else {
        Alert.alert('שגיאה', result.error || 'לא ניתן היה לשמור את הפריט.');
      }
    } catch (error) {
      console.error('שגיאה בשמירת הפריט:', error);
      Alert.alert('שגיאה', 'לא ניתן היה לשמור את הפריט.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (medication) => {
    Alert.alert(
      'הסר פריט',
      `האם להסיר "${medication.name}"?`,
      [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'הסר',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await LibraryService.delete(medication.id);
              if (result.success) {
                await loadMedications();
                Alert.alert('הצלחה', 'הפריט הוסר בהצלחה.');
              } else {
                Alert.alert('שגיאה', result.error || 'לא ניתן היה להסיר את הפריט.');
              }
            } catch (error) {
              console.error('שגיאה בהסרת הפריט:', error);
              Alert.alert('שגיאה', 'לא ניתן היה להסיר את הפריט.');
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

  const getCategoryLabel = (category) => {
    const categoryConfig =
      categoryOptions.find(cat => cat.value === category) ||
      categories.find(cat => cat.id === category);
    return categoryConfig ? (categoryConfig.label || categoryConfig.name) : 'לא ידועה';
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
            <Text style={styles.medicationCategory}>{getCategoryLabel(medication.category)}</Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(medication)}
          >
            <Ionicons name="trash" size={16} color={Colors.error} />
          </TouchableOpacity>
        </View>

        <Text style={styles.medicationDescription} numberOfLines={2}>
          {medication.description || 'ללא תיאור'}
        </Text>

        <View style={styles.medicationDetails}>
          {medication.dosage ? (
            <View style={styles.detailItem}>
              <Ionicons name="scale" size={14} color={Colors.primary} />
              <Text style={styles.detailText}>{medication.dosage}</Text>
            </View>
          ) : null}
          {medication.frequency ? (
            <View style={styles.detailItem}>
              <Ionicons name="time" size={14} color={Colors.primary} />
              <Text style={styles.detailText}>{medication.frequency}</Text>
            </View>
          ) : null}
        </View>

        {medication.species ? (
          <View style={styles.speciesContainer}>
            <View style={styles.speciesBadge}>
              <Text style={styles.speciesText}>{medication.species}</Text>
            </View>
          </View>
        ) : null}
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
              <Text style={styles.headerTitle}>הספרייה הווטרינרית</Text>
              <Text style={styles.headerSubtitle}>תרופות, חיסונים ופרוטוקולים במקום אחד.</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="חיפוש בספרייה..."
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
            {`${filteredMedications.length} ${filteredMedications.length === 1 ? 'תוצאה' : 'תוצאהs'}`}
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>טוען נתונים...</Text>
          </View>
        ) : filteredMedications.length === 0 ? (
          <View style={styles.emptyState}>
            <LinearGradient
              colors={[`${Colors.textSecondary}10`, 'transparent']}
              style={styles.emptyGradient}
            >
              <Ionicons name="search" size={64} color={Colors.textSecondary} />
              <Text style={styles.emptyTitle}>לא נמצאו פריטים</Text>
              <Text style={styles.emptyDescription}>
                {searchQuery ? 'התאימו את החיפוש או נסו מונחים אחרים.' : 'הוסיפו את הפריט הראשון כדי לבנות את הספרייה.'}
              </Text>
              <Button
                title="הוספת פריט"
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
        <Text style={styles.fabLabel}>הוסף</Text>
      </View>

      {/* Modal add/edit */}
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
                {editingMedication ? 'עריכה item' : 'הוספת פריט'}
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
                  label="שם"
                  value={formData.name}
                  onChangeText={(value) => updateField('name', value)}
                  placeholder="שם הפריט"
                  required
                  autoCapitalize="words"
                />

                <View style={styles.categorySection}>
                  <Text style={styles.sectionLabel}>
                    קטגוריה <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={styles.categoryGrid}>
                    {categoryOptions.map(option => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.categoryOptionButton,
                          formData.category === option.value && styles.categoryOptionButtonActive,
                          { borderColor: option.color }
                        ]}
                        onPress={() => updateField('category', option.value)}
                      >
                        <LinearGradient
                          colors={formData.category === option.value ?
                            [option.color, `${option.color}CC`] :
                            ['transparent', 'transparent']
                          }
                          style={styles.categoryOptionGradient}
                        >
                          <Ionicons
                            name={option.icon}
                            size={20}
                            color={formData.category === option.value ? Colors.surface : option.color}
                          />
                          <Text style={[
                            styles.categoryOptionText,
                            formData.category === option.value && styles.categoryOptionTextActive
                          ]}>
                            {option.label}
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <Input
                  label="תיאור"
                  value={formData.description}
                  onChangeText={(value) => updateField('description', value)}
                  placeholder="תיאור resumida"
                  multiline
                  numberOfLines={3}
                  autoCapitalize="sentences"
                />

                <View style={styles.rowInputs}>
                  <View style={styles.halfInput}>
                    <Input
                      label="מינון"
                      value={formData.dosage}
                      onChangeText={(value) => updateField('dosage', value)}
                      placeholder="לדוגמה: 2-4 mg/kg"
                    />
                  </View>
                  <View style={styles.halfInput}>
                    <Input
                      label="תדירות"
                      value={formData.frequency}
                      onChangeText={(value) => updateField('frequency', value)}
                      placeholder="לדוגמה: כל 12 שעות"
                    />
                  </View>
                </View>

                <Input
                  label="מינים"
                  value={formData.species}
                  onChangeText={(value) => updateField('species', value)}
                  placeholder="לדוגמה: כלב, חתול, סוס"
                />

                <Input
                  label="מחלות/אינדיקציות"
                  value={formData.diseases}
                  onChangeText={(value) => updateField('diseases', value)}
                  placeholder="לדוגמה: פרבו, כלבלבת"
                  multiline
                  numberOfLines={2}
                />

                <Input
                  label="התוויות נגד"
                  value={formData.contraindications}
                  onChangeText={(value) => updateField('contraindications', value)}
                  placeholder="לדוגמה: מחלת כליות"
                  multiline
                  numberOfLines={3}
                />

                <View style={styles.rowInputs}>
                  <View style={styles.halfInput}>
                    <Input
                      label="לוח זמנים"
                      value={formData.schedule}
                      onChangeText={(value) => updateField('schedule', value)}
                      placeholder="לדוגמה: שבועות 6-8"
                    />
                  </View>
                  <View style={styles.halfInput}>
                    <Input
                      label="דחף"
                      value={formData.booster}
                      onChangeText={(value) => updateField('booster', value)}
                      placeholder="לדוגמה: אחת לשנה"
                    />
                  </View>
                </View>

                <View style={styles.rowInputs}>
                  <View style={styles.halfInput}>
                    <Input
                      label="משך (ימים)"
                      value={formData.duration}
                      onChangeText={(value) => updateField('duration', value)}
                      placeholder="לדוגמה: 7"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.halfInput}>
                    <Input
                      label="מחיר (₪)"
                      value={formData.price}
                      onChangeText={(value) => updateField('price', value)}
                      placeholder="לדוגמה: 25.90"
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>

                <Input
                  label="הערות"
                  value={formData.observations}
                  onChangeText={(value) => updateField('observations', value)}
                  placeholder="הערות נוספות"
                  multiline
                  numberOfLines={3}
                  autoCapitalize="sentences"
                />
              </View>
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <Button
                title="ביטול"
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
  // Category Selection Styles
  categorySection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 12,
  },
  required: {
    color: Colors.error,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryOptionButton: {
    width: (width - 80) / 2,
    height: 70,
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
  },
  categoryOptionButtonActive: {
    transform: [{ scale: 1.02 }],
  },
  categoryOptionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  categoryOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text,
    marginTop: 6,
    textAlign: 'center',
  },
  categoryOptionTextActive: {
    color: Colors.surface,
    fontWeight: '600',
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
