import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl,
  Alert,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { ConsultationService } from '../../services/ConsultationService';
import { ClientService } from '../../services/ClientService';
import { PetService } from '../../services/PetService';
import { formatDate, formatTime, formatDateTime } from '../../utils/helpers';
import { Colors } from '../../constants/Colors';
import { globalStyles } from '../../styles/globalStyles';

const AgendaScreen = ({ navigation }) => {
  const [consultations, setConsultations] = useState([]);
  const [todayConsultations, setTodayConsultations] = useState([]);
  const [upcomingConsultations, setUpcomingConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useFocusEffect(
    useCallback(() => {
      loadConsultations();
    }, [])
  );

  const loadConsultations = async () => {
    try {
      const allConsultations = await ConsultationService.getAll();
      
      // Enriquecer consultas com dados do cliente e pet
      const enrichedConsultations = await Promise.all(
        allConsultations.map(async (consultation) => {
          const [client, pet] = await Promise.all([
            ClientService.getById(consultation.clientId),
            PetService.getById(consultation.petId),
          ]);
          return { ...consultation, client, pet };
        })
      );

      setConsultations(enrichedConsultations);
      
      // Filtrar consultas de hoje
      const today = new Date().toDateString();
      const todayItems = enrichedConsultations.filter(consultation => 
        new Date(consultation.date).toDateString() === today
      ).sort((a, b) => new Date(a.date) - new Date(b.date));
      
      setTodayConsultations(todayItems);

      // Filtrar próximas consultas (próximos 7 dias, excluindo hoje)
      const now = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(now.getDate() + 7);
      
      const upcomingItems = enrichedConsultations.filter(consultation => {
        const consultationDate = new Date(consultation.date);
        return consultationDate > now && consultationDate <= nextWeek;
      }).sort((a, b) => new Date(a.date) - new Date(b.date));
      
      setUpcomingConsultations(upcomingItems);

    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar agenda');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadConsultations();
    setRefreshing(false);
  };

  const getStatusColor = (consultation) => {
    const consultationDate = new Date(consultation.date);
    const now = new Date();
    
    if (consultationDate < now) {
      return Colors.textSecondary; // Passado
    } else if (consultationDate.toDateString() === now.toDateString()) {
      return Colors.primary; // Hoje
    } else {
      return Colors.success; // Futuro
    }
  };

  const getStatusText = (consultation) => {
    const consultationDate = new Date(consultation.date);
    const now = new Date();
    
    if (consultationDate < now) {
      return 'Realizada';
    } else if (consultationDate.toDateString() === now.toDateString()) {
      return 'Hoje';
    } else {
      return 'Agendada';
    }
  };

  const ConsultationCard = ({ consultation, showDate = false }) => (
    <Card style={styles.consultationCard}>
      <TouchableOpacity
        onPress={() => navigation.navigate('ConsultationDetail', { 
          consultationId: consultation.id 
        })}
      >
        <View style={styles.consultationHeader}>
          <View style={styles.consultationTime}>
            <Text style={styles.timeText}>
              {showDate ? formatDateTime(consultation.date) : formatTime(consultation.date)}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(consultation) }]}>
              <Text style={styles.statusText}>{getStatusText(consultation)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.consultationContent}>
          <View style={styles.patientInfo}>
            <View style={styles.petIcon}>
              <Ionicons name="paw" size={20} color={Colors.primary} />
            </View>
            <View style={styles.patientDetails}>
              <Text style={styles.petName}>
                {consultation.pet?.name || 'Pet não encontrado'}
              </Text>
              <Text style={styles.clientName}>
                {consultation.client?.name || 'Cliente não encontrado'}
              </Text>
              <Text style={styles.consultationType}>
                {consultation.type}
              </Text>
            </View>
          </View>

          {consultation.symptoms && (
            <View style={styles.symptomsContainer}>
              <Text style={styles.symptomsLabel}>Sintomas:</Text>
              <Text style={styles.symptomsText} numberOfLines={2}>
                {consultation.symptoms}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Card>
  );

  const EmptyState = ({ title, subtitle, icon }) => (
    <View style={styles.emptySection}>
      <Ionicons name={icon} size={48} color={Colors.textSecondary} />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{subtitle}</Text>
    </View>
  );

  if (loading) {
    return <Loading message="Carregando agenda..." />;
  }

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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.dateInfo}>
            <Text style={styles.currentDate}>
              {formatDate(new Date())}
            </Text>
            <Text style={styles.greeting}>
              Sua agenda de hoje
            </Text>
          </View>
          <Button
            title="Nova Consulta"
            onPress={() => navigation.navigate('NewConsultation')}
            style={styles.newButton}
            size="small"
            icon={<Ionicons name="add" size={16} color={Colors.surface} />}
          />
        </View>

        {/* Consultas de Hoje */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Hoje ({todayConsultations.length})</Text>
          </View>

          {todayConsultations.length === 0 ? (
            <EmptyState
              title="Nenhuma consulta hoje"
              subtitle="Aproveite para organizar seus materiais ou estudar casos"
              icon="calendar-outline"
            />
          ) : (
            todayConsultations.map(consultation => (
              <ConsultationCard 
                key={consultation.id} 
                consultation={consultation} 
              />
            ))
          )}
        </View>

        {/* Próximas Consultas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time" size={20} color={Colors.success} />
            <Text style={styles.sectionTitle}>
              Próximos 7 dias ({upcomingConsultations.length})
            </Text>
          </View>

          {upcomingConsultations.length === 0 ? (
            <EmptyState
              title="Nenhuma consulta agendada"
              subtitle="Que tal entrar em contato com alguns clientes?"
              icon="time-outline"
            />
          ) : (
            upcomingConsultations.map(consultation => (
              <ConsultationCard 
                key={consultation.id} 
                consultation={consultation} 
                showDate={true}
              />
            ))
          )}
        </View>

        {/* Ações Rápidas */}
        <Card style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>Ações Rápidas</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('NewConsultation')}
            >
              <Ionicons name="add-circle" size={24} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Nova Consulta</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('ConsultationHistory')}
            >
              <Ionicons name="list" size={24} color={Colors.secondary} />
              <Text style={styles.actionButtonText}>Histórico</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('VetLibrary')}
            >
              <Ionicons name="library" size={24} color={Colors.info} />
              <Text style={styles.actionButtonText}>Biblioteca</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Estatísticas Rápidas */}
        <Card style={styles.statsCard}>
          <Text style={styles.statsTitle}>Resumo</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{todayConsultations.length}</Text>
              <Text style={styles.statLabel}>Hoje</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{upcomingConsultations.length}</Text>
              <Text style={styles.statLabel}>Próximas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{consultations.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  dateInfo: {
    flex: 1,
  },
  currentDate: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  greeting: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  newButton: {
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  consultationCard: {
    marginBottom: 12,
  },
  consultationHeader: {
    marginBottom: 12,
  },
  consultationTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: Colors.surface,
    fontWeight: '500',
  },
  consultationContent: {
    marginTop: 8,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  petIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  patientDetails: {
    flex: 1,
  },
  petName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  clientName: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  consultationType: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: 2,
    fontWeight: '500',
  },
  symptomsContainer: {
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.warning,
  },
  symptomsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  symptomsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  emptySection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  actionsCard: {
    marginBottom: 16,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
  },
  actionButtonText: {
    fontSize: 12,
    color: Colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  statsCard: {
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});

export default AgendaScreen;