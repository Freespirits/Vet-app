import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl,
  Alert,
  StyleSheet,
  Calendar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { AppointmentService } from '../../services/AppointmentService';
import { ConsultationService } from '../../services/ConsultationService';
import { ClientService } from '../../services/ClientService';
import { PetService } from '../../services/PetService';
import { formatDate, formatTime, formatDateTime } from '../../utils/helpers';
import { Colors } from '../../constants/Colors';
import { globalStyles } from '../../styles/globalStyles';

const AgendaScreen = ({ navigation }) => {
  const [appointments, setAppointments] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('day'); // 'day', 'week', 'month'

  useFocusEffect(
    useCallback(() => {
      loadAgendaData();
    }, [selectedDate])
  );

  const loadAgendaData = async () => {
    try {
      const [allAppointments, allConsultations] = await Promise.all([
        AppointmentService.getAll(),
        ConsultationService.getAll()
      ]);

      setAppointments(allAppointments);
      setConsultations(allConsultations);
    } catch (error) {
      Alert.alert('שגיאה', 'שגיאה בטעינת היומן');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAgendaData();
    setRefreshing(false);
  };

  const getDateItems = (date) => {
    const dateString = date.toDateString();
    
    const dayAppointments = appointments.filter(appointment => 
      new Date(appointment.date).toDateString() === dateString
    );
    
    const dayConsultations = consultations.filter(consultation => 
      new Date(consultation.date).toDateString() === dateString
    );

    return [...dayAppointments, ...dayConsultations].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
  };

  const getWeekDates = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const getStatusColor = (item) => {
    const itemDate = new Date(item.date);
    const now = new Date();
    
    if (itemDate < now) {
      return Colors.textSecondary; // Passado
    } else if (itemDate.toDateString() === now.toDateString()) {
      return Colors.primary; // Hoje
    } else {
      return Colors.success; // Futuro
    }
  };

  const getItemIcon = (item) => {
    if (item.type) { // É uma consulta
      return 'medical';
    } else { // É um agendamento
      return 'calendar';
    }
  };

  const handleItemPress = (item) => {
    if (item.type) {
      // É uma consulta - mostrar detalhes
      Alert.alert(
        'ייעוץ',
        `סוג: ${item.type}\nלקוח: ${item.client?.name}\nחיית מחמד: ${item.pet?.name}\nתאריך: ${formatDateTime(item.date)}`,
        [
          { text: 'OK' },
          {
            text: 'עריכה',
            onPress: () => navigation.navigate('NewConsultation', { consultationId: item.id })
          }
        ]
      );
    } else {
      // É um agendamento - mostrar detalhes
      Alert.alert(
        'קביעת תור',
        `כותרת: ${item.title}\nלקוח: ${item.client?.name}\nחיית מחמד: ${item.pet?.name}\nתאריך: ${formatDateTime(item.date)}`,
        [
          { text: 'OK' },
          {
            text: 'עריכה',
            onPress: () => navigation.navigate('NewAppointment', { appointmentId: item.id })
          }
        ]
      );
    }
  };

  const AgendaItem = ({ item, showDate = false }) => (
    <Card style={styles.agendaItem}>
      <TouchableOpacity onPress={() => handleItemPress(item)}>
        <View style={styles.itemHeader}>
          <View style={[styles.itemIcon, { backgroundColor: getStatusColor(item) }]}>
            <Ionicons 
              name={getItemIcon(item)} 
              size={20} 
              color={Colors.surface} 
            />
          </View>
          
          <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>
              {item.title || item.type}
            </Text>
            <Text style={styles.itemSubtitle}>
              {item.client?.name} • {item.pet?.name}
            </Text>
            <Text style={styles.itemTime}>
              {showDate ? formatDateTime(item.date) : formatTime(item.date)}
            </Text>
          </View>
          
          <View style={styles.itemActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                if (item.type) {
                  navigation.navigate('NewConsultation', { consultationId: item.id });
                } else {
                  navigation.navigate('NewAppointment', { appointmentId: item.id });
                }
              }}
            >
              <Ionicons name="create" size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {item.description && (
          <View style={styles.itemDescription}>
            <Text style={styles.descriptionText}>{item.description}</Text>
          </View>
        )}

        {item.symptoms && (
          <View style={styles.itemSymptoms}>
            <Text style={styles.symptomsLabel}>תסמינים:</Text>
            <Text style={styles.symptomsText}>{item.symptoms}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Card>
  );

  const DateNavigator = () => (
    <View style={styles.dateNavigator}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => {
          const newDate = new Date(selectedDate);
          if (viewMode === 'day') {
            newDate.setDate(newDate.getDate() - 1);
          } else if (viewMode === 'week') {
            newDate.setDate(newDate.getDate() - 7);
          } else {
            newDate.setMonth(newDate.getMonth() - 1);
          }
          setSelectedDate(newDate);
        }}
      >
        <Ionicons name="chevron-back" size={24} color={Colors.primary} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.dateButton}>
        <Text style={styles.dateText}>
          {viewMode === 'day' && formatDate(selectedDate)}
          {viewMode === 'week' && `שבוע מ- ${formatDate(getWeekDates(selectedDate)[0])}`}
          {viewMode === 'month' && selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => {
          const newDate = new Date(selectedDate);
          if (viewMode === 'day') {
            newDate.setDate(newDate.getDate() + 1);
          } else if (viewMode === 'week') {
            newDate.setDate(newDate.getDate() + 7);
          } else {
            newDate.setMonth(newDate.getMonth() + 1);
          }
          setSelectedDate(newDate);
        }}
      >
        <Ionicons name="chevron-forward" size={24} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );

  const ViewModeSelector = () => (
    <View style={styles.viewModeSelector}>
      {['day', 'week', 'month'].map((mode) => (
        <TouchableOpacity
          key={mode}
          style={[
            styles.viewModeButton,
            viewMode === mode && styles.viewModeButtonActive
          ]}
          onPress={() => setViewMode(mode)}
        >
          <Text style={[
            styles.viewModeText,
            viewMode === mode && styles.viewModeTextActive
          ]}>
            {mode === 'day' ? 'יום' : mode === 'week' ? 'שבוע' : 'חודש'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const DayView = () => {
    const dayItems = getDateItems(selectedDate);
    
    return (
      <View style={styles.dayView}>
        {dayItems.length === 0 ? (
          <View style={styles.emptyDay}>
            <Ionicons name="calendar-outline" size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyDayText}>Nenhum compromisso para este dia</Text>
            <Button
              title="קבע ייעוץ"
              onPress={() => navigation.navigate('NewAppointment', { 
                selectedDate: selectedDate.toISOString() 
              })}
              style={styles.emptyDayButton}
            />
          </View>
        ) : (
          dayItems.map(item => (
            <AgendaItem key={item.id} item={item} />
          ))
        )}
      </View>
    );
  };

  const WeekView = () => {
    const weekDates = getWeekDates(selectedDate);
    
    return (
      <View style={styles.weekView}>
        <View style={styles.weekHeader}>
          {weekDates.map((date, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.weekDayHeader,
                date.toDateString() === new Date().toDateString() && styles.todayHeader
              ]}
              onPress={() => {
                setSelectedDate(date);
                setViewMode('day');
              }}
            >
              <Text style={[
                styles.weekDayName,
                date.toDateString() === new Date().toDateString() && styles.todayText
              ]}>
                {date.toLocaleDateString('pt-BR', { weekday: 'short' })}
              </Text>
              <Text style={[
                styles.weekDayNumber,
                date.toDateString() === new Date().toDateString() && styles.todayText
              ]}>
                {date.getDate()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <ScrollView style={styles.weekContent}>
          {weekDates.map((date, index) => {
            const dayItems = getDateItems(date);
            if (dayItems.length === 0) return null;
            
            return (
              <View key={index} style={styles.weekDay}>
                <Text style={styles.weekDayTitle}>
                  {date.toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                </Text>
                {dayItems.map(item => (
                  <AgendaItem key={item.id} item={item} />
                ))}
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const MonthView = () => {
    // Implementação simplificada do mês
    const monthItems = appointments.concat(consultations).filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getMonth() === selectedDate.getMonth() &&
             itemDate.getFullYear() === selectedDate.getFullYear();
    });

    return (
      <View style={styles.monthView}>
        <Text style={styles.monthTitle}>
          {selectedDate.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })}
        </Text>
        
        <ScrollView style={styles.monthContent}>
          {monthItems.length === 0 ? (
            <View style={styles.emptyMonth}>
              <Ionicons name="calendar-outline" size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyMonthText}>אין פגישות בחודש זה</Text>
            </View>
          ) : (
            monthItems
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map(item => (
                <AgendaItem key={item.id} item={item} showDate />
              ))
          )}
        </ScrollView>
      </View>
    );
  };

  if (loading) {
    return <Loading message="טוען יומן..." />;
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      {/* Header */}
      <LinearGradient
        colors={Colors.primaryGradient}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>יומן</Text>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('NewAppointment')}
          >
            <Ionicons name="add" size={24} color={Colors.surface} />
          </TouchableOpacity>
        </View>
        
        <DateNavigator />
        <ViewModeSelector />
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {viewMode === 'day' && <DayView />}
        {viewMode === 'week' && <WeekView />}
        {viewMode === 'month' && <MonthView />}

        {/* Estatísticas rápidas */}
        <Card style={styles.statsCard}>
          <Text style={styles.statsTitle}>סיכום היומן</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {appointments.filter(a => 
                  new Date(a.date).toDateString() === new Date().toDateString()
                ).length}
              </Text>
              <Text style={styles.statLabel}>היום</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {appointments.filter(a => {
                  const date = new Date(a.date);
                  const now = new Date();
                  return date > now && date.getDate() === now.getDate() + 1;
                }).length}
              </Text>
              <Text style={styles.statLabel}>מחר</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {appointments.filter(a => {
                  const date = new Date(a.date);
                  const now = new Date();
                  const nextWeek = new Date();
                  nextWeek.setDate(now.getDate() + 7);
                  return date > now && date <= nextWeek;
                }).length}
              </Text>
              <Text style={styles.statLabel}>השבוע</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.surface,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateNavigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateButton: {
    flex: 1,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.surface,
  },
  viewModeSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    padding: 4,
    marginHorizontal: 20,
  },
  viewModeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  viewModeButtonActive: {
    backgroundColor: Colors.surface,
  },
  viewModeText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.surface,
  },
  viewModeTextActive: {
    color: Colors.primary,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  dayView: {
    padding: 16,
  },
  emptyDay: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyDayText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyDayButton: {
    paddingHorizontal: 24,
  },
  agendaItem: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  itemSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  itemTime: {
    fontSize: 14,
    color: Colors.primary,
    marginTop: 4,
    fontWeight: '500',
  },
  itemActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  itemDescription: {
    marginTop: 12,
    paddingLeft: 60,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  itemSymptoms: {
    marginTop: 12,
    paddingLeft: 60,
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
  weekView: {
    padding: 16,
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  weekDayHeader: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  todayHeader: {
    backgroundColor: Colors.primary,
  },
  weekDayName: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  weekDayNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 4,
  },
  todayText: {
    color: Colors.surface,
  },
  weekContent: {
    flex: 1,
  },
  weekDay: {
    marginBottom: 24,
  },
  weekDayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  monthView: {
    padding: 16,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  monthContent: {
    flex: 1,
  },
  emptyMonth: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyMonthText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
  statsCard: {
    margin: 16,
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