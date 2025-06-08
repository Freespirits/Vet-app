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
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SearchBar from '../../components/common/SearchBar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Colors } from '../../constants/Colors';

const { width } = Dimensions.get('window');

const VetLibraryScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [medications, setMedications] = useState([]);

  // Dados simulados de medicamentos
  const mockMedications = [
    {
      id: 1,
      name: 'Carprofeno',
      category: 'anti-inflamatorio',
      description: 'Anti-inflamatório não esteroidal para cães',
      dosage: '2-4 mg/kg',
      frequency: 'A cada 12 horas',
      administration: 'Via oral',
      contraindications: 'Gestação, lactação, insuficiência renal',
      sideEffects: 'Vômito, diarreia, perda de apetite',
      species: ['Cão'],
      activeIngredient: 'Carprofeno'
    },
    {
      id: 2,
      name: 'Meloxicam',
      category: 'anti-inflamatorio',
      description: 'Anti-inflamatório para cães e gatos',
      dosage: '0,1-0,2 mg/kg',
      frequency: 'Uma vez ao dia',
      administration: 'Via oral ou injetável',
      contraindications: 'Desidratação, problemas renais',
      sideEffects: 'Vômito, diarreia, letargia',
      species: ['Cão', 'Gato'],
      activeIngredient: 'Meloxicam'
    },
    {
      id: 3,
      name: 'Tramadol',
      category: 'analgesico',
      description: 'Analgésico opioide para dor moderada a severa',
      dosage: '2-5 mg/kg',
      frequency: 'A cada 6-8 horas',
      administration: 'Via oral',
      contraindications: 'Epilepsia, depressão respiratória',
      sideEffects: 'Sedação, constipação, vômito',
      species: ['Cão', 'Gato'],
      activeIngredient: 'Cloridrato de Tramadol'
    },
    {
      id: 4,
      name: 'Amoxicilina',
      category: 'antibiotico',
      description: 'Antibiótico de amplo espectro',
      dosage: '10-20 mg/kg',
      frequency: 'A cada 8-12 horas',
      administration: 'Via oral',
      contraindications: 'Alergia a penicilinas',
      sideEffects: 'Diarreia, vômito, reações alérgicas',
      species: ['Cão', 'Gato', 'Aves'],
      activeIngredient: 'Amoxicilina triidratada'
    },
    {
      id: 5,
      name: 'Ivermectina',
      category: 'antiparasitario',
      description: 'Antiparasitário de amplo espectro',
      dosage: '0,2-0,4 mg/kg',
      frequency: 'Dose única ou conforme prescrição',
      administration: 'Via oral ou injetável',
      contraindications: 'Raças sensíveis (Collie, Pastor Alemão)',
      sideEffects: 'Ataxia, tremores, depressão',
      species: ['Cão', 'Gato', 'Bovinos'],
      activeIngredient: 'Ivermectina'
    },
    {
      id: 6,
      name: 'Dexametasona',
      category: 'corticoide',
      description: 'Corticosteroide anti-inflamatório',
      dosage: '0,1-0,3 mg/kg',
      frequency: 'Uma vez ao dia',
      administration: 'Via oral ou injetável',
      contraindications: 'Infecções virais, diabetes',
      sideEffects: 'Poliúria, polidipsia, ganho de peso',
      species: ['Cão', 'Gato'],
      activeIngredient: 'Fosfato sódico de dexametasona'
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos', icon: 'medical', color: Colors.primary },
    { id: 'antibiotico', name: 'Antibióticos', icon: 'shield', color: Colors.success },
    { id: 'anti-inflamatorio', name: 'Anti-inflamatórios', icon: 'fitness', color: Colors.warning },
    { id: 'analgesico', name: 'Analgésicos', icon: 'heart', color: Colors.error },
    { id: 'antiparasitario', name: 'Antiparasitários', icon: 'bug', color: Colors.info },
    { id: 'corticoide', name: 'Corticoides', icon: 'flash', color: Colors.secondary },
  ];

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      // Simular carregamento de dados
      setMedications(mockMedications);
    } catch (error) {
      console.error('Erro ao carregar medicamentos:', error);
      Alert.alert('Erro', 'Erro ao carregar a biblioteca de medicamentos');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMedications();
    setRefreshing(false);
  };

  const filteredMedications = medications.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         med.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         med.activeIngredient.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || med.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleMedicationPress = (medication) => {
    Alert.alert(
      medication.name,
      `Princípio Ativo: ${medication.activeIngredient}\n\nDescrição: ${medication.description}\n\nDosagem: ${medication.dosage}\nFrequência: ${medication.frequency}\nVia: ${medication.administration}\n\nEspécies: ${medication.species.join(', ')}\n\nContraindicações: ${medication.contraindications}`,
      [{ text: 'OK' }],
      { cancelable: true }
    );
  };

  const handleAddMedication = () => {
    Alert.alert(
      'Adicionar Medicamento',
      'Escolha como deseja adicionar um novo medicamento:',
      [
        {
          text: 'Formulário Completo',
          onPress: () => Alert.alert('Em breve', 'Formulário completo será implementado em breve!')
        },
        {
          text: 'Busca Online',
          onPress: () => Alert.alert('Em breve', 'Funcionalidade de busca online será implementada em breve!')
        },
        {
          text: 'Cancelar',
          style: 'cancel'
        }
      ]
    );
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
            <Text style={styles.medicationIngredient}>{medication.activeIngredient}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
        </View>
        
        <Text style={styles.medicationDescription} numberOfLines={2}>
          {medication.description}
        </Text>
        
        <View style={styles.medicationDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="scale" size={14} color={Colors.primary} />
            <Text style={styles.detailText}>{medication.dosage}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time" size={14} color={Colors.primary} />
            <Text style={styles.detailText}>{medication.frequency}</Text>
          </View>
        </View>
        
        <View style={styles.speciesContainer}>
          {medication.species.map((species, index) => (
            <View key={index} style={styles.speciesBadge}>
              <Text style={styles.speciesText}>{species}</Text>
            </View>
          ))}
        </View>
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
            {filteredMedications.length} medicamento{filteredMedications.length !== 1 ? 's' : ''} encontrado{filteredMedications.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {filteredMedications.length === 0 ? (
          <View style={styles.emptyState}>
            <LinearGradient
              colors={[`${Colors.textSecondary}10`, 'transparent']}
              style={styles.emptyGradient}
            >
              <Ionicons name="search" size={64} color={Colors.textSecondary} />
              <Text style={styles.emptyTitle}>Nenhum medicamento encontrado</Text>
              <Text style={styles.emptyDescription}>
                Tente ajustar os filtros ou termos de busca
              </Text>
              <Button
                title="Adicionar Medicamento"
                onPress={handleAddMedication}
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

      {/* Enhanced Floating Action Button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={handleAddMedication}
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
  medicationIngredient: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
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
});

export default VetLibraryScreen;