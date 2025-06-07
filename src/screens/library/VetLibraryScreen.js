import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  StyleSheet,
  Modal,
  RefreshControl,
  Alert,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { LibraryService } from '../../services/LibraryService';
import { MEDICAMENTOS, VACINAS, PROCEDIMENTOS } from '../../constants/Data';
import { formatCurrency } from '../../utils/helpers';
import { Colors } from '../../constants/Colors';
import { globalStyles } from '../../styles/globalStyles';

const { width } = Dimensions.get('window');

const VetLibraryScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('medicamentos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [customItems, setCustomItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadCustomItems();
    }, [])
  );

  const loadCustomItems = async () => {
    setLoading(true);
    try {
      const items = await LibraryService.getAll();
      setCustomItems(items);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar itens personalizados');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCustomItems();
    setRefreshing(false);
  };

  const getFilteredData = () => {
    let defaultData = [];
    let customData = [];

    switch (activeTab) {
      case 'medicamentos':
        defaultData = MEDICAMENTOS;
        customData = customItems.filter(item => item.category === 'medicamento');
        break;
      case 'vacinas':
        defaultData = VACINAS;
        customData = customItems.filter(item => item.category === 'vacina');
        break;
      case 'procedimentos':
        defaultData = PROCEDIMENTOS;
        customData = customItems.filter(item => item.category === 'procedimento');
        break;
      default:
        defaultData = [];
        customData = [];
    }

    const allData = [...defaultData, ...customData];

    if (searchQuery.trim() === '') return allData;
    
    const lowerQuery = searchQuery.toLowerCase();
    return allData.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) ||
      (item.category && item.category.toLowerCase().includes(lowerQuery)) ||
      (item.species && item.species.toLowerCase().includes(lowerQuery)) ||
      (item.description && item.description.toLowerCase().includes(lowerQuery))
    );
  };

  const openItemDetail = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleDeleteItem = async (item) => {
    if (!item.user_id) {
      Alert.alert('Aviso', 'Não é possível excluir itens padrão do sistema');
      return;
    }

    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir "${item.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            const result = await LibraryService.delete(item.id);
            if (result.success) {
              await loadCustomItems();
              setModalVisible(false);
              Alert.alert('Sucesso', 'Item excluído com sucesso');
            } else {
              Alert.alert('Erro', result.error);
            }
          }
        }
      ]
    );
  };

  const TabButton = ({ id, title, icon, active, onPress, count }) => (
    <TouchableOpacity
      style={[styles.tabButton, active && styles.tabButtonActive]}
      onPress={onPress}
    >
      <LinearGradient
        colors={active ? [Colors.primary, Colors.secondary] : ['transparent', 'transparent']}
        style={styles.tabGradient}
      >
        <Ionicons 
          name={icon} 
          size={20} 
          color={active ? Colors.surface : Colors.textSecondary} 
        />
        <Text style={[styles.tabText, active && styles.tabTextActive]}>
          {title}
        </Text>
        {count > 0 && (
          <View style={[styles.tabBadge, active && styles.tabBadgeActive]}>
            <Text style={[styles.tabBadgeText, active && styles.tabBadgeTextActive]}>
              {count}
            </Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  const MedicamentoCard = ({ item }) => (
    <Card style={styles.itemCard}>
      <TouchableOpacity onPress={() => openItemDetail(item)}>
        <LinearGradient
          colors={[Colors.primary, `${Colors.primary}20`]}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardHeader}>
            <View style={styles.medicamentoIcon}>
              <Ionicons name="medical" size={24} color={Colors.surface} />
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
              {item.user_id && <Text style={styles.customLabel}>Personalizado</Text>}
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.surface} />
          </View>
          
          <View style={styles.itemDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="flask" size={16} color={Colors.surface} />
              <Text style={styles.itemDetail}>{item.dosage}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time" size={16} color={Colors.surface} />
              <Text style={styles.itemDetail}>{item.frequency}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Card>
  );

  const VacinaCard = ({ item }) => (
    <Card style={styles.itemCard}>
      <TouchableOpacity onPress={() => openItemDetail(item)}>
        <LinearGradient
          colors={[Colors.success, `${Colors.success}20`]}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardHeader}>
            <View style={styles.vacinaIcon}>
              <Ionicons name="shield-checkmark" size={24} color={Colors.surface} />
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemCategory}>{item.species}</Text>
              {item.user_id && <Text style={styles.customLabel}>Personalizado</Text>}
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.surface} />
          </View>
          
          <View style={styles.itemDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={16} color={Colors.surface} />
              <Text style={styles.itemDetail}>{item.schedule}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="refresh" size={16} color={Colors.surface} />
              <Text style={styles.itemDetail}>Reforço: {item.booster}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Card>
  );

  const ProcedimentoCard = ({ item }) => (
    <Card style={styles.itemCard}>
      <TouchableOpacity onPress={() => openItemDetail(item)}>
        <LinearGradient
          colors={[Colors.info, `${Colors.info}20`]}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardHeader}>
            <View style={styles.procedimentoIcon}>
              <Ionicons name="fitness" size={24} color={Colors.surface} />
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemCategory}>
                {item.duration}min • {formatCurrency(item.price)}
              </Text>
              {item.user_id && <Text style={styles.customLabel}>Personalizado</Text>}
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.surface} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Card>
  );

  const ItemDetailModal = () => {
    if (!selectedItem) return null;

    return (
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <LinearGradient
            colors={activeTab === 'medicamentos' ? [Colors.primary, Colors.secondary] :
                   activeTab === 'vacinas' ? [Colors.success, Colors.accent] :
                   [Colors.info, Colors.secondary]}
            style={styles.modalHeader}
          >
            <View style={styles.modalHeaderContent}>
              <Text style={styles.modalTitle}>{selectedItem.name}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={Colors.surface} />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <ScrollView style={styles.modalContent}>
            {activeTab === 'medicamentos' && (
              <View>
                <DetailSection label="Categoria" value={selectedItem.category} icon="medical" />
                <DetailSection label="Dosagem" value={selectedItem.dosage} icon="flask" />
                <DetailSection label="Frequência" value={selectedItem.frequency} icon="time" />
                <DetailSection 
                  label="Contraindicações" 
                  value={selectedItem.contraindications} 
                  icon="warning" 
                />
                <DetailSection 
                  label="Observações" 
                  value={selectedItem.observations} 
                  icon="document-text" 
                />
              </View>
            )}

            {activeTab === 'vacinas' && (
              <View>
                <DetailSection label="Espécie" value={selectedItem.species} icon="paw" />
                <DetailSection 
                  label="Doenças Prevenidas" 
                  value={selectedItem.diseases?.join(', ')} 
                  icon="shield-checkmark" 
                />
                <DetailSection 
                  label="Protocolo de Vacinação" 
                  value={selectedItem.schedule} 
                  icon="calendar" 
                />
                <DetailSection label="Reforço" value={selectedItem.booster} icon="refresh" />
              </View>
            )}

            {activeTab === 'procedimentos' && (
              <View>
                <DetailSection 
                  label="Duração" 
                  value={`${selectedItem.duration} minutos`} 
                  icon="time" 
                />
                <DetailSection 
                  label="Preço Sugerido" 
                  value={formatCurrency(selectedItem.price)} 
                  icon="card" 
                />
                {selectedItem.description && (
                  <DetailSection 
                    label="Descrição" 
                    value={selectedItem.description} 
                    icon="document-text" 
                  />
                )}
              </View>
            )}

            {selectedItem.custom_fields && (
              <View style={styles.customFieldsSection}>
                <Text style={styles.customFieldsTitle}>Campos Personalizados</Text>
                {Object.entries(selectedItem.custom_fields).map(([key, value]) => (
                  <DetailSection 
                    key={key}
                    label={key} 
                    value={value} 
                    icon="construct" 
                  />
                ))}
              </View>
            )}
          </ScrollView>

          <View style={styles.modalActions}>
            {selectedItem.user_id && (
              <Button
                title="Excluir"
                variant="danger"
                onPress={() => handleDeleteItem(selectedItem)}
                style={styles.deleteButton}
                icon={<Ionicons name="trash" size={16} color={Colors.surface} />}
              />
            )}
            <Button
              title="Fechar"
              onPress={() => setModalVisible(false)}
              variant="outline"
              style={styles.closeModalButton}
            />
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  const DetailSection = ({ label, value, icon }) => (
    <View style={styles.detailSection}>
      <View style={styles.detailHeader}>
        <Ionicons name={icon} size={20} color={Colors.primary} />
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <Text style={styles.detailValue}>{value || 'Não informado'}</Text>
    </View>
  );

  const AddItemModal = () => (
    <Modal
      visible={addModalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setAddModalVisible(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.addModalHeader}>
          <Text style={styles.addModalTitle}>Adicionar {activeTab.slice(0, -1)}</Text>
          <TouchableOpacity
            onPress={() => setAddModalVisible(false)}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.addModalSubtitle}>
          Funcionalidade em desenvolvimento. Em breve você poderá adicionar seus próprios itens à biblioteca!
        </Text>
        <Button
          title="Fechar"
          onPress={() => setAddModalVisible(false)}
          style={styles.addModalButton}
        />
      </SafeAreaView>
    </Modal>
  );

  if (loading) {
    return <Loading message="Carregando biblioteca..." />;
  }

  const filteredData = getFilteredData();
  const medicamentosCount = MEDICAMENTOS.length + customItems.filter(i => i.category === 'medicamento').length;
  const vacinasCount = VACINAS.length + customItems.filter(i => i.category === 'vacina').length;
  const procedimentosCount = PROCEDIMENTOS.length + customItems.filter(i => i.category === 'procedimento').length;

  return (
    <SafeAreaView style={globalStyles.container}>
      {/* Header elegante */}
      <LinearGradient
        colors={[Colors.primary, Colors.secondary]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Biblioteca Veterinária</Text>
          <Text style={styles.headerSubtitle}>
            Consulte medicamentos, vacinas e procedimentos
          </Text>
        </View>
        
        <View style={styles.searchContainer}>
          <Input
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar na biblioteca..."
            leftIcon="search"
            style={styles.searchInput}
          />
        </View>
      </LinearGradient>

      {/* Tabs elegantes */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TabButton
            id="medicamentos"
            title="Medicamentos"
            icon="medical"
            active={activeTab === 'medicamentos'}
            onPress={() => setActiveTab('medicamentos')}
            count={medicamentosCount}
          />
          <TabButton
            id="vacinas"
            title="Vacinas"
            icon="shield-checkmark"
            active={activeTab === 'vacinas'}
            onPress={() => setActiveTab('vacinas')}
            count={vacinasCount}
          />
          <TabButton
            id="procedimentos"
            title="Procedimentos"
            icon="fitness"
            active={activeTab === 'procedimentos'}
            onPress={() => setActiveTab('procedimentos')}
            count={procedimentosCount}
          />
        </ScrollView>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setAddModalVisible(true)}
        >
          <Ionicons name="add" size={24} color={Colors.surface} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {filteredData.length === 0 ? (
          <View style={styles.emptyState}>
            <LinearGradient
              colors={[`${Colors.primary}10`, `${Colors.secondary}10`]}
              style={styles.emptyStateGradient}
            >
              <Ionicons 
                name="library-outline" 
                size={64} 
                color={Colors.textSecondary}
                style={styles.emptyStateIcon}
              />
              <Text style={styles.emptyStateTitle}>
                Nenhum item encontrado
              </Text>
              <Text style={styles.emptyStateText}>
                {searchQuery ? 
                  'Tente uma busca diferente ou selecione outra categoria' :
                  'Adicione itens personalizados à sua biblioteca'
                }
              </Text>
              <Button
                title="Adicionar Item"
                onPress={() => setAddModalVisible(true)}
                style={styles.emptyStateButton}
                icon={<Ionicons name="add" size={16} color={Colors.surface} />}
              />
            </LinearGradient>
          </View>
        ) : (
          <>
            <View style={styles.resultHeader}>
              <Text style={styles.resultCount}>
                {filteredData.length} {activeTab} encontrado{filteredData.length !== 1 ? 's' : ''}
              </Text>
              {customItems.length > 0 && (
                <Text style={styles.customCount}>
                  {customItems.filter(item => 
                    activeTab === 'medicamentos' ? item.category === 'medicamento' :
                    activeTab === 'vacinas' ? item.category === 'vacina' :
                    item.category === 'procedimento'
                  ).length} personalizados
                </Text>
              )}
            </View>

            <View style={styles.itemsGrid}>
              {activeTab === 'medicamentos' && 
                filteredData.map(item => (
                  <MedicamentoCard key={item.id} item={item} />
                ))
              }

              {activeTab === 'vacinas' && 
                filteredData.map(item => (
                  <VacinaCard key={item.id} item={item} />
                ))
              }

              {activeTab === 'procedimentos' && 
                filteredData.map(item => (
                  <ProcedimentoCard key={item.id} item={item} />
                ))
              }
            </View>
          </>
        )}
      </ScrollView>

      <ItemDetailModal />
      <AddItemModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.surface,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.surface,
    opacity: 0.9,
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
  },
  searchInput: {
    marginBottom: 0,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: 16,
    paddingLeft: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabButton: {
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  tabTextActive: {
    color: Colors.surface,
  },
  tabBadge: {
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  tabBadgeActive: {
    backgroundColor: Colors.surface,
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  tabBadgeTextActive: {
    color: Colors.primary,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  contentContainer: {
    padding: 16,
    flexGrow: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultCount: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
  },
  customCount: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  itemsGrid: {
    gap: 12,
  },
  itemCard: {
    marginBottom: 0,
    overflow: 'hidden',
    borderRadius: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  medicamentoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  vacinaIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  procedimentoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.surface,
  },
  itemCategory: {
    fontSize: 14,
    color: Colors.surface,
    opacity: 0.9,
    marginTop: 2,
  },
  customLabel: {
    fontSize: 12,
    color: Colors.surface,
    opacity: 0.8,
    marginTop: 4,
    fontStyle: 'italic',
  },
  itemDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDetail: {
    fontSize: 14,
    color: Colors.surface,
    opacity: 0.9,
    marginLeft: 8,
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyStateGradient: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 20,
    width: '100%',
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyStateButton: {
    paddingHorizontal: 24,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  modalHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.surface,
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  detailSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  detailValue: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  customFieldsSection: {
    marginTop: 16,
  },
  customFieldsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  deleteButton: {
    flex: 1,
  },
  closeModalButton: {
    flex: 1,
  },
  addModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  addModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  addModalSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    padding: 32,
    lineHeight: 22,
  },
  addModalButton: {
    margin: 20,
  },
});

export default VetLibraryScreen;