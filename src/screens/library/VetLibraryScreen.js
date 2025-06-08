import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  Dimensions,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import { MedicineService } from '../../services/MedicineService';
import { Colors } from '../../constants/Colors';
import { globalStyles } from '../../styles/globalStyles';

const { width } = Dimensions.get('window');

const VetLibraryScreen = ({ navigation }) => {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const libraryCategories = [
    {
      id: 'medicines',
      title: 'Medicamentos',
      description: 'Biblioteca de medicamentos veterinários',
      icon: 'medical',
      color: Colors.primary,
      gradient: [Colors.primary, Colors.primaryDark],
      count: medicines.length,
      onPress: () => {} // Já estamos na tela de medicamentos
    },
    {
      id: 'treatments',
      title: 'Tratamentos',
      description: 'Protocolos e procedimentos',
      icon: 'heart',
      color: Colors.secondary,
      gradient: [Colors.secondary, Colors.accent],
      count: 0,
      onPress: () => Alert.alert('Em Desenvolvimento', 'Funcionalidade em desenvolvimento')
    },
    {
      id: 'diseases',
      title: 'Doenças',
      description: 'Banco de dados de doenças',
      icon: 'bug',
      color: Colors.warning,
      gradient: [Colors.warning, '#F57C00'],
      count: 0,
      onPress: () => Alert.alert('Em Desenvolvimento', 'Funcionalidade em desenvolvimento')
    },
    {
      id: 'exams',
      title: 'Exames',
      description: 'Tipos de exames e interpretação',
      icon: 'search',
      color: Colors.info,
      gradient: [Colors.info, '#1976D2'],
      count: 0,
      onPress: () => Alert.alert('Em Desenvolvimento', 'Funcionalidade em desenvolvimento')
    }
  ];

  useEffect(() => {
    loadMedicines();
  }, []);

  useEffect(() => {
    filterMedicines();
  }, [searchQuery, medicines]);

  const loadMedicines = async () => {
    try {
      setLoading(true);
      const medicineList = await MedicineService.getAll();
      setMedicines(medicineList || []);
    } catch (error) {
      console.error('Erro ao carregar medicamentos:', error);
      Alert.alert('Erro', 'Erro ao carregar biblioteca de medicamentos');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMedicines();
    setRefreshing(false);
  };

  const filterMedicines = () => {
    if (!searchQuery.trim()) {
      setFilteredMedicines(medicines);
      return;
    }

    const filtered = medicines.filter(medicine => 
      medicine.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.active_ingredient?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.activeIngredient?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.indication?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredMedicines(filtered);
  };

  const handleEditMedicine = (medicine) => {
    navigation.navigate('NewMedicine', { 
      medicineId: medicine.id,
      medicine: medicine 
    });
  };

  const handleDeleteMedicine = (medicine) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir o medicamento "${medicine.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await MedicineService.delete(medicine.id);
              if (result.success) {
                Alert.alert('Sucesso', 'Medicamento excluído com sucesso');
                loadMedicines();
              } else {
                Alert.alert('Erro', result.error);
              }
            } catch (error) {
              Alert.alert('Erro', 'Erro ao excluir medicamento');
            }
          }
        }
      ]
    );
  };

  const renderMedicineCard = (medicine) => (
    <Card key={medicine.id} style={styles.medicineCard}>
      <View style={styles.medicineHeader}>
        <View style={styles.medicineInfo}>
          <Text style={styles.medicineName}>{medicine.name}</Text>
          <Text style={styles.medicineIngredient}>
            {medicine.active_ingredient || medicine.activeIngredient}
          </Text>
          {medicine.concentration && (
            <Text style={styles.medicineConcentration}>
              {medicine.concentration}
            </Text>
          )}
        </View>
        
        <View style={styles.medicineForm}>
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.formBadge}
          >
            <Ionicons name="medical" size={16} color={Colors.surface} />
            <Text style={styles.formText}>{medicine.form}</Text>
          </LinearGradient>
        </View>
      </View>

      {medicine.indication && (
        <View style={styles.medicineIndication}>
          <Ionicons name="information-circle" size={14} color={Colors.info} />
          <Text style={styles.indicationText} numberOfLines={2}>
            {medicine.indication}
          </Text>
        </View>
      )}

      <View style={styles.medicineFooter}>
        <View style={styles.medicineDetails}>
          {medicine.manufacturer && (
            <Text style={styles.manufacturer}>{medicine.manufacturer}</Text>
          )}
          {medicine.expiration_date && (
            <Text style={styles.expirationDate}>
              Validade: {medicine.expiration_date}
            </Text>
          )}
        </View>

        <View style={styles.medicineActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditMedicine(medicine)}
          >
            <Ionicons name="create" size={18} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteMedicine(medicine)}
          >
            <Ionicons name="trash" size={18} color={Colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTitle}>
            <Ionicons name="library" size={32} color={Colors.surface} />
            <Text style={styles.headerText}>Biblioteca Veterinária</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('NewMedicine')}
          >
            <Ionicons name="add" size={24} color={Colors.surface} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Categorias da Biblioteca */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categorias</Text>
          <View style={styles.categoriesGrid}>
            {libraryCategories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={category.onPress}
              >
                <LinearGradient
                  colors={category.gradient}
                  style={styles.categoryGradient}
                >
                  <View style={styles.categoryIcon}>
                    <Ionicons name={category.icon} size={28} color={Colors.surface} />
                  </View>
                  <View style={styles.categoryContent}>
                    <Text style={styles.categoryTitle}>{category.title}</Text>
                    <Text style={styles.categoryDescription} numberOfLines={2}>
                      {category.description}
                    </Text>
                    <View style={styles.categoryCount}>
                      <Text style={styles.countText}>{category.count} itens</Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Seção de Medicamentos */}
        <View style={styles.medicinesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Medicamentos</Text>
            <TouchableOpacity
              style={styles.addMedicineButton}
              onPress={() => navigation.navigate('NewMedicine')}
            >
              <Ionicons name="add-circle" size={24} color={Colors.primary} />
              <Text style={styles.addMedicineText}>Adicionar</Text>
            </TouchableOpacity>
          </View>

          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar medicamentos..."
            style={styles.searchBar}
          />

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Carregando medicamentos...</Text>
            </View>
          ) : filteredMedicines.length > 0 ? (
            <View style={styles.medicinesList}>
              {filteredMedicines.map(renderMedicineCard)}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <LinearGradient
                colors={[`${Colors.primary}10`, `${Colors.primary}05`]}
                style={styles.emptyGradient}
              >
                <Ionicons name="medical" size={64} color={Colors.primary} />
                <Text style={styles.emptyTitle}>
                  {searchQuery ? 'Nenhum medicamento encontrado' : 'Nenhum medicamento cadastrado'}
                </Text>
                <Text style={styles.emptyDescription}>
                  {searchQuery 
                    ? 'Tente buscar com outros termos'
                    : 'Comece adicionando medicamentos à sua biblioteca'
                  }
                </Text>
                {!searchQuery && (
                  <Button
                    title="Adicionar Primeiro Medicamento"
                    onPress={() => navigation.navigate('NewMedicine')}
                    style={styles.emptyButton}
                    icon={<Ionicons name="add" size={16} color={Colors.surface} />}
                  />
                )}
              </LinearGradient>
            </View>
          )}
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.surface,
    marginLeft: 12,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  categoriesSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: (width - 44) / 2,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
  },
  categoryGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  categoryIcon: {
    alignSelf: 'flex-start',
  },
  categoryContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.surface,
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 12,
    color: Colors.surface,
    opacity: 0.9,
    marginBottom: 8,
  },
  categoryCount: {
    alignSelf: 'flex-start',
  },
  countText: {
    fontSize: 11,
    color: Colors.surface,
    fontWeight: '500',
    opacity: 0.8,
  },
  medicinesSection: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addMedicineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary}15`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addMedicineText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  searchBar: {
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  medicinesList: {
    gap: 12,
  },
  medicineCard: {
    padding: 16,
  },
  medicineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  medicineInfo: {
    flex: 1,
    marginRight: 12,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  medicineIngredient: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  medicineConcentration: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  medicineForm: {
    alignSelf: 'flex-start',
  },
  formBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  formText: {
    fontSize: 11,
    color: Colors.surface,
    fontWeight: '500',
    marginLeft: 4,
  },
  medicineIndication: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    padding: 8,
    backgroundColor: `${Colors.info}10`,
    borderRadius: 8,
  },
  indicationText: {
    fontSize: 12,
    color: Colors.text,
    marginLeft: 6,
    flex: 1,
  },
  medicineFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  medicineDetails: {
    flex: 1,
  },
  manufacturer: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  expirationDate: {
    fontSize: 11,
    color: Colors.warning,
    fontWeight: '500',
  },
  medicineActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: `${Colors.error}15`,
  },
  emptyContainer: {
    marginTop: 20,
  },
  emptyGradient: {
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    alignSelf: 'center',
  },
});

export default VetLibraryScreen;