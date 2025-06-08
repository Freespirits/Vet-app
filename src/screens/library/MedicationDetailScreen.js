import React from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';

const MedicationDetailScreen = ({ navigation, route }) => {
  const { medication } = route.params;

  const getCategoryColor = (category) => {
    const colors = {
      'antibiotico': Colors.success,
      'anti-inflamatorio': Colors.warning,
      'analgesico': Colors.error,
      'antiparasitario': Colors.info,
      'corticoide': Colors.secondary,
    };
    return colors[category] || Colors.primary;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[getCategoryColor(medication.category), `${getCategoryColor(medication.category)}CC`]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.surface} />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{medication.name}</Text>
            <Text style={styles.headerSubtitle}>{medication.activeIngredient}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.sectionText}>{medication.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Posologia</Text>
          <View style={styles.dosageInfo}>
            <View style={styles.dosageItem}>
              <Ionicons name="scale" size={20} color={Colors.primary} />
              <View style={styles.dosageTexts}>
                <Text style={styles.dosageLabel}>Dosagem</Text>
                <Text style={styles.dosageValue}>{medication.dosage}</Text>
              </View>
            </View>
            <View style={styles.dosageItem}>
              <Ionicons name="time" size={20} color={Colors.primary} />
              <View style={styles.dosageTexts}>
                <Text style={styles.dosageLabel}>Frequência</Text>
                <Text style={styles.dosageValue}>{medication.frequency}</Text>
              </View>
            </View>
            <View style={styles.dosageItem}>
              <Ionicons name="medical" size={20} color={Colors.primary} />
              <View style={styles.dosageTexts}>
                <Text style={styles.dosageLabel}>Via de Administração</Text>
                <Text style={styles.dosageValue}>{medication.administration}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Espécies</Text>
          <View style={styles.speciesContainer}>
            {medication.species.map((species, index) => (
              <View key={index} style={styles.speciesBadge}>
                <Text style={styles.speciesText}>{species}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contraindicações</Text>
          <Text style={styles.warningText}>{medication.contraindications}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Efeitos Adversos</Text>
          <Text style={styles.warningText}>{medication.sideEffects}</Text>
        </View>
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
    paddingHorizontal: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitleContainer: {
    flex: 1,
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
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  dosageInfo: {
    gap: 16,
  },
  dosageItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dosageTexts: {
    marginLeft: 12,
    flex: 1,
  },
  dosageLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  dosageValue: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  speciesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  speciesBadge: {
    backgroundColor: `${Colors.primary}15`,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  speciesText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  warningText: {
    fontSize: 16,
    color: Colors.error,
    lineHeight: 24,
    fontWeight: '500',
  },
});

export default MedicationDetailScreen;