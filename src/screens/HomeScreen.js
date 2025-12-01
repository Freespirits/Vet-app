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
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { AppointmentService } from '../services/AppointmentService';
import { ConsultationService } from '../services/ConsultationService';
import { ClientService } from '../services/ClientService';
import { PetService } from '../services/PetService';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [stats, setStats] = useState({
    todayTotal: 0,
    weekTotal: 0,
    pendingTotal: 0,
    totalPatients: 0,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // טעינת נתונים אמיתיים מ-Supabase
      const [
        allAppointments,
        allConsultations,
        allClients,
        allPets
      ] = await Promise.all([
        AppointmentService.getAll(),
        ConsultationService.getAll(),
        ClientService.getAll(),
        PetService.getAll()
      ]);

      // סינון תורים של היום
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      const todayItems = allAppointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= todayStart && appointmentDate < todayEnd;
      });

      // סינון התורים הקרובים (7 הימים הבאים, ללא היום)
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      const upcomingItems = allAppointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= todayEnd && appointmentDate <= nextWeek;
      });

      // מטופלים אחרונים (5 חיות המחמד האחרונות שנרשמו)
      const sortedPets = allPets
        .sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt))
        .slice(0, 5);

      // חישוב סטטיסטיקות
      const weekStart = new Date();
      weekStart.setDate(today.getDate() - 7);
      
      const weekItems = allAppointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= weekStart;
      });

      setTodayAppointments(todayItems);
      setUpcomingAppointments(upcomingItems);
      setRecentPatients(sortedPets);
      setStats({
        todayTotal: todayItems.length,
        weekTotal: weekItems.length,
        pendingTotal: allAppointments.filter(a => a.status === 'scheduled').length,
        totalPatients: allPets.length,
      });

    } catch (error) {
      console.error('שגיאה בטעינת נתונים:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'בוקר טוב';
    if (hour < 18) return 'צהריים טובים';
    return 'ערב טוב';
  };

  const formatDate = (date, format = 'full') => {
    const d = new Date(date);
    const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
    
    switch (format) {
      case 'full':
        return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
      case 'short':
        return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
      case 'time':
        return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
      default:
        return d.toLocaleDateString('he-IL');
    }
  };

  const isToday = (date) => {
    const today = new Date();
    const checkDate = new Date(date);
    return today.toDateString() === checkDate.toDateString();
  };

  const isTomorrow = (date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const checkDate = new Date(date);
    return tomorrow.toDateString() === checkDate.toDateString();
  };

  const formatAppointmentTime = (dateTime) => {
    return formatDate(dateTime, 'time');
  };

  const getDateLabel = (date) => {
    const appointmentDate = new Date(date);
    if (isToday(appointmentDate)) return 'היום';
    if (isTomorrow(appointmentDate)) return 'מחר';
    return formatDate(appointmentDate, 'short');
  };

  const quickActions = [
    {
      id: 'new-appointment',
      title: 'בדיקה חדשה',
      subtitle: 'לתזמן בדיקה',
      icon: 'calendar-outline',
      color: Colors.primary,
      onPress: () => navigation.navigate('NewAppointment'),
    },
    {
      id: 'new-patient',
      title: 'מטופל חדש',
      subtitle: 'רישום חיית מחמד',
      icon: 'add-circle-outline',
      color: Colors.success,
      onPress: () => navigation.navigate('NewPet'),
    },
    {
      id: 'library',
      title: 'ספרייה',
      subtitle: 'תרופות',
      icon: 'library-outline',
      color: Colors.info,
      onPress: () => navigation.navigate('VetLibrary'),
    },
  ];

  const statsCards = [
    {
      title: 'היום',
      value: stats.todayTotal,
      icon: 'today-outline',
      color: Colors.primary,
      subtitle: 'בדיקות',
    },
    {
      title: 'שבוע',
      value: stats.weekTotal,
      icon: 'calendar-outline',
      color: Colors.success,
      subtitle: 'בדיקות',
    },
    {
      title: 'ממתינים',
      value: stats.pendingTotal,
      icon: 'hourglass-outline',
      color: Colors.warning,
      subtitle: 'מעקבים',
    },
    {
      title: 'מטופלים',
      value: stats.totalPatients,
      icon: 'paw-outline',
      color: Colors.info,
      subtitle: 'רשומים',
    },
  ];

  const renderQuickAction = (action) => (
    <TouchableOpacity
      key={action.id}
      style={styles.quickActionCard}
      onPress={action.onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[action.color, `${action.color}CC`]}
        style={styles.quickActionGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.quickActionIconContainer}>
          <Ionicons name={action.icon} size={24} color={Colors.surface} />
        </View>
        <View style={styles.quickActionInfo}>
          <Text style={styles.quickActionTitle}>{action.title}</Text>
          <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.surface} />
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderStatCard = (stat) => (
    <View key={stat.title} style={styles.statCard}>
      <LinearGradient
        colors={[`${stat.color}15`, `${stat.color}05`]}
        style={styles.statGradient}
      >
        <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}20` }]}>
          <Ionicons name={stat.icon} size={20} color={stat.color} />
        </View>
        <Text style={styles.statValue}>{stat.value}</Text>
        <Text style={styles.statTitle}>{stat.title}</Text>
        <Text style={styles.statSubtitle}>{stat.subtitle}</Text>
      </LinearGradient>
    </View>
  );

  const renderAppointmentCard = (appointment, showDate = false) => {
    // בדיקה שיש נתונים תקפים לפני הצגה
    if (!appointment || !appointment.id) return null;

    return (
      <TouchableOpacity
        key={appointment.id}
        style={styles.appointmentCard}
        onPress={() => {
          // ניווט רק אם קיים מזהה תקף
          if (appointment.id && typeof appointment.id === 'string' && appointment.id.length > 10) {
            navigation.navigate('AppointmentDetails', { appointmentId: appointment.id });
          } else {
            Alert.alert('מידע', `בדיקה: ${appointment.title || 'ללא כותרת'}\nלקוח: ${appointment.client?.name || 'N/A'}\nחיית מחמד: ${appointment.pet?.name || 'N/A'}`);
          }
        }}
        activeOpacity={0.7}
      >
        <View style={styles.appointmentInfo}>
          <View style={styles.appointmentHeader}>
            <Text style={styles.patientName}>{appointment.pet?.name || appointment.title || 'מטופל'}</Text>
            <Text style={styles.appointmentTime}>
              {showDate && `${getDateLabel(appointment.date)} • `}
              {formatAppointmentTime(appointment.date)}
            </Text>
          </View>
          <Text style={styles.ownerName}>{appointment.client?.name || 'בעלים'}</Text>
          <Text style={styles.appointmentType}>{appointment.title || appointment.type || 'בדיקה'}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${Colors.primary}20` }]}>
          <Ionicons name="time-outline" size={12} color={Colors.primary} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderPatientCard = (patient) => {
    // Verificar se tem dados válidos antes de renderizar
    if (!patient || !patient.id) return null;

    return (
      <TouchableOpacity
        key={patient.id}
        style={styles.patientCard}
        onPress={() => {
          // Navegar apenas se tiver ID válido
          if (patient.id && typeof patient.id === 'string' && patient.id.length > 10) {
            navigation.navigate('PatientDetails', { patientId: patient.id });
          } else {
            Alert.alert('מידע', `חיית מחמד: ${patient.name}\nבעלים: ${patient.client?.name || 'N/A'}\nמֵין: ${patient.species || 'N/A'}`);
          }
        }}
        activeOpacity={0.7}
      >
        <View style={[styles.patientAvatar, { backgroundColor: `${Colors.primary}20` }]}>
          <Ionicons name="paw" size={16} color={Colors.primary} />
        </View>
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{patient.name}</Text>
          <Text style={styles.patientOwner}>{patient.client?.name || 'בעלים'}</Text>
          <Text style={styles.patientDetails}>{patient.species} • {patient.breed || 'מעורב'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>{getGreeting()}, ד"ר</Text>
            <Text style={styles.doctorName}>וטרינר</Text>
            <Text style={styles.headerDate}>
              {formatDate(new Date(), 'full')}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <View style={styles.profileAvatar}>
              <Ionicons name="person" size={24} color={Colors.primary} />
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Cards */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>סיכום</Text>
          <View style={styles.statsGrid}>
            {statsCards.map(renderStatCard)}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>פעולות מהירות</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>

        {/* Today's Appointments */}
        <View style={styles.appointmentsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>בדיקות היום</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Agenda')}
              style={styles.seeAllButton}
            >
              <Text style={styles.seeAllText}>הצגת הכל</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          
          {todayAppointments.length > 0 ? (
            <View style={styles.appointmentsList}>
              {todayAppointments.map(appointment => renderAppointmentCard(appointment))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyTitle}>אין בדיקות היום</Text>
              <Text style={styles.emptySubtitle}>מה דעתך לקבוע בדיקה חדשה?</Text>
            </View>
          )}
        </View>

        {/* Upcoming Appointments */}
        {upcomingAppointments.length > 0 && (
          <View style={styles.appointmentsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>בדיקות קרובות</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Agenda')}
                style={styles.seeAllButton}
              >
                <Text style={styles.seeAllText}>הצגת הכל</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.appointmentsList}>
              {upcomingAppointments.map(appointment => renderAppointmentCard(appointment, true))}
            </View>
          </View>
        )}

        {/* Recent Patients */}
        {recentPatients.length > 0 && (
          <View style={styles.patientsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>מטופלים אחרונים</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Pets')}
                style={styles.seeAllButton}
              >
                <Text style={styles.seeAllText}>הצגת הכל</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.patientsScroll}
              contentContainerStyle={styles.patientsScrollContent}
            >
              {recentPatients.map(renderPatientCard)}
            </ScrollView>
          </View>
        )}

        <View style={styles.bottomPadding} />
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
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: Colors.surface,
    opacity: 0.9,
  },
  doctorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.surface,
    marginTop: 4,
  },
  headerDate: {
    fontSize: 14,
    color: Colors.surface,
    opacity: 0.8,
    marginTop: 4,
    textTransform: 'capitalize',
  },
  profileButton: {
    marginLeft: 16,
  },
  profileAvatar: {
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
  content: {
    flex: 1,
  },
  // Stats Section
  statsSection: {
    padding: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statGradient: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 4,
  },
  statSubtitle: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  // Quick Actions Section
  quickActionsSection: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  quickActionsGrid: {
    gap: 12,
  },
  quickActionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  quickActionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  quickActionInfo: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.surface,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: Colors.surface,
    opacity: 0.9,
    marginTop: 2,
  },
  // Appointments Section
  appointmentsSection: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  appointmentsList: {
    gap: 12,
  },
  appointmentCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  appointmentTime: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
  },
  ownerName: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  appointmentType: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statusBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  // Patients Section
  patientsSection: {
    paddingVertical: 10,
    paddingLeft: 20,
  },
  patientsScroll: {
    flexGrow: 0,
  },
  patientsScrollContent: {
    paddingRight: 20,
    gap: 12,
  },
  patientCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    width: 200,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  patientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientOwner: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  patientDetails: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginVertical: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  bottomPadding: {
    height: 20,
  },
});

export default HomeScreen;