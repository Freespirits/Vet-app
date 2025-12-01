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
import { PetService } from '../services/PetService';
import { ConsultationService } from '../services/ConsultationService';
import { calculateAge } from '../utils/helpers';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';

const PatientDetailsScreen = ({ navigation, route }) => {
  const { patientId } = route.params;
  const [patient, setPatient] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatient();
  }, [patientId]);

  const loadPatient = async () => {
    try {
      setLoading(true);
      const [patientData, consultationData] = await Promise.all([
        PetService.getById(patientId),
        ConsultationService.getByPetId(patientId)
      ]);
      setPatient(patientData);
      setConsultations(consultationData);
    } catch (error) {
      Alert.alert('שגיאה', 'שגיאה בטעינת פרטי המטופל');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="טוען פרטים..." />;
  }

  if (!patient) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>מטופל לא נמצא</Text>
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
        colors={[Colors.secondary, Colors.accent]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.headerBackButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>פרטי מטופל</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('NewPet', { petId: patientId })}
          >
            <Ionicons name="create" size={24} color={Colors.surface} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <Card style={styles.infoCard}>
          <Text style={styles.cardTitle}>{patient.name}</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="paw" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>מין: {patient.species}</Text>
          </View>
          
          {patient.breed && (
            <View style={styles.infoRow}>
              <Ionicons name="bookmark" size={20} color={Colors.primary} />
              <Text style={styles.infoText}>גזע: {patient.breed}</Text>
            </View>
          )}
          
          <View style={styles.infoRow}>
            <Ionicons name={patient.gender === 'Macho' ? 'male' : 'female'} size={20} color={Colors.primary} />
            <Text style={styles.infoText}>מין ביולוגי: {patient.gender}</Text>
          </View>
          
          {patient.birth_date && (
            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={20} color={Colors.primary} />
              <Text style={styles.infoText}>גיל: {calculateAge(patient.birth_date)}</Text>
            </View>
          )}
          
          {patient.weight && (
            <View style={styles.infoRow}>
              <Ionicons name="fitness" size={20} color={Colors.primary} />
              <Text style={styles.infoText}>משקל: {patient.weight} kg</Text>
            </View>
          )}
          
          {patient.color && (
            <View style={styles.infoRow}>
              <Ionicons name="color-palette" size={20} color={Colors.primary} />
              <Text style={styles.infoText}>צבע: {patient.color}</Text>
            </View>
          )}
          
          {patient.microchip && (
            <View style={styles.infoRow}>
              <Ionicons name="radio" size={20} color={Colors.primary} />
              <Text style={styles.infoText}>שבב: {patient.microchip}</Text>
            </View>
          )}
          
          {patient.notes && (
            <View style={styles.notesSection}>
              <Text style={styles.notesTitle}>תצפיות</Text>
              <Text style={styles.notesText}>{patient.notes}</Text>
            </View>
          )}
        </Card>

        {consultations.length > 0 && (
          <Card style={styles.consultationsCard}>
            <Text style={styles.consultationsTitle}>היסטוריית ייעוצים</Text>
            {consultations.slice(0, 5).map((consultation, index) => (
              <View key={consultation.id} style={styles.consultationItem}>
                <Text style={styles.consultationType}>{consultation.type}</Text>
                <Text style={styles.consultationDate}>
                  {new Date(consultation.date).toLocaleDateString('he-IL')}
                </Text>
              </View>
            ))}
            {consultations.length > 5 && (
              <Text style={styles.moreConsultations}>
                ועוד {consultations.length - 5} ייעוצים נוספים...
              </Text>
            )}
          </Card>
        )}
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
  notesSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  notesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  notesText: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  consultationsCard: {
    marginBottom: 20,
  },
  consultationsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  consultationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  consultationType: {
    fontSize: 16,
    color: Colors.text,
  },
  consultationDate: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  moreConsultations: {
    fontSize: 14,
    color: Colors.primary,
    marginTop: 8,
    fontStyle: 'italic',
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

export default PatientDetailsScreen;