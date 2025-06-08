import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import { ClientService } from '../../services/ClientService';
import { PetService } from '../../services/PetService';
import { ConsultationService } from '../../services/ConsultationService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import { Colors } from '../../constants/Colors';
import { formatPhone, formatCurrency } from '../../utils/helpers';
import { validateEmail, validatePhone } from '../../utils/validators';
import { globalStyles } from '../../styles/globalStyles';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClients: 0,
    totalPets: 0,
    totalConsultations: 0,
    monthlyRevenue: 0
  });
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    profession: user?.profession || 'Veterinário(a)',
    clinic: user?.clinic || '',
    crmv: user?.crmv || '',
    phone: user?.phone || '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadStats();
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        profession: user.profession || 'Veterinário(a)',
        clinic: user.clinic || '',
        crmv: user.crmv || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const [clientStats, petStats, consultationStats, allConsultations] = await Promise.all([
        ClientService.getStats(),
        PetService.getStats(),
        ConsultationService.getStats(),
        ConsultationService.getAll()
      ]);

      // Calcular receita mensal
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
        monthlyRevenue: monthlyRevenue
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Telefone inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancelar edição - restaurar dados originais
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        profession: user?.profession || 'Veterinário(a)',
        clinic: user?.clinic || '',
        crmv: user?.crmv || '',
        phone: user?.phone || '',
      });
      setErrors({});
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setIsEditing(false);
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      } else {
        Alert.alert('Erro', result.error);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para alterar a foto.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        Alert.alert('Funcionalidade em desenvolvimento', 'Upload de foto será implementado em breve!');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao selecionar imagem');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair do aplicativo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', onPress: logout, style: 'destructive' }
      ]
    );
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const ProfileInfoItem = ({ icon, label, value, onPress }) => (
    <TouchableOpacity style={styles.infoItem} onPress={onPress} disabled={!onPress}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={20} color={Colors.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || 'Não informado'}</Text>
      </View>
      {onPress && (
        <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statContent}>
        <View style={styles.statInfo}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
          {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
        </View>
        <View style={[styles.statIcon, { backgroundColor: color }]}>
          <Ionicons name={icon} size={20} color={Colors.surface} />
        </View>
      </View>
    </View>
  );

  if (statsLoading) {
    return <Loading message="Carregando perfil..." />;
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Estatísticas rápidas */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Resumo da Clínica</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Clientes"
              value={stats.totalClients}
              icon="people"
              color={Colors.primary}
            />
            <StatCard
              title="Pets"
              value={stats.totalPets}
              icon="paw"
              color={Colors.secondary}
            />
          </View>
          <View style={styles.statsGrid}>
            <StatCard
              title="Consultas"
              value={stats.totalConsultations}
              icon="medical"
              color={Colors.info}
              subtitle="Total realizadas"
            />
            <StatCard
              title="Receita Mensal"
              value={formatCurrency(stats.monthlyRevenue)}
              icon="card"
              color={Colors.success}
              subtitle="Mês atual"
            />
          </View>
        </View>

        {/* Informações do perfil */}
        <Card style={styles.profileCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Informações Pessoais</Text>
            <TouchableOpacity
              onPress={handleEditToggle}
              style={styles.editIconButton}
            >
              <Ionicons 
                name={isEditing ? 'close' : 'create'} 
                size={20} 
                color={Colors.primary} 
              />
            </TouchableOpacity>
          </View>

          {isEditing ? (
            <View style={styles.editForm}>
              <Input
                label="Nome Completo"
                value={formData.name}
                onChangeText={(value) => updateField('name', value)}
                placeholder="Seu nome completo"
                leftIcon="person"
                error={errors.name}
                required
                autoCapitalize="words"
                returnKeyType="next"
                blurOnSubmit={false}
              />

              <Input
                label="Email"
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon="mail"
                error={errors.email}
                required
                returnKeyType="next"
                blurOnSubmit={false}
              />

              <Input
                label="Telefone"
                value={formData.phone}
                onChangeText={(value) => updateField('phone', formatPhone(value))}
                placeholder="(11) 99999-9999"
                keyboardType="phone-pad"
                leftIcon="call"
                error={errors.phone}
                returnKeyType="next"
                blurOnSubmit={false}
              />

              <Input
                label="Profissão"
                value={formData.profession}
                onChangeText={(value) => updateField('profession', value)}
                placeholder="Veterinário(a)"
                leftIcon="medical"
                autoCapitalize="words"
                returnKeyType="next"
                blurOnSubmit={false}
              />

              <Input
                label="Clínica/Hospital"
                value={formData.clinic}
                onChangeText={(value) => updateField('clinic', value)}
                placeholder="Nome da clínica"
                leftIcon="business"
                autoCapitalize="words"
                returnKeyType="next"
                blurOnSubmit={false}
              />

              <Input
                label="CRMV"
                value={formData.crmv}
                onChangeText={(value) => updateField('crmv', value.toUpperCase())}
                placeholder="12345-UF"
                leftIcon="card"
                autoCapitalize="characters"
                returnKeyType="done"
                blurOnSubmit={true}
              />

              <View style={styles.editButtons}>
                <Button
                  title="Cancelar"
                  variant="outline"
                  onPress={handleEditToggle}
                  style={styles.cancelButton}
                  disabled={loading}
                />
                <Button
                  title="Salvar"
                  onPress={handleSaveProfile}
                  loading={loading}
                  style={styles.saveButton}
                />
              </View>
            </View>
          ) : (
            <View style={styles.infoList}>
              <ProfileInfoItem
                icon="person"
                label="Nome"
                value={user?.name}
              />
              <ProfileInfoItem
                icon="mail"
                label="Email"
                value={user?.email}
              />
              <ProfileInfoItem
                icon="call"
                label="Telefone"
                value={formatPhone(user?.phone)}
              />
              <ProfileInfoItem
                icon="medical"
                label="Profissão"
                value={user?.profession}
              />
              <ProfileInfoItem
                icon="business"
                label="Clínica/Hospital"
                value={user?.clinic}
              />
              <ProfileInfoItem
                icon="card"
                label="CRMV"
                value={user?.crmv}
              />
            </View>
          )}
        </Card>

        {/* Configurações */}
        <Card style={styles.settingsCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Configurações</Text>
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Ionicons name="notifications" size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Notificações</Text>
              <Text style={styles.settingSubtitle}>Gerenciar alertas e lembretes</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Ionicons name="shield-checkmark" size={20} color={Colors.success} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Privacidade</Text>
              <Text style={styles.settingSubtitle}>Configurações de segurança</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Ionicons name="cloud" size={20} color={Colors.info} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Backup</Text>
              <Text style={styles.settingSubtitle}>Sincronização de dados</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Ionicons name="help-circle" size={20} color={Colors.warning} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Ajuda e Suporte</Text>
              <Text style={styles.settingSubtitle}>Central de ajuda e contato</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
        </Card>

        {/* Informações do app */}
        <Card style={styles.appInfoCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Sobre o App</Text>
          </View>
          
          <View style={styles.appInfoContent}>
            <Ionicons name="paw" size={48} color={Colors.primary} style={styles.appIcon} />
            <Text style={styles.appVersion}>PetCare Pro v1.0.0</Text>
            <Text style={styles.appDescription}>
              Sistema completo para gestão de clínicas veterinárias e petshops.
              Desenvolvido com React Native e Expo.
            </Text>
            <Text style={styles.appFooter}>
              © 2024 PetCare Pro - Desenvolvido com ❤️ para veterinários brasileiros
            </Text>
          </View>
        </Card>

        {/* Botão de logout */}
        <View style={styles.logoutContainer}>
          <Button
            title="Sair da Conta"
            variant="danger"
            onPress={handleLogout}
            icon={<Ionicons name="log-out" size={16} color={Colors.surface} />}
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 32,
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
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    width: (width - 48) / 2,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
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
  profileCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  editIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editForm: {
    gap: 16,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
  },
  infoList: {
    gap: 0,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  settingsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  settingSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  appInfoCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  appInfoContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  appIcon: {
    marginBottom: 12,
  },
  appVersion: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  appFooter: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  logoutContainer: {
    paddingHorizontal: 16,
  },
});

export default ProfileScreen;