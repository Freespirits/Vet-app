import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { ClientService } from '../services/ClientService';
import { PetService } from '../services/PetService';
import { ConsultationService } from '../services/ConsultationService';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import { Colors } from '../constants/Colors';
import { formatDate, formatTime } from '../utils/helpers';
import { globalStyles } from '../styles/globalStyles';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalClients: 0,
    totalPets: 0,
    totalConsultations: 0,
    todayConsultations: 0,
  });
  const [recentConsultations, setRecentConsultations] = useState([]);

  // Recarregar dados quando a tela receber foco
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const [clientStats, petStats, consultationStats] = await Promise.all([
        ClientService.getStats(),
        PetService.getStats(),
        ConsultationService.getStats(),
      ]);

      setStats({
        totalClients: clientStats.total,
        totalPets: petStats.total,
        totalConsultations: consultationStats.total,
        todayConsultations: consultationStats.today,
      });

      // Carregar consultas recentes com detalhes
      const allConsultations = await ConsultationService.getAll();
      const recentConsultationsWithDetails = await Promise.all(
        allConsultations
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)
          .map(async (consultation) => {
            const [client, pet] = await Promise.all([
              ClientService.getById(consultation.clientId),
              PetService.getById(consultation.petId),
            ]);
            return { ...consultation, client, pet };
          })
      );

      setRecentConsultations(recentConsultationsWithDetails);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Erro ao carregar dados da dashboard');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const StatCard = ({ title, value, icon, color, onPress }) => (
    <TouchableOpacity 
      onPress={onPress} 
      style={[styles.statCard, { borderLeftColor: color }]}
      activeOpacity={0.7}
    >
      <View style={styles.statContent}>
        <View style={styles.statInfo}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
        <View style={[styles.statIcon, { backgroundColor: color }]}>
          <Ionicons name={icon} size={24} color={Colors.surface} />
        </View>
      </View>
    </TouchableOpacity>
  );

  const QuickActionCard = ({ title, description, icon, color, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.quickActionCard} activeOpacity={0.7}>
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color={Colors.surface} />
      </View>
      <View style={styles.quickActionContent}>
        <Text style={styles.quickActionTitle}>{title}</Text>
        <Text style={styles.quickActionDescription}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
    </TouchableOpacity>
  );

  if (loading) {
    return <Loading message="Carregando dashboard..." />;
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView 
        contentContainerStyle={globalStyles.scrollContainer}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={styles.greeting}>
              Olá, {user?.name?.split(' ')[0] || 'Doutor(a)'}! 👋
            </Text>
            <Text style={styles.subGreeting}>
              Bem-vindo ao PetCare Pro
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Profile')}
            style={styles.profileButton}
          >
            <Ionicons name="person" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <StatCard
              title="Clientes"
              value={stats.totalClients}
              icon="people"
              color={Colors.primary}
              onPress={() => navigation.navigate('ClientList')}
            />
            <StatCard
              title="Pets"
              value={stats.totalPets}
              icon="paw"
              color={Colors.secondary}
              onPress={() => navigation.navigate('PetList')}
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              title="Hoje"
              value={stats.todayConsultations}
              icon="calendar"
              color={Colors.info}
              onPress={() => navigation.navigate('Agenda')}
            />
            <StatCard
              title="Total"
              value={stats.totalConsultations}
              icon="medical"
              color={Colors.success}
              onPress={() => navigation.navigate('ConsultationHistory')}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <Card style={styles.quickActionsCard}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          
          <QuickActionCard
            title="Nova Consulta"
            description="Registrar uma nova consulta"
            icon="add-circle"
            color={Colors.primary}
            onPress={() => navigation.navigate('NewConsultation')}
          />
          
          <QuickActionCard
            title="Cadastrar Cliente"
            description="Adicionar novo cliente"
            icon="person-add"
            color={Colors.secondary}
            onPress={() => navigation.navigate('NewClient')}
          />
          
          <QuickActionCard
            title="Cadastrar Pet"
            description="Registrar novo animal"
            icon="add"
            color={Colors.accent}
            onPress={() => navigation.navigate('NewPet')}
          />
          
          <QuickActionCard
            title="Biblioteca Veterinária"
            description="Medicamentos, vacinas e referências"
            icon="library"
            color={Colors.info}
            onPress={() => navigation.navigate('VetLibrary')}
          />
        </Card>

        {/* Recent Consultations */}
        {recentConsultations.length > 0 && (
          <Card style={styles.recentConsultationsCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Consultas Recentes</Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('ConsultationHistory')}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.seeAllText}>Ver todas</Text>
              </TouchableOpacity>
            </View>
            
            {recentConsultations.map((consultation, index) => (
              <TouchableOpacity
                key={consultation.id}
                style={[
                  styles.consultationItem,
                  index === recentConsultations.length - 1 && styles.lastConsultationItem
                ]}
                onPress={() => navigation.navigate('ConsultationDetail', { 
                  consultationId: consultation.id 
                })}
                activeOpacity={0.7}
              >
                <View style={styles.consultationIconContainer}>
                  <Ionicons 
                    name="medical" 
                    size={20} 
                    color={Colors.primary} 
                  />
                </View>
                <View style={styles.consultationInfo}>
                  <Text style={styles.consultationPet}>
                    {consultation.pet?.name || 'Pet não encontrado'}
                  </Text>
                  <Text style={styles.consultationClient}>
                    {consultation.client?.name || 'Cliente não encontrado'}
                  </Text>
                  <Text style={styles.consultationDetails}>
                    {formatDate(consultation.date)} • {consultation.type}
                  </Text>
                </View>
                <Ionicons 
                  name="chevron-forward" 
                  size={16} 
                  color={Colors.textSecondary} 
                />
              </TouchableOpacity>
            ))}
          </Card>
        )}

        {/* Empty State */}
        {stats.totalClients === 0 && (
          <Card style={styles.emptyStateCard}>
            <View style={styles.emptyStateContent}>
              <Ionicons 
                name="paw" 
                size={64} 
                color={Colors.textSecondary} 
                style={styles.emptyStateIcon}
              />
              <Text style={styles.emptyStateTitle}>
                Bem-vindo ao PetCare Pro!
              </Text>
              <Text style={styles.emptyStateText}>
                Comece cadastrando seu primeiro cliente e pet para começar a usar o sistema.
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => navigation.navigate('NewClient')}
              >
                <Text style={styles.emptyStateButtonText}>
                  Cadastrar Primeiro Cliente
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subGreeting: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    borderLeftWidth: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionsCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  quickActionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  recentConsultationsCard: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  consultationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lastConsultationItem: {
    borderBottomWidth: 0,
  },
  consultationIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  consultationInfo: {
    flex: 1,
  },
  consultationPet: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  consultationClient: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  consultationDetails: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  emptyStateCard: {
    marginBottom: 24,
  },
  emptyStateContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;