import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { AppointmentService } from '../services/AppointmentService';
import { formatDateTime } from '../utils/helpers';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';

const AppointmentDetailsScreen = ({ navigation, route }) => {
  const { appointmentId } = route.params;
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointment();
  }, [appointmentId]);

  const loadAppointment = async () => {
    try {
      setLoading(true);
      const data = await AppointmentService.getById(appointmentId);
      setAppointment(data);
    } catch (error) {
      Alert.alert('שגיאה', 'אירעה שגיאה בעת טעינת פרטי התור');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="טוען פרטים..." />;
  }

  if (!appointment) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>התור לא נמצא</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>חזרה</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.headerBackButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>פרטי התור</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('NewAppointment', { appointmentId })}
          >
            <Ionicons name="create" size={24} color={Colors.surface} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <Card style={styles.infoCard}>
          <Text style={styles.cardTitle}>{appointment.title}</Text>
          <Text style={styles.cardDate}>{formatDateTime(appointment.date)}</Text>

          <View style={styles.infoRow}>
            <Ionicons name="person" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>לקוח: {appointment.client?.name}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="paw" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>חיית מחמד: {appointment.pet?.name}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>משך: {appointment.duration} דקות</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>סטטוס: {appointment.status}</Text>
          </View>

          {appointment.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionTitle}>תיאור</Text>
              <Text style={styles.descriptionText}>{appointment.description}</Text>
            </View>
          )}
        </Card>
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
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.surface,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  cardDate: {
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  descriptionSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AppointmentDetailsScreen;