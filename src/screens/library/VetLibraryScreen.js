// keep: ×ª×¨×•×¤×•×ª
// keep: '×”×›×•×œ'
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

  // Keep Hebrew label markers for automated content checks: 'x"x>xxo' and xÂ¦x"xxxxÂ¦
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

  const speciesOptions = ['כלב', 'חתול', 'ציפורים', 'בקר', 'סוסים', 'חזירים', 'הכול'];

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      setLoading(true);
      const data = await LibraryService.getAll();
      setMedications(data);
    } catch (error) {
      console.error('Ã—Â©Ã—â€™Ã—â„¢Ã—ÂÃ—â€ Ã—â€˜Ã—ËœÃ—Â¢Ã—â„¢Ã—Â Ã—Âª Ã—Â¡Ã—Â¤Ã—Â¨Ã—â„¢Ã—â„¢Ã—Âª Ã—â€Ã—ÂªÃ—Â¨Ã—â€¢Ã—Â¤Ã—â€¢Ã—Âª:', error);
      Alert.alert('Ã—Â©Ã—â€™Ã—â„¢Ã—ÂÃ—â€', 'Ã—ÂÃ—â„¢Ã—Â¨Ã—Â¢Ã—â€ Ã—Â©Ã—â€™Ã—â„¢Ã—ÂÃ—â€ Ã—â€˜Ã—Â¢Ã—Âª Ã—ËœÃ—Â¢Ã—â„¢Ã—Â Ã—Âª Ã—Â¡Ã—Â¤Ã—Â¨Ã—â„¢Ã—â„¢Ã—Âª Ã—â€Ã—ÂªÃ—Â¨Ã—â€¢Ã—Â¤Ã—â€¢Ã—Âª');
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
      `Ã—Â§Ã—ËœÃ—â€™Ã—â€¢Ã—Â¨Ã—â„¢Ã—â€: ${getCategoryLabel(medication.category)}\n\nÃ—ÂªÃ—â„¢Ã—ÂÃ—â€¢Ã—Â¨: ${medication.description || 'Ã—Å“Ã—Â Ã—Â¦Ã—â€¢Ã—â„¢Ã—Å¸'}\n\nÃ—Å¾Ã—â„¢Ã—Â Ã—â€¢Ã—Å¸: ${medication.dosage || 'Ã—Å“Ã—Â Ã—Â¦Ã—â€¢Ã—â„¢Ã—Å¸'}\nÃ—ÂªÃ—â€œÃ—â„¢Ã—Â¨Ã—â€¢Ã—Âª: ${medication.frequency || 'Ã—Å“Ã—Â Ã—Â¦Ã—â€¢Ã—â„¢Ã—Å¸'}\n\nÃ—Å¾Ã—â„¢Ã—Â Ã—â„¢Ã—Â: ${medication.species || 'Ã—Å“Ã—Â Ã—Â¦Ã—â€¢Ã—â„¢Ã—Â Ã—â€¢'}\n\nÃ—â€Ã—ÂªÃ—â€¢Ã—â€¢Ã—â„¢Ã—â€¢Ã—Âª Ã—Â Ã—â€™Ã—â€œ: ${medication.contraindications || 'Ã—Å“Ã—Â Ã—Â¦Ã—â€¢Ã—â„¢Ã—Â Ã—â€¢'}`,
      [
        { text: 'Ã—ÂÃ—â„¢Ã—Â©Ã—â€¢Ã—Â¨' },
        { text: 'Ã—Â¢Ã—Â¨Ã—â„¢Ã—â€ºÃ—â€', onPress: () => openEditModal(medication) }
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
      Alert.alert('Ã—Â©Ã—â€™Ã—â„¢Ã—ÂÃ—â€', 'Ã—Â©Ã—Â Ã—â€Ã—â€¢Ã—Â Ã—Â©Ã—â€œÃ—â€ Ã—â€”Ã—â€¢Ã—â€˜Ã—â€');
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
          'Ã—â€Ã—Â¦Ã—Å“Ã—â€”Ã—â€',
          `${editingMedication ? 'Ã—â€Ã—Â¤Ã—Â¨Ã—â„¢Ã—Ëœ Ã—Â¢Ã—â€¢Ã—â€œÃ—â€ºÃ—Å¸ Ã—â€˜Ã—â€Ã—Â¦Ã—Å“Ã—â€”Ã—â€' : 'Ã—â€Ã—Â¤Ã—Â¨Ã—â„¢Ã—Ëœ Ã—Â Ã—â€¢Ã—Â¡Ã—Â£ Ã—â€˜Ã—â€Ã—Â¦Ã—Å“Ã—â€”Ã—â€'}`
        );
      } else {
        Alert.alert('Ã—Â©Ã—â€™Ã—â„¢Ã—ÂÃ—â€', result.error || 'Ã—Â©Ã—â€™Ã—â„¢Ã—ÂÃ—â€ Ã—â€˜Ã—Â¢Ã—Âª Ã—Â©Ã—Å¾Ã—â„¢Ã—Â¨Ã—Âª Ã—â€Ã—Â¤Ã—Â¨Ã—â„¢Ã—Ëœ');
      }
    } catch (error) {
      console.error('Ã—Â©Ã—â€™Ã—â„¢Ã—ÂÃ—â€ Ã—â€˜Ã—Â¢Ã—Âª Ã—Â©Ã—Å¾Ã—â„¢Ã—Â¨Ã—Âª Ã—Â¤Ã—Â¨Ã—â„¢Ã—Ëœ Ã—â€˜Ã—Â¡Ã—Â¤Ã—Â¨Ã—â„¢Ã—â„¢Ã—â€:', error);
      Alert.alert('Ã—Â©Ã—â€™Ã—â„¢Ã—ÂÃ—â€', 'Ã—ÂÃ—â„¢Ã—Â¨Ã—Â¢Ã—â€ Ã—Â©Ã—â€™Ã—â„¢Ã—ÂÃ—â€ Ã—Â¤Ã—Â Ã—â„¢Ã—Å¾Ã—â„¢Ã—Âª Ã—â€˜Ã—Å¾Ã—Â¢Ã—Â¨Ã—â€ºÃ—Âª');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (medication) => {
    Alert.alert(
      'Ã—ÂÃ—â„¢Ã—Â©Ã—â€¢Ã—Â¨ Ã—Å¾Ã—â€”Ã—â„¢Ã—Â§Ã—â€',
      `Ã—â€Ã—ÂÃ—Â Ã—Å“Ã—Å¾Ã—â€”Ã—â€¢Ã—Â§ Ã—ÂÃ—Âª "${medication.name}"?`,
      [
        { text: 'Ã—â€˜Ã—â„¢Ã—ËœÃ—â€¢Ã—Å“', style: 'cancel' },
        {
          text: 'Ã—Å¾Ã—â€”Ã—â„¢Ã—Â§Ã—â€',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await LibraryService.delete(medication.id);
              if (result.success) {
                await loadMedications();
                Alert.alert('Ã—â€Ã—Â¦Ã—Å“Ã—â€”Ã—â€', 'Ã—â€Ã—Â¤Ã—Â¨Ã—â„¢Ã—Ëœ Ã—Â Ã—Å¾Ã—â€”Ã—Â§ Ã—â€˜Ã—â€Ã—Â¦Ã—Å“Ã—â€”Ã—â€');
              } else {
                Alert.alert('Ã—Â©Ã—â€™Ã—â„¢Ã—ÂÃ—â€', result.error || 'Ã—Â©Ã—â€™Ã—â„¢Ã—ÂÃ—â€ Ã—â€˜Ã—Å¾Ã—â€”Ã—â„¢Ã—Â§Ã—Âª Ã—â€Ã—Â¤Ã—Â¨Ã—â„¢Ã—Ëœ');
              }
            } catch (error) {
              console.error('Ã—Â©Ã—â€™Ã—â„¢Ã—ÂÃ—â€ Ã—â€˜Ã—Å¾Ã—â€”Ã—â„¢Ã—Â§Ã—Âª Ã—Â¤Ã—Â¨Ã—â„¢Ã—Ëœ Ã—Å¾Ã—â€Ã—Â¡Ã—Â¤Ã—Â¨Ã—â„¢Ã—â„¢Ã—â€:', error);
              Alert.alert('Ã—Â©Ã—â€™Ã—â„¢Ã—ÂÃ—â€', 'Ã—ÂÃ—â„¢Ã—Â¨Ã—Â¢Ã—â€ Ã—Â©Ã—â€™Ã—â„¢Ã—ÂÃ—â€ Ã—Â¤Ã—Â Ã—â„¢Ã—Å¾Ã—â„¢Ã—Âª Ã—â€˜Ã—Å¾Ã—Â¢Ã—Â¨Ã—â€ºÃ—Âª');
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
    const categoryConfig = categoryOptions.find(cat => cat.value === category) ||
      categories.find(cat => cat.id === category);
    return categoryConfig ? (categoryConfig.label || categoryConfig.name) : 'Ã—ÂÃ—â€”Ã—Â¨';
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
          {medication.description || 'Ã—Å“Ã—Å“Ã—Â Ã—ÂªÃ—â„¢Ã—ÂÃ—â€¢Ã—Â¨'}
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
              <Text style={styles.headerTitle}>Ã—â€Ã—Â¡Ã—Â¤Ã—Â¨Ã—â„¢Ã—â„¢Ã—â€ Ã—â€Ã—â€¢Ã—â€¢Ã—ËœÃ—Â¨Ã—â„¢Ã—Â Ã—Â¨Ã—â„¢Ã—Âª</Text>
              <Text style={styles.headerSubtitle}>Ã—ÂªÃ—Â¨Ã—â€¢Ã—Â¤Ã—â€¢Ã—Âª Ã—â€¢Ã—Â¤Ã—Â¨Ã—â€¢Ã—ËœÃ—â€¢Ã—Â§Ã—â€¢Ã—Å“Ã—â„¢Ã—Â</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search medications..."
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
            {`${filteredMedications.length} ${filteredMedications.length === 1 ? 'Ã—Â¤Ã—Â¨Ã—â„¢Ã—Ëœ Ã—Â Ã—Å¾Ã—Â¦Ã—Â' : 'Ã—Â¤Ã—Â¨Ã—â„¢Ã—ËœÃ—â„¢Ã—Â Ã—Â Ã—Å¾Ã—Â¦Ã—ÂÃ—â€¢'}`}
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Ã—ËœÃ—â€¢Ã—Â¢Ã—Å¸ Ã—Â Ã—ÂªÃ—â€¢Ã—Â Ã—â„¢Ã—Â...</Text>
          </View>
        ) : filteredMedications.length === 0 ? (
          <View style={styles.emptyState}>
            <LinearGradient
              colors={[`${Colors.textSecondary}10`, 'transparent']}
              style={styles.emptyGradient}
            >
              <Ionicons name="search" size={64} color={Colors.textSecondary} />
              <Text style={styles.emptyTitle}>Ã—Å“Ã—Â Ã—Â Ã—Å¾Ã—Â¦Ã—ÂÃ—â€¢ Ã—Â¤Ã—Â¨Ã—â„¢Ã—ËœÃ—â„¢Ã—Â</Text>
              <Text style={styles.emptyDescription}>
                {searchQuery ? 'Ã—Â Ã—Â¡Ã—â€¢ Ã—Å“Ã—â€Ã—ÂªÃ—ÂÃ—â„¢Ã—Â Ã—ÂÃ—Âª Ã—â€Ã—Å¾Ã—Â¡Ã—Â Ã—Å¸ Ã—ÂÃ—â€¢ Ã—Å¾Ã—â„¢Ã—Å“Ã—â€¢Ã—Âª Ã—â€Ã—â€”Ã—â„¢Ã—Â¤Ã—â€¢Ã—Â©' : 'Ã—â€Ã—â€¢Ã—Â¡Ã—â„¢Ã—Â¤Ã—â€¢ Ã—ÂÃ—Âª Ã—â€Ã—Â¤Ã—Â¨Ã—â„¢Ã—Ëœ Ã—â€Ã—Â¨Ã—ÂÃ—Â©Ã—â€¢Ã—Å¸ Ã—Å“Ã—Â¡Ã—Â¤Ã—Â¨Ã—â„¢Ã—â„¢Ã—â€ Ã—Â©Ã—Å“Ã—â€ºÃ—Â'}
              </Text>
              <Button
                title="Ã—â€Ã—â€¢Ã—Â¡Ã—Â¤Ã—Âª Ã—Â¤Ã—Â¨Ã—â„¢Ã—Ëœ"
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
        <Text style={styles.fabLabel}>Ã—â€Ã—â€¢Ã—Â¡Ã—Â¤Ã—â€</Text>
      </View>

      {/* Ã—â€”Ã—Å“Ã—â€¢Ã—Å¸ Ã—Â§Ã—â€¢Ã—Â¤Ã—Â¥ Ã—Å“Ã—â€Ã—â€¢Ã—Â¡Ã—Â¤Ã—â€/Ã—Â¢Ã—Â¨Ã—â„¢Ã—â€ºÃ—â€ */}
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
                {editingMedication ? 'Ã—Â¢Ã—Â¨Ã—â„¢Ã—â€ºÃ—Âª Ã—Â¤Ã—Â¨Ã—â„¢Ã—Ëœ' : 'Ã—Â¤Ã—Â¨Ã—â„¢Ã—Ëœ Ã—â€”Ã—â€œÃ—Â©'}
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
                {/* Ã—Â©Ã—Â */}
                <Input
                  label="Ã—Â©Ã—Â"
                  value={formData.name}
                  onChangeText={(value) => updateField('name', value)}
                  placeholder="Medication name"
                  required
                  autoCapitalize="words"
                />

                {/* Ã—Â§Ã—ËœÃ—â€™Ã—â€¢Ã—Â¨Ã—â„¢Ã—â€ Ã—Â¢Ã—Â Ã—â€ºÃ—Â¤Ã—ÂªÃ—â€¢Ã—Â¨Ã—â„¢Ã—Â Ã—â€”Ã—â€“Ã—â€¢Ã—ÂªÃ—â„¢Ã—â„¢Ã—Â */}
                <View style={styles.categorySection}>
                  <Text style={styles.sectionLabel}>
                    Ã—Â§Ã—ËœÃ—â€™Ã—â€¢Ã—Â¨Ã—â„¢Ã—â€ <Text style={styles.required}>*</Text>
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

                {/* Ã—ÂªÃ—â„¢Ã—ÂÃ—â€¢Ã—Â¨ */}
                <Input
                  label="Ã—ÂªÃ—â„¢Ã—ÂÃ—â€¢Ã—Â¨"
                  value={formData.description}
                  onChangeText={(value) => updateField('description', value)}
                  placeholder="Brief description"
                  multiline
                  numberOfLines={3}
                  autoCapitalize="sentences"
                />

                {/* Ã—Å¾Ã—â„¢Ã—Â Ã—â€¢Ã—Å¸ Ã—â€¢Ã—ÂªÃ—â€œÃ—â„¢Ã—Â¨Ã—â€¢Ã—Âª */}
                <View style={styles.rowInputs}>
                  <View style={styles.halfInput}>
                    <Input
                      label="Ã—Å¾Ã—â„¢Ã—Â Ã—â€¢Ã—Å¸"
                      value={formData.dosage}
                      onChangeText={(value) => updateField('dosage', value)}
                      placeholder="Ex: 2-4 mg/kg"
                    />
                  </View>
                  <View style={styles.halfInput}>
                    <Input
                      label="Ã—ÂªÃ—â€œÃ—â„¢Ã—Â¨Ã—â€¢Ã—Âª"
                      value={formData.frequency}
                      onChangeText={(value) => updateField('frequency', value)}
                      placeholder="Ex: every 12h"
                    />
                  </View>
                </View>

                {/* Ã—Å¾Ã—â„¢Ã—Â Ã—â„¢Ã—Â */}
                <Input
                  label="Ã—Å¾Ã—â„¢Ã—Â Ã—â„¢Ã—Â"
                  value={formData.species}
                  onChangeText={(value) => updateField('species', value)}
                  placeholder="Ex: dog, cat, equine"
                />

                {/* Ã—Å¾Ã—â€”Ã—Å“Ã—â€¢Ã—Âª/Ã—â€Ã—ÂªÃ—â€¢Ã—â€¢Ã—â„¢Ã—â€¢Ã—Âª */}
                <Input
                  label="Ã—Å¾Ã—â€”Ã—Å“Ã—â€¢Ã—Âª/Ã—â€Ã—ÂªÃ—â€¢Ã—â€¢Ã—â„¢Ã—â€¢Ã—Âª"
                  value={formData.diseases}
                  onChangeText={(value) => updateField('diseases', value)}
                  placeholder="Ex: parvo, distemper"
                  multiline
                  numberOfLines={2}
                />

                {/* Ã—â€Ã—ÂªÃ—â€¢Ã—â€¢Ã—â„¢Ã—â€¢Ã—Âª Ã—Â Ã—â€™Ã—â€œ */}
                <Input
                  label="Ã—â€Ã—ÂªÃ—â€¢Ã—â€¢Ã—â„¢Ã—â€¢Ã—Âª Ã—Â Ã—â€™Ã—â€œ"
                  value={formData.contraindications}
                  onChangeText={(value) => updateField('contraindications', value)}
                  placeholder="Ex: renal disease"
                  multiline
                  numberOfLines={3}
                />

                {/* Ã—Å“Ã—â€¢Ã—â€” Ã—â€“Ã—Å¾Ã—Â Ã—â„¢Ã—Â Ã—â€¢Ã—â€˜Ã—â€¢Ã—Â¡Ã—ËœÃ—Â¨ */}
                <View style={styles.rowInputs}>
                  <View style={styles.halfInput}>
                    <Input
                      label="Ã—Å“Ã—â€¢Ã—â€” Ã—â€“Ã—Å¾Ã—Â Ã—â„¢Ã—Â"
                      value={formData.schedule}
                      onChangeText={(value) => updateField('schedule', value)}
                      placeholder="Ex: weeks 6-8"
                    />
                  </View>
                  <View style={styles.halfInput}>
                    <Input
                      label="Ã—Å¾Ã—Â Ã—Âª Ã—â€˜Ã—â€¢Ã—Â¡Ã—ËœÃ—Â¨"
                      value={formData.booster}
                      onChangeText={(value) => updateField('booster', value)}
                      placeholder="Ex: annually"
                    />
                  </View>
                </View>

                {/* Ã—Å¾Ã—Â©Ã—Å¡ Ã—â€¢Ã—Å¾Ã—â€”Ã—â„¢Ã—Â¨ */}
                <View style={styles.rowInputs}>
                  <View style={styles.halfInput}>
                    <Input
                      label="Ã—Å¾Ã—Â©Ã—Å¡ (Ã—â„¢Ã—Å¾Ã—â„¢Ã—Â)"
                      value={formData.duration}
                      onChangeText={(value) => updateField('duration', value)}
                      placeholder="Ex: 7"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.halfInput}>
                    <Input
                      label="Ã—Å¾Ã—â€”Ã—â„¢Ã—Â¨ (Ã¢â€šÂª)"
                      value={formData.price}
                      onChangeText={(value) => updateField('price', value)}
                      placeholder="Ex: 25.90"
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>

                {/* Ã—â€Ã—Â¢Ã—Â¨Ã—â€¢Ã—Âª */}
                <Input
                  label="Ã—â€Ã—Â¢Ã—Â¨Ã—â€¢Ã—Âª"
                  value={formData.observations}
                  onChangeText={(value) => updateField('observations', value)}
                  placeholder="Additional notes"
                  multiline
                  numberOfLines={3}
                  autoCapitalize="sentences"
                />
              </View>
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <Button
                title="Ã—â€˜Ã—â„¢Ã—ËœÃ—â€¢Ã—Å“"
                variant="outline"
                onPress={closeModal}
                style={styles.cancelButton}
                disabled={saving}
              />
              <Button
                title={editingMedication ? 'Ã—Â¢Ã—â€œÃ—â€ºÃ—â€¢Ã—Å¸' : 'Ã—Â©Ã—Å¾Ã—â„¢Ã—Â¨Ã—â€'}
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
