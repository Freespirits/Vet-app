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

const PetListScreen = ({ navigation }) => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadPets();
    }, [])
  );

  const loadPets = async () => {
    try {
      const petList = await PetService.getAll();
      const petsWithOwners = await Promise.all(
        petList.map(async (pet) => {
          const owner = await ClientService.getById(pet.clientId);
          return { ...pet, owner };
        })
      );
      setPets(petsWithOwners);
      setFilteredPets(petsWithOwners);
    } catch (error) {
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
      const filtered = await PetService.search(query);
      const filteredWithOwners = await Promise.all(
        filtered.map(async (pet) => {
          const owner = await ClientService.getById(pet.clientId);
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
        onPress={() => navigation.navigate('PetDetail', { petId: item.id })}
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
            {item.birthDate && (
              <Text style={styles.petAge}>
                🎂 {calculateAge(item.birthDate)}
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
          onPress={() => navigation.navigate('NewConsultation', { petId: item.id })}
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
        Nenhum pet encontrado
      </Text>
      <Text style={globalStyles.emptyStateText}>
        {searchQuery ? 'Tente uma busca diferente' : 'Cadastre o primeiro pet para começar'}
      </Text>
      {!searchQuery && (
        <Button
          title="Cadastrar Pet"
          onPress={() => navigation.navigate('NewPet')}
          style={globalStyles.emptyStateButton}
        />
      )}
    </View>
  );

  if (loading) {
    return <Loading message="Carregando pets..." />;
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.header}>
        <Input
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Buscar pets..."
          leftIcon="search"
          style={styles.searchInput}
        />
        <Button
          title="Novo"
          onPress={() => navigation.navigate('NewPet')}
          style={styles.newButton}
          icon={<Ionicons name="add" size={16} color={Colors.surface} />}
        />
      </View>

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