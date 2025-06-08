import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Switch,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import { AuthService } from '../../services/AuthService';
import { NotificationService } from '../../services/NotificationService';
import { BackupService } from '../../services/BackupService';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
    loadNotificationSettings();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AuthService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNotificationSettings = async () => {
    try {
      const enabled = await NotificationService.isEnabled();
      setNotificationsEnabled(enabled);
    } catch (error) {
      console.error('Erro ao carregar configurações de notificação:', error);
    }
  };

  const handleNotificationToggle = async (value) => {
    try {
      if (value) {
        const permission = await NotificationService.requestPermission();
        if (permission) {
          await NotificationService.enable();
          setNotificationsEnabled(true);
        } else {
          Alert.alert(
            'Permissão Negada',
            'Para receber notificações, ative-as nas configurações do seu dispositivo.',
            [
              { text: 'OK' },
              { text: 'Configurações', onPress: () => Linking.openSettings() }
            ]
          );
        }
      } else {
        await NotificationService.disable();
        setNotificationsEnabled(false);
      }
    } catch (error) {
      console.error('Erro ao alterar configurações de notificação:', error);
      Alert.alert('Erro', 'Não foi possível alterar as configurações de notificação');
    }
  };

  const handleBackup = async () => {
    Alert.alert(
      'Backup dos Dados',
      'Deseja fazer backup de todos os seus dados? Isso incluirá consultas, pacientes e configurações.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Fazer Backup',
          onPress: async () => {
            try {
              const result = await BackupService.createBackup();
              if (result.success) {
                Alert.alert(
                  'Backup Concluído',
                  `Backup criado com sucesso!\nArquivo: ${result.filename}\nTamanho: ${result.size}`
                );
              } else {
                Alert.alert('Erro', result.error || 'Erro ao criar backup');
              }
            } catch (error) {
              console.error('Erro ao fazer backup:', error);
              Alert.alert('Erro', 'Erro interno ao criar backup');
            }
          }
        }
      ]
    );
  };

  const handleRestore = async () => {
    Alert.alert(
      'Restaurar Backup',
      'Deseja restaurar dados de um backup? Isso substituirá todos os dados atuais.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restaurar',
          style: 'destructive',
          onPress: () => navigation.navigate('RestoreBackup')
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await AuthService.logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
              Alert.alert('Erro', 'Erro ao sair da conta');
            }
          }
        }
      ]
    );
  };

  const profileSections = [
    {
      title: 'Conta',
      items: [
        {
          id: 'edit-profile',
          title: 'Editar Perfil',
          subtitle: 'Nome, email e informações pessoais',
          icon: 'person-outline',
          onPress: () => navigation.navigate('EditProfile'),
        },
        {
          id: 'change-password',
          title: 'Alterar Senha',
          subtitle: 'Atualizar senha de acesso',
          icon: 'lock-closed-outline',
          onPress: () => navigation.navigate('ChangePassword'),
        },
      ],
    },
    {
      title: 'Configurações',
      items: [
        {
          id: 'notifications',
          title: 'Notificações',
          subtitle: 'Lembretes e alertas',
          icon: 'notifications-outline',
          showSwitch: true,
          switchValue: notificationsEnabled,
          onSwitchChange: handleNotificationToggle,
          onPress: () => navigation.navigate('NotificationSettings'),
        },
        {
          id: 'backup',
          title: 'Backup e Restauração',
          subtitle: 'Proteger seus dados',
          icon: 'cloud-outline',
          onPress: () => navigation.navigate('BackupSettings'),
        },
      ],
    },
    {
      title: 'Suporte',
      items: [
        {
          id: 'help',
          title: 'Ajuda e Suporte',
          subtitle: 'Central de ajuda e contato',
          icon: 'help-circle-outline',
          onPress: () => navigation.navigate('HelpSupport'),
        },
        {
          id: 'about',
          title: 'Sobre',
          subtitle: 'FAQ e informações',
          icon: 'information-circle-outline',
          onPress: () => navigation.navigate('About'),
        },
        {
          id: 'privacy',
          title: 'Privacidade',
          subtitle: 'Política de privacidade',
          icon: 'shield-outline',
          onPress: () => navigation.navigate('Privacy'),
        },
        {
          id: 'version',
          title: 'Versão',
          subtitle: 'Changelog e atualizações',
          icon: 'code-outline',
          onPress: () => navigation.navigate('VersionInfo'),
        },
      ],
    },
    {
      title: 'Conta',
      items: [
        {
          id: 'logout',
          title: 'Sair',
          subtitle: 'Desconectar da conta',
          icon: 'log-out-outline',
          onPress: handleLogout,
          danger: true,
        },
      ],
    },
  ];

  const renderProfileItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.profileItem, item.danger && styles.profileItemDanger]}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.profileItemContent}>
        <View style={[
          styles.profileItemIcon,
          { backgroundColor: item.danger ? `${Colors.error}15` : `${Colors.primary}15` }
        ]}>
          <Ionicons
            name={item.icon}
            size={20}
            color={item.danger ? Colors.error : Colors.primary}
          />
        </View>
        <View style={styles.profileItemInfo}>
          <Text style={[
            styles.profileItemTitle,
            item.danger && { color: Colors.error }
          ]}>
            {item.title}
          </Text>
          <Text style={styles.profileItemSubtitle}>{item.subtitle}</Text>
        </View>
        {item.showSwitch ? (
          <Switch
            value={item.switchValue}
            onValueChange={item.onSwitchChange}
            trackColor={{ false: Colors.border, true: `${Colors.primary}40` }}
            thumbColor={item.switchValue ? Colors.primary : Colors.textSecondary}
          />
        ) : (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.textSecondary}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSection = (section) => (
    <View key={section.title} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionItems}>
        {section.items.map(renderProfileItem)}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Perfil</Text>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.userSection}>
          <LinearGradient
            colors={[Colors.surface, '#FAFAFA']}
            style={styles.userCard}
          >
            <View style={styles.userAvatar}>
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={styles.avatarGradient}
              >
                <Ionicons name="person" size={32} color={Colors.surface} />
              </LinearGradient>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {user?.name || 'Dr. Veterinário'}
              </Text>
              <Text style={styles.userEmail}>
                {user?.email || 'veterinario@email.com'}
              </Text>
              <Text style={styles.userRole}>
                Médico Veterinário
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Ionicons name="create-outline" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Profile Sections */}
        <View style={styles.sectionsContainer}>
          {profileSections.map(renderSection)}
        </View>

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
  backButton: {
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
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  // User Section
  userSection: {
    padding: 20,
    paddingBottom: 10,
  },
  userCard: {
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  userAvatar: {
    marginRight: 16,
  },
  avatarGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  userRole: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
    marginTop: 4,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Sections
  sectionsContainer: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionItems: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileItem: {
    borderBottomWidth: 1,
    borderBottomColor: `${Colors.border}30`,
  },
  profileItemDanger: {
    backgroundColor: `${Colors.error}05`,
  },
  profileItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  profileItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileItemInfo: {
    flex: 1,
  },
  profileItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  profileItemSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  bottomPadding: {
    height: 40,
  },
});

export default ProfileScreen;