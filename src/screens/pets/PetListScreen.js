import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity,
  RefreshControl,
  Alert,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { PetService } from '../../services/PetService';
import { ClientService } from '../../services/ClientService';
import { calculateAge } from '../../utils/helpers';
import { Colors } from '../../constants/Colors';
import { globalStyles } from '../../styles/globalStyles';

const PetListScreen = ({ navigation, route }) => {
  const clientIdFromRoute = route?.params?.clientId;
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadPets();
    }, [clientIdFromRoute])
  );

  const loadPets = async () => {
    try {
      let petList;
      if (clientIdFromRoute) {
        // Se um clientId foi fornecido, buscar apenas pets desse cliente
        petList = await PetService.getByClientId(clientIdFromRoute);
        // Buscar dados do cliente para cada pet
        const petsWithOwners = await Promise.all(
          petList.map(async (pet) => {
            const owner = await ClientService.getById(pet.clientId || pet.client_id);
            return { ...pet, owner };
          })
        );
        petList = petsWithOwners;
      } else {
        // Buscar todos os pets
        petList = await PetService.getAll();
        const petsWithOwners = await Promise.all(
          petList.map(async (pet) => {
            const owner = await ClientService.getById(pet.clientId || pet.client_id);
            return { ...pet, owner };
          })
        );
        petList = petsWithOwners;
      }
      
      setPets(petList);
      setFilteredPets(petList);
    } catch (error) {
      console.error('Erro ao carregar pets:', error);
      Alert.alert('Erro', 'Erro ao carregar pets');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPets();
    setRefreshing(false);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredPets(pets);
    } else {
      const filtered = await PetService.search(query, clientIdFromRoute);
      const filteredWithOwners = await Promise.all(
        filtered.map(async (pet) => {
          const owner = await ClientService.getById(pet.clientId || pet.client_id);
          return { ...pet, owner };
        })
      );
      setFilteredPets(filteredWithOwners);
    }
  };

  const handleDeletePet = (pet) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir o pet ${pet.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => deletePet(pet.id)
        }
      ]
    );
  };

  const deletePet = async (petId) => {
    try {
      const result = await PetService.delete(petId);
      if (result.success) {
        await loadPets();
        Alert.alert('Sucesso', 'Pet excluído com sucesso');
      } else {
        Alert.alert('Erro', result.error);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao excluir pet');
    }
  };

  const handlePetPress = (pet) => {
    Alert.alert(
      pet.name,
      `Espécie: ${pet.species}\nRaça: ${pet.breed || 'Não informada'}\nIdade: ${pet.birth_date ? calculateAge(pet.birth_date) : 'Não informada'}\nProprietário: ${pet.owner?.name || 'Não encontrado'}`,
      [
        { text: 'OK' },
        { text: 'Editar', onPress: () => navigation.navigate('NewPet', { petId: pet.id }) },
        { text: 'Nova Consulta', onPress: () => navigation.navigate('NewConsultation', { 
          petId: pet.id, 
          clientId: pet.clientId || pet.client_id 
        }) }
      ]
    );
  };

  const getSpeciesIcon = (species) => {
    switch (species) {
      case 'Cão': return 'paw';
      case 'Gato': return 'paw';
      case 'Pássaro': return 'airplane';
      case 'Peixe': return 'fish';
      default: return 'heart';
    }
  };

  const getGenderIcon = (gender) => {
    return gender === 'Macho' ? 'male' : 'female';
  };

  const getGenderColor = (gender) => {
    return gender === 'Macho' ? Colors.info : Colors.warning;
  };

  const renderPetItem = ({ item }) => (
    <Card style={styles.petCard}>
      <TouchableOpacity
        onPress={() => handlePetPress(item)}
        style={styles.petContent}
      >
        <View style={styles.petHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons 
              name={getSpeciesIcon(item.species)} 
              size={24} 
              color={Colors.primary} 
            />
          </View>
          <View style={styles.petInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.petName}>{item.name}</Text>
              <Ionicons 
                name={getGenderIcon(item.gender)} 
                size={16} 
                color={getGenderColor(item.gender)} 
              />
            </View>
            <Text style={styles.petSpecies}>
              {item.species} • {item.breed || 'Raça não informada'}
            </Text>
            <Text style={styles.petOwner}>
              🏠 {item.owner?.name || 'Proprietário não encontrado'}
            </Text>
            {item.birth_date && (
              <Text style={styles.petAge}>
                🎂 {calculateAge(item.birth_date)}
              </Text>
            )}
          </View>
          <View style={styles.petStats}>
            {item.weight && (
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{item.weight}</Text>
                <Text style={styles.statLabel}>kg</Text>
              </View>
            )}
          </View>
        </View>
        
        {item.color && (
          <View style={styles.petDetails}>
            <Text style={styles.detailText}>🎨 {item.color}</Text>
            {item.microchip && (
              <Text style={styles.detailText}>🔘 {item.microchip}</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => navigation.navigate('NewPet', { petId: item.id })}
        >
          <Ionicons name="create" size={16} color={Colors.primary} />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.consultaButton]}
          onPress={() => navigation.navigate('NewConsultation', { 
            petId: item.id, 
            clientId: item.clientId || item.client_id 
          })}
        >
          <Ionicons name="medical" size={16} color={Colors.success} />
          <Text style={styles.consultaButtonText}>Consulta</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeletePet(item)}
        >
          <Ionicons name="trash" size={16} color={Colors.error} />
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const EmptyState = () => (
    <View style={globalStyles.emptyState}>
      <Ionicons
        name="paw-outline"
        size={64}
        color={Colors.textSecondary}
        style={globalStyles.emptyStateIcon}
      />
      <Text style={globalStyles.emptyStateTitle}>
        {clientIdFromRoute ? 'לא נרשמו חיות מחמד ללקוח זה' : 'לא נמצאו חיות מחמד'}
      </Text>
      <Text style={globalStyles.emptyStateText}>
        {searchQuery ? 'נסו חיפוש אחר' : 'צרו את חיית המחמד הראשונה כדי להתחיל'}
      </Text>
      {!searchQuery && (
        <Button
          title="הוספת חיית מחמד"
          onPress={() => navigation.navigate('NewPet', clientIdFromRoute ? { clientId: clientIdFromRoute } : {})}
          style={globalStyles.emptyStateButton}
        />
      )}
    </View>
  );

  if (loading) {
    return <Loading message="טוען חיות מחמד..." />;
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.header}>
        <Input
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="חיפוש חיות מחמד..."
          leftIcon="search"
          style={styles.searchInput}
        />
        <Button
          title="חדש"
          onPress={() => navigation.navigate('NewPet', clientIdFromRoute ? { clientId: clientIdFromRoute } : {})}
          style={styles.newButton}
          icon={<Ionicons name="add" size={16} color={Colors.surface} />}
        />
      </View>

      {clientIdFromRoute && (
        <View style={styles.filterInfo}>
          <Text style={styles.filterText}>
            מציג חיות מחמד של לקוח מסוים
          </Text>
          <TouchableOpacity onPress={() => navigation.setParams({ clientId: null })}>
            <Text style={styles.clearFilterText}>הצגת כל חיות המחמד</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filteredPets}
        keyExtractor={(item) => item.id}
        renderItem={renderPetItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={EmptyState}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    marginRight: 12,
    marginBottom: 0,
  },
  newButton: {
    paddingHorizontal: 16,
  },
  filterInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: `${Colors.info}20`,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterText: {
    fontSize: 14,
    color: Colors.info,
    fontWeight: '500',
  },
  clearFilterText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  petCard: {
    marginBottom: 12,
  },
  petContent: {
    marginBottom: 16,
  },
  petHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  petInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginRight: 8,
  },
  petSpecies: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  petOwner: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  petAge: {
    fontSize: 14,
    color: Colors.primary,
    marginTop: 2,
    fontWeight: '500',
  },
  petStats: {
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  petDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 66,
  },
  detailText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginRight: 16,
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 2,
  },
  editButton: {
    backgroundColor: Colors.background,
  },
  editButtonText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  consultaButton: {
    backgroundColor: Colors.background,
  },
  consultaButtonText: {
    color: Colors.success,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  deleteButton: {
    backgroundColor: Colors.background,
  },
  deleteButtonText: {
    color: Colors.error,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default PetListScreen;