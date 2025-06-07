import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Colors } from '../../constants/Colors';
import { formatPhone } from '../../utils/helpers';
import { globalStyles } from '../../styles/globalStyles';

const ProfileScreen = ({ navigation }) => {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    profession: user?.profession || '',
    clinic: user?.clinic || '',
    crmv: user?.crmv || '',
    phone: user?.phone || '',
  });

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancelar edição - restaurar dados originais
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        profession: user?.profession || '',
        clinic: user?.clinic || '',
        crmv: user?.crmv || '',
        phone: user?.phone || '',
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
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
        // Aqui você implementaria o upload da imagem
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

  const StatCard = ({ title, value, icon, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statContent}>
        <View style={styles.statInfo}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
        <View style={[styles.statIcon, { backgroundColor: color }]}>
          <Ionicons name={icon} size={20} color={Colors.surface} />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header com foto e informações básicas */}
        <LinearGradient
          colors={Colors.primaryGradient}
          style={styles.headerGradient}
        >
          <View style={styles.profileHeader}>
            <TouchableOpacity 
              style={styles.photoContainer}
              onPress={handleImagePicker}
            >
              {user?.photo_url ? (
                <Image source={{ uri: user.photo_url }} style={styles.profilePhoto} />
              ) : (
                <View style={styles.defaultPhoto}>
                  <Ionicons name="person" size={48} color={Colors.primary} />
                </View>
              )}
              <View style={styles.photoEditIcon}>
                <Ionicons name="camera" size={16} color={Colors.surface} />
              </View>
            </TouchableOpacity>
            
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || 'Nome não informado'}</Text>
              <Text style={styles.profileProfession}>{user?.profession || 'Profissão'}</Text>
              <Text style={styles.profileClinic}>📍 {user?.clinic || 'Clínica'}</Text>
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditToggle}
            >
              <Ionicons 
                name={isEditing ? 'close' : 'create'} 
                size={20} 
                color={Colors.surface} 
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Estatísticas rápidas */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <StatCard
              title="Clientes"
              value="125"
              icon="people"
              color={Colors.primary}
            />
            <StatCard
              title="Pets"
              value="89"
              icon="paw"
              color={Colors.secondary}
            />
            <StatCard
              title="Consultas"
              value="456"
              icon="medical"
              color={Colors.info}
            />
          </View>
        </View>

        {/* Informações do perfil */}
        <Card style={styles.profileCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Informações Pessoais</Text>
          </View>

          {isEditing ? (
            <View style={styles.editForm}>
              <Input
                label="Nome Completo"
                value={formData.name}
                onChangeText={(value) => updateField('name', value)}
                placeholder="Seu nome completo"
                leftIcon="person"
              />

              <Input
                label="Email"
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                placeholder="seu@email.com"
                keyboardType="email-address"
                leftIcon="mail"
              />

              <Input
                label="Telefone"
                value={formData.phone}
                onChangeText={(value) => updateField('phone', value)}
                placeholder="(11) 99999-9999"
                keyboardType="phone-pad"
                leftIcon="call"
              />

              <Input
                label="Profissão"
                value={formData.profession}
                onChangeText={(value) => updateField('profession', value)}
                placeholder="Veterinário(a)"
                leftIcon="medical"
              />

              <Input
                label="Clínica/Hospital"
                value={formData.clinic}
                onChangeText={(value) => updateField('clinic', value)}
                placeholder="Nome da clínica"
                leftIcon="business"
              />

              <Input
                label="CRMV"
                value={formData.crmv}
                onChangeText={(value) => updateField('crmv', value)}
                placeholder="12345-UF"
                leftIcon="card"
              />

              <View style={styles.editButtons}>
                <Button
                  title="Cancelar"
                  variant="outline"
                  onPress={handleEditToggle}
                  style={styles.cancelButton}
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
  headerGradient: {
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 16,
  },
  photoContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.surface,
  },
  defaultPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.surface,
  },
  photoEditIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.surface,
  },
  profileProfession: {
    fontSize: 16,
    color: Colors.surface,
    opacity: 0.9,
    marginTop: 2,
  },
  profileClinic: {
    fontSize: 14,
    color: Colors.surface,
    opacity: 0.8,
    marginTop: 4,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statTitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
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
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
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