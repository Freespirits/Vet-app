import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Colors } from '../../constants/Colors';

const NewMedicationScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    activeIngredient: '',
    category: '',
    description: '',
    dosage: '',
    frequency: '',
    administration: '',
    contraindications: '',
    sideEffects: '',
    species: []
  });

  const categories = [
    { id: 'antibiotico', name: 'Antibiótico', color: Colors.success },
    { id: 'anti-inflamatorio', name: 'Anti-inflamatório', color: Colors.warning },
    { id: 'analgesico', name: 'Analgésico', color: Colors.error },
    { id: 'antiparasitario', name: 'Antiparasitário', color: Colors.info },
    { id: 'corticoide', name: 'Corticoide', color: Colors.secondary },
  ];

  const speciesOptions = ['Cão', 'Gato', 'Aves', 'Bovinos', 'Equinos', 'Suínos'];

  const handleSave = () => {
    Alert.alert('Sucesso', 'Medicamento adicionado à biblioteca!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSpecies = (species) => {
    setFormData(prev => ({
      ...prev,
      species: prev.species.includes(species)
        ? prev.species.filter(s => s !== species)
        : [...prev.species, species]
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Novo Medicamento</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <Input
            label="Nome do Medicamento"
            value={formData.name}
            onChangeText={(value) => updateField('name', value)}
            placeholder="Ex: Carprofeno"
            required
          />

          <Input
            label="Princípio Ativo"
            value={formData.activeIngredient}
            onChangeText={(value) => updateField('activeIngredient', value)}
            placeholder="Ex: Carprofeno"
          />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categoria</Text>
            <View style={styles.categoriesGrid}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryOption,
                    formData.category === category.id && styles.categorySelected,
                    { borderColor: category.color }
                  ]}
                  onPress={() => updateField('category', category.id)}
                >
                  <Text style={[
                    styles.categoryText,
                    formData.category === category.id && { color: category.color }
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Input
            label="Descrição"
            value={formData.description}
            onChangeText={(value) => updateField('description', value)}
            placeholder="Descrição do medicamento"
            multiline
            numberOfLines={3}
          />

          <Input
            label="Dosagem"
            value={formData.dosage}
            onChangeText={(value) => updateField('dosage', value)}
            placeholder="Ex: 2-4 mg/kg"
          />

          <Input
            label="Frequência"
            value={formData.frequency}
            onChangeText={(value) => updateField('frequency', value)}
            placeholder="Ex: A cada 12 horas"
          />

          <Input
            label="Via de Administração"
            value={formData.administration}
            onChangeText={(value) => updateField('administration', value)}
            placeholder="Ex: Via oral"
          />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Espécies</Text>
            <View style={styles.speciesGrid}>
              {speciesOptions.map(species => (
                <TouchableOpacity
                  key={species}
                  style={[
                    styles.speciesOption,
                    formData.species.includes(species) && styles.speciesSelected
                  ]}
                  onPress={() => toggleSpecies(species)}
                >
                  <Text style={[
                    styles.speciesText,
                    formData.species.includes(species) && styles.speciesTextSelected
                  ]}>
                    {species}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Input
            label="Contraindicações"
            value={formData.contraindications}
            onChangeText={(value) => updateField('contraindications', value)}
            placeholder="Quando não usar este medicamento"
            multiline
            numberOfLines={3}
          />

          <Input
            label="Efeitos Adversos"
            value={formData.sideEffects}
            onChangeText={(value) => updateField('sideEffects', value)}
            placeholder="Possíveis efeitos colaterais"
            multiline
            numberOfLines={3}
          />
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Button
          title="Cancelar"
          variant="outline"
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
        />
        <Button
          title="Salvar"
          onPress={handleSave}
          style={styles.saveButton}
        />
      </View>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.surface,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryOption: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  categorySelected: {
    backgroundColor: `${Colors.primary}10`,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  speciesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  speciesOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  speciesSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  speciesText: {
    fontSize: 12,
    color: Colors.text,
  },
  speciesTextSelected: {
    color: Colors.surface,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 2,
  },
});

export default NewMedicationScreen;