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
import { ClientService } from '../../services/ClientService';
import { PetService } from '../../services/PetService';
import { formatPhone } from '../../utils/helpers';
import { Colors } from '../../constants/Colors';
import { globalStyles } from '../../styles/globalStyles';

const ClientListScreen = ({ navigation }) => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadClients();
    }, [])
  );

  const loadClients = async () => {
    try {
      const clientList = await ClientService.getAll();
      const clientsWithPets = await Promise.all(
        clientList.map(async (client) => {
          const pets = await PetService.getByClientId(client.id);
          return { ...client, petsCount: pets.length };
        })
      );
      setClients(clientsWithPets);
      setFilteredClients(clientsWithPets);
    } catch (error) {
      Alert.alert('שגיאה', 'אירעה שגיאה בעת טעינת הלקוחות');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadClients();
    setRefreshing(false);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredClients(clients);
    } else {
      const filtered = await ClientService.search(query);
      const filteredWithPets = await Promise.all(
        filtered.map(async (client) => {
          const pets = await PetService.getByClientId(client.id);
          return { ...client, petsCount: pets.length };
        })
      );
      setFilteredClients(filteredWithPets);
    }
  };

  const handleDeleteClient = (client) => {
    Alert.alert(
      'מחיקת לקוח',
      `להסיר את הלקוח ${client.name}?`,
      [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'מחיקה',
          style: 'destructive',
          onPress: () => deleteClient(client.id)
        }
      ]
    );
  };

  const deleteClient = async (clientId) => {
    try {
      const result = await ClientService.delete(clientId);
      if (result.success) {
        await loadClients();
        Alert.alert('הצלחה', 'הלקוח נמחק בהצלחה');
      } else {
        Alert.alert('שגיאה', result.error);
      }
    } catch (error) {
      Alert.alert('שגיאה', 'לא ניתן היה למחוק את הלקוח');
    }
  };

  const handleClientPress = (client) => {
    Alert.alert(
      'פרטי לקוח',
      `שם: ${client.name}\nאימייל: ${client.email}\nטלפון: ${formatPhone(client.phone)}\nמספר חיות: ${client.petsCount}`,
      [
        { text: 'סגירה' },
        { text: 'עריכה', onPress: () => navigation.navigate('NewClient', { clientId: client.id }) },
        { text: 'צפייה בחיות', onPress: () => navigation.navigate('Pets', {
          screen: 'Voltar',
          params: { clientId: client.id }
        }) }
      ]
    );
  };

  const renderClientItem = ({ item }) => (
    <Card style={styles.clientCard}>
      <TouchableOpacity
        onPress={() => handleClientPress(item)}
        style={styles.clientContent}
      >
        <View style={styles.clientHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={24} color={Colors.primary} />
          </View>
          <View style={styles.clientInfo}>
            <Text style={styles.clientName}>{item.name}</Text>
            <Text style={styles.clientEmail}>{item.email}</Text>
            <Text style={styles.clientPhone}>{formatPhone(item.phone)}</Text>
          </View>
          <View style={styles.clientStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{item.petsCount}</Text>
              <Text style={styles.statLabel}>חיות</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => navigation.navigate('NewClient', { clientId: item.id })}
        >
          <Ionicons name="create" size={16} color={Colors.primary} />
          <Text style={styles.editButtonText}>עריכה</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.petsButton]}
          onPress={() => navigation.navigate('NewPet', { clientId: item.id })}
        >
          <Ionicons name="add" size={16} color={Colors.secondary} />
          <Text style={styles.petsButtonText}>+ חיית מחמד</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteClient(item)}
        >
          <Ionicons name="trash" size={16} color={Colors.error} />
          <Text style={styles.deleteButtonText}>מחיקה</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const EmptyState = () => (
    <View style={globalStyles.emptyState}>
      <Ionicons 
        name="people-outline" 
        size={64} 
        color={Colors.textSecondary}
        style={globalStyles.emptyStateIcon}
      />
      <Text style={globalStyles.emptyStateTitle}>
        לא נמצאו לקוחות
      </Text>
      <Text style={globalStyles.emptyStateText}>
        {searchQuery ? 'נסו חיפוש אחר' : 'הוסיפו את הלקוח הראשון כדי להתחיל'}
      </Text>
      {!searchQuery && (
        <Button
          title="הוספת לקוח"
          onPress={() => navigation.navigate('NewClient')}
          style={globalStyles.emptyStateButton}
        />
      )}
    </View>
  );

  if (loading) {
    return <Loading message="טוען לקוחות..." />;
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.header}>
        <Input
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="חיפוש לקוחות..."
          leftIcon="search"
          style={styles.searchInput}
        />
        <Button
          title="חדש"
          onPress={() => navigation.navigate('NewClient')}
          style={styles.newButton}
          icon={<Ionicons name="add" size={16} color={Colors.surface} />}
        />
      </View>

      <FlatList
        data={filteredClients}
        keyExtractor={(item) => item.id}
        renderItem={renderClientItem}
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
  clientCard: {
    marginBottom: 12,
  },
  clientContent: {
    marginBottom: 16,
  },
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  clientEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  clientPhone: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  clientStats: {
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
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
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: Colors.background,
  },
  editButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  petsButton: {
    backgroundColor: Colors.background,
  },
  petsButtonText: {
    color: Colors.secondary,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  deleteButton: {
    backgroundColor: Colors.background,
  },
  deleteButtonText: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default ClientListScreen;