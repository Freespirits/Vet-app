import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Alert,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { ClientService } from '../services/ClientService';
import { PetService } from '../services/PetService';
import { ConsultationService } from '../services/ConsultationService';
import { AppointmentService } from '../services/AppointmentService';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import { Colors } from '../constants/Colors';
import { formatDate, formatTime, formatCurrency } from '../utils/helpers';
import { globalStyles } from '../styles/globalStyles';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalClients: 0,
    totalPets: 0,
    totalConsultations: 0,
    todayConsultations: 0,
    todayAppointments: 0,
    revenue: 0,
    monthlyRevenue: 0,
  });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [recentConsultations, setRecentConsultations] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const [
        clientStats, 
        petStats, 
        consultationStats,
        todayAppts,
        upcomingAppts,
        allConsultations
      ] = await Promise.all([
        ClientService.getStats(),
        PetService.getStats(),
        ConsultationService.getStats(),
        AppointmentService.getTodayAppointments(),
        AppointmentService.getUpcomingAppointments(7),
        ConsultationService.getAll()
      ]);

      // Calcular receita
      const totalRevenue = allConsultations.reduce((sum, consultation) => 
        sum + (consultation.price || 0), 0
      );

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = allConsultations
        .filter(consultation => {
          const date = new Date(consultation.date);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        })
        .reduce((sum, consultation) => sum + (consultation.price || 0), 0);

      setStats({
        totalClients: clientStats.total,
        totalPets: petStats.total,
        totalConsultations: consultationStats.total,
        todayConsultations: consultationStats.today,
        todayAppointments: todayAppts.length,
        revenue: totalRevenue,
        monthlyRevenue: monthlyRevenue,
      });

      setTodayAppointments(todayAppts);
      setUpcomingAppointments(upcomingAppts);
      
      // Consultas recentes (últimas 5)
      setRecentConsultations(allConsultations.slice(0, 5));

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

  const StatCard = ({ title, value, icon, color, onPress, subtitle }) => (
    <TouchableOpacity 
      onPress={onPress} 
      style={[styles.statCard, { borderLeftColor: color }]}
      activeOpacity={0.7}
    >
      <View style={styles.statContent}>
        <View style={styles.statInfo}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
          {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
        </View>
        <View style={[styles.statIcon, { backgroundColor: color }]}>
          <Ionicons name={icon} size={24} color={Colors.surface} />
        </View>
      </View>
    </TouchableOpacity>
  );

  const QuickActionCard = ({ title, description, icon, color, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.quickActionCard} activeOpacity={0.7}>
      <LinearGradient
        colors={[color, `${color}80`]}
        style={styles.quickActionGradient}
      >
        <Ionicons name={icon} size={28} color={Colors.surface} />
      </LinearGradient>
      <View style={styles.quickActionContent}>
        <Text style={styles.quickActionTitle}>{title}</Text>
        <Text style={styles.quickActionDescription}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
    </TouchableOpacity>
  );

  const AppointmentItem = ({ appointment }) => (
    <TouchableOpacity style={styles.appointmentItem} activeOpacity={0.7}>
      <View style={styles.appointmentTime}>
        <Text style={styles.timeText}>{formatTime(appointment.date)}</Text>
      </View>
      <View style={styles.appointmentContent}>
        <Text style={styles.appointmentTitle}>{appointment.title}</Text>
        <Text style={styles.appointmentClient}>
          {appointment.client?.name} • {appointment.pet?.name}
        </Text>
      </View>
      <View style={[styles.appointmentStatus, { backgroundColor: Colors.success }]}>
        <Ionicons name="time" size={16} color={Colors.surface} />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <Loading message="Carregando dashboard..." />;
  }

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Bom dia' : currentHour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
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
        {/* Header Personalizado */}
        <LinearGradient
          colors={Colors.primaryGradient}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <Text style={styles.greeting}>
                {greeting}, {user?.name?.split(' ')[0] || 'Doutor(a)'} 👋
              </Text>
              <Text style={styles.subGreeting}>
                {new Date().toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
              <Text style={styles.clinicInfo}>
                📍 {user?.clinic || 'Clínica Veterinária'}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Profile')}
              style={styles.profileButton}
            >
              <Ionicons name="person" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Statistics Grid */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Visão Geral</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Clientes"
              value={stats.totalClients}
              icon="people"
              color={Colors.primary}
              onPress={() => navigation.navigate('Clients')}
            />
            <StatCard
              title="Pets"
              value={stats.totalPets}
              icon="paw"
              color={Colors.secondary}
              onPress={() => navigation.navigate('Pets')}
            />
            <StatCard
              title="Consultas Hoje"
              value={stats.todayConsultations}
              icon="medical"
              color={Colors.info}
              subtitle={`${stats.todayAppointments} agendadas`}
              onPress={() => navigation.navigate('Agenda')}
            />
            <StatCard
              title="Receita do Mês"
              value={formatCurrency(stats.monthlyRevenue)}
              icon="card"
              color={Colors.success}
              subtitle={`Total: ${formatCurrency(stats.revenue)}`}
              onPress={() => Alert.alert('Relatórios', 'Funcionalidade de relatórios financeiros será implementada em breve!')}
            />
          </View>
        </View>

        {/* Agenda de Hoje */}
        {todayAppointments.length > 0 && (
          <Card style={styles.agendaCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Agenda de Hoje</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Agenda')}>
                <Text style={styles.seeAllText}>Ver agenda completa</Text>
              </TouchableOpacity>
            </View>
            {todayAppointments.slice(0, 3).map((appointment) => (
              <AppointmentItem key={appointment.id} appointment={appointment} />
            ))}
          </Card>
        )}

        {/* Quick Actions */}
        <Card style={styles.quickActionsCard}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          
          <View style={styles.quickActionsGrid}>
            <QuickActionCard
              title="Nova Consulta"
              description="Registrar atendimento"
              icon="add-circle"
              color={Colors.primary}
              onPress={() => navigation.navigate('NewConsultation')}
            />
            
            <QuickActionCard
              title="Agendar"
              description="Novo agendamento"
              icon="calendar"
              color={Colors.info}
              onPress={() => navigation.navigate('NewAppointment')}
            />
            
            <QuickActionCard
              title="Novo Cliente"
              description="Cadastrar cliente"
              icon="person-add"
              color={Colors.secondary}
              onPress={() => navigation.navigate('NewClient')}
            />
            
            <QuickActionCard
              title="Cadastrar Pet"
              description="Adicionar pet"
              icon="paw"
              color={Colors.accent}
              onPress={() => navigation.navigate('NewPet')}
            />
            
            <QuickActionCard
              title="Biblioteca"
              description="Consultar medicamentos"
              icon="library"
              color={Colors.warning}
              onPress={() => navigation.navigate('VetLibrary')}
            />
            
            <QuickActionCard
              title="Ver Clientes"
              description="Lista de clientes"
              icon="people"
              color="#9C27B0"
              onPress={() => navigation.navigate('Clients')}
            />
          </View>
        </Card>

        {/* Próximos Agendamentos */}
        {upcomingAppointments.length > 0 && (
          <Card style={styles.upcomingCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Próximos Agendamentos</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Agenda')}>
                <Text style={styles.seeAllText}>Ver todos</Text>
              </TouchableOpacity>
            </View>
            {upcomingAppointments.slice(0, 3).map((appointment) => (
              <View key={appointment.id} style={styles.upcomingItem}>
                <View style={styles.upcomingDate}>
                  <Text style={styles.upcomingDay}>
                    {new Date(appointment.date).getDate()}
                  </Text>
                  <Text style={styles.upcomingMonth}>
                    {new Date(appointment.date).toLocaleDateString('pt-BR', { month: 'short' })}
                  </Text>
                </View>
                <View style={styles.upcomingContent}>
                  <Text style={styles.upcomingTitle}>{appointment.title}</Text>
                  <Text style={styles.upcomingDetails}>
                    {appointment.client?.name} • {formatTime(appointment.date)}
                  </Text>
                </View>
              </View>
            ))}
          </Card>
        )}

        {/* Estatísticas Detalhadas */}
        <Card style={styles.detailedStatsCard}>
          <Text style={styles.sectionTitle}>Estatísticas Detalhadas</Text>
          <View style={styles.detailedStatsGrid}>
            <View style={styles.detailedStatItem}>
              <Text style={styles.detailedStatNumber}>{stats.totalConsultations}</Text>
              <Text style={styles.detailedStatLabel}>Total de Consultas</Text>
            </View>
            <View style={styles.detailedStatItem}>
              <Text style={styles.detailedStatNumber}>
                {stats.totalConsultations > 0 ? (stats.revenue / stats.totalConsultations).toFixed(0) : 0}
              </Text>
              <Text style={styles.detailedStatLabel}>Ticket Médio</Text>
            </View>
            <View style={styles.detailedStatItem}>
              <Text style={styles.detailedStatNumber}>
                {(stats.totalPets / Math.max(stats.totalClients, 1)).toFixed(1)}
              </Text>
              <Text style={styles.detailedStatLabel}>Pets por Cliente</Text>
            </View>
          </View>
        </Card>

        {/* Empty State para usuários novos */}
        {stats.totalClients === 0 && (
          <Card style={styles.welcomeCard}>
            <LinearGradient
              colors={[Colors.primary, Colors.secondary]}
              style={styles.welcomeGradient}
            >
              <Ionicons name="paw" size={64} color={Colors.surface} style={styles.welcomeIcon} />
              <Text style={styles.welcomeTitle}>
                Bem-vindo ao PetCare Pro!
              </Text>
              <Text style={styles.welcomeText}>
                Comece cadastrando seu primeiro cliente para começar a gerenciar sua clínica veterinária de forma profissional.
              </Text>
              <TouchableOpacity
                style={styles.welcomeButton}
                onPress={() => navigation.navigate('NewClient')}
              >
                <Text style={styles.welcomeButtonText}>
                  Cadastrar Primeiro Cliente
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 32,
  },
  headerGradient: {
    marginBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 16,
  },
  headerInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.surface,
  },
  subGreeting: {
    fontSize: 14,
    color: Colors.surface,
    opacity: 0.9,
    marginTop: 4,
    textTransform: 'capitalize',
  },
  clinicInfo: {
    fontSize: 14,
    color: Colors.surface,
    opacity: 0.8,
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
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 48) / 2,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statTitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  statSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  agendaCard: {
    marginHorizontal: 16,
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
  appointmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  appointmentTime: {
    width: 60,
    alignItems: 'center',
    marginRight: 16,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  appointmentContent: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  appointmentClient: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  appointmentStatus: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionsCard: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 56) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickActionGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  quickActionDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  upcomingCard: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  upcomingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  upcomingDate: {
    width: 50,
    alignItems: 'center',
    marginRight: 16,
  },
  upcomingDay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  upcomingMonth: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  upcomingContent: {
    flex: 1,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  upcomingDetails: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  detailedStatsCard: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  detailedStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailedStatItem: {
    alignItems: 'center',
  },
  detailedStatNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  detailedStatLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  welcomeCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    overflow: 'hidden',
    padding: 0,
  },
  welcomeGradient: {
    padding: 32,
    alignItems: 'center',
  },
  welcomeIcon: {
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.surface,
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.surface,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    opacity: 0.9,
  },
  welcomeButton: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  welcomeButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;