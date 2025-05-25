import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  StyleSheet,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { MEDICAMENTOS, VACINAS, PROCEDIMENTOS } from '../../constants/Data';
import { formatCurrency } from '../../utils/helpers';
import { Colors } from '../../constants/Colors';
import { globalStyles } from '../../styles/globalStyles';

const VetLibraryScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('medicamentos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getFilteredData = () => {
    let data = [];
    switch (activeTab) {
      case 'medicamentos':
        data = MEDICAMENTOS;
        break;
      case 'vacinas':
        data = VACINAS;
        break;
      case 'procedimentos':
        data = PROCEDIMENTOS;
        break;
      default:
        data = [];
    }

    if (searchQuery.trim() === '') return data;
    
    const lowerQuery = searchQuery.toLowerCase();
    return data.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) ||
      (item.category && item.category.toLowerCase().includes(lowerQuery)) ||
      (item.species && item.species.toLowerCase().includes(lowerQuery))
    );
  };

  const openItemDetail = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const TabButton = ({ id, title, icon, active, onPress }) => (
    <TouchableOpacity
      style={[styles.tabButton, active && styles.tabButtonActive]}
      onPress={onPress}
    >
      <Ionicons 
        name={icon} 
        size={20} 
        color={active ? Colors.surface : Colors.textSecondary} 
      />
      <Text style={[styles.tabText, active && styles.tabTextActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const MedicamentoCard = ({ item }) => (
    <Card style={styles.itemCard}>
      <TouchableOpacity onPress={() => openItemDetail(item)}>
        <View style={styles.itemHeader}>
          <View style={styles.medicamentoIcon}>
            <Ionicons name="medical" size={20} color={Colors.surface} />
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemCategory}>{item.category}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
        </View>
        <View style={styles.itemDetails}>
          <Text style={styles.itemDetail}>💊 {item.dosage}</Text>
          <Text style={styles.itemDetail}>⏰ {item.frequency}</Text>
        </View>
      </TouchableOpacity>
    </Card>
  );

  const VacinaCard = ({ item }) => (
    <Card style={styles.itemCard}>
      <TouchableOpacity onPress={() => openItemDetail(item)}>
        <View style={styles.itemHeader}>
          <View style={styles.vacinaIcon}>
            <Ionicons name="shield-checkmark" size={20} color={Colors.surface} />
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemCategory}>{item.species}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
        </View>
        <View style={styles.itemDetails}>
          <Text style={styles.itemDetail}>📅 {item.schedule}</Text>
          <Text style={styles.itemDetail}>🔄 Reforço: {item.booster}</Text>
        </View>
      </TouchableOpacity>
    </Card>
  );

  const ProcedimentoCard = ({ item }) => (
    <Card style={styles.itemCard}>
      <TouchableOpacity onPress={() => openItemDetail(item)}>
        <View style={styles.itemHeader}>
          <View style={styles.procedimentoIcon}>
            <Ionicons name="fitness" size={20} color={Colors.surface} />
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemCategory}>
              {item.duration}min • {formatCurrency(item.price)}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
        </View>
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
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedItem.name}</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {activeTab === 'medicamentos' && (
              <View>
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Categoria</Text>
                  <Text style={styles.detailValue}>{selectedItem.category}</Text>
                </View>
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Dosagem</Text>
                  <Text style={styles.detailValue}>{selectedItem.dosage}</Text>
                </View>
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Frequência</Text>
                  <Text style={styles.detailValue}>{selectedItem.frequency}</Text>
                </View>
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Contraindicações</Text>
                  <Text style={styles.detailValue}>{selectedItem.contraindications}</Text>
                </View>
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Observações</Text>
                  <Text style={styles.detailValue}>{selectedItem.observations}</Text>
                </View>
              </View>
            )}

            {activeTab === 'vacinas' && (
              <View>
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Espécie</Text>
                  <Text style={styles.detailValue}>{selectedItem.species}</Text>
                </View>
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Doenças Prevenidas</Text>
                  <Text style={styles.detailValue}>
                    {selectedItem.diseases.join(', ')}
                  </Text>
                </View>
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Protocolo de Vacinação</Text>
                  <Text style={styles.detailValue}>{selectedItem.schedule}</Text>
                </View>
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Reforço</Text>
                  <Text style={styles.detailValue}>{selectedItem.booster}</Text>
                </View>
              </View>
            )}

            {activeTab === 'procedimentos' && (
              <View>
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Duração</Text>
                  <Text style={styles.detailValue}>{selectedItem.duration} minutos</Text>
                </View>
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Preço Sugerido</Text>
                  <Text style={styles.detailValue}>{formatCurrency(selectedItem.price)}</Text>
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.modalActions}>
            <Button
              title="Fechar"
              onPress={() => setModalVisible(false)}
              variant="outline"
              fullWidth
            />
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  const filteredData = getFilteredData();

  return (
    <SafeAreaView style={globalStyles.container}>
      {/* Header with Search */}
      <View style={styles.header}>
        <Input
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar na biblioteca..."
          leftIcon="search"
          style={styles.searchInput}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TabButton
          id="medicamentos"
          title="Medicamentos"
          icon="medical"
          active={activeTab === 'medicamentos'}
          onPress={() => setActiveTab('medicamentos')}
        />
        <TabButton
          id="vacinas"
          title="Vacinas"
          icon="shield-checkmark"
          active={activeTab === 'vacinas'}
          onPress={() => setActiveTab('vacinas')}
        />
        <TabButton
          id="procedimentos"
          title="Procedimentos"
          icon="fitness"
          active={activeTab === 'procedimentos'}
          onPress={() => setActiveTab('procedimentos')}
        />
      </View>

      {/* Content */}
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredData.length === 0 ? (
          <View style={globalStyles.emptyState}>
            <Ionicons 
              name="library-outline" 
              size={64} 
              color={Colors.textSecondary}
              style={globalStyles.emptyStateIcon}
            />
            <Text style={globalStyles.emptyStateTitle}>
              Nenhum item encontrado
            </Text>
            <Text style={globalStyles.emptyStateText}>
              Tente uma busca diferente ou selecione outra categoria
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.resultHeader}>
              <Text style={styles.resultCount}>
                {filteredData.length} {activeTab} encontrado{filteredData.length !== 1 ? 's' : ''}
              </Text>
            </View>

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
          </>
        )}
      </ScrollView>

      <ItemDetailModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchInput: {
    marginBottom: 0,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: Colors.background,
  },
  tabButtonActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  tabTextActive: {
    color: Colors.surface,
  },
  contentContainer: {
    padding: 16,
    flexGrow: 1,
  },
  resultHeader: {
    marginBottom: 16,
  },
  resultCount: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  itemCard: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  medicamentoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  vacinaIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  procedimentoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.info,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  itemCategory: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  itemDetails: {
    paddingLeft: 52,
  },
  itemDetail: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  modalActions: {
    padding: 16,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});

export default VetLibraryScreen;