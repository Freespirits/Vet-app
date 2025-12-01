import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Main Screens
import HomeScreen from '../screens/HomeScreen';
import ClientListScreen from '../screens/clients/ClientListScreen';
import NewClientScreen from '../screens/clients/NewClientScreen';
import PetListScreen from '../screens/pets/PetListScreen';
import NewPetScreen from '../screens/pets/NewPetScreen';
import NewConsultationScreen from '../screens/consultations/NewConsultationScreen';
import VetLibraryScreen from '../screens/library/VetLibraryScreen';
import AgendaScreen from '../screens/agenda/AgendaScreen';
import NewAppointmentScreen from '../screens/agenda/NewAppointmentScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

// Detail Screens
import AppointmentDetailsScreen from '../screens/AppointmentDetailsScreen';
import PatientDetailsScreen from '../screens/PatientDetailsScreen';

// Profile Screens
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';
import NotificationSettingsScreen from '../screens/profile/NotificationSettingsScreen';
import BackupSettingsScreen from '../screens/profile/BackupSettingsScreen';
import HelpSupportScreen from '../screens/profile/HelpSupportScreen';
import AboutScreen from '../screens/profile/AboutScreen';
import PrivacyScreen from '../screens/profile/PrivacyScreen';
import VersionInfoScreen from '../screens/profile/VersionInfoScreen';

import { useAuth } from '../contexts/AuthContext';
import { Colors } from '../constants/Colors';
import { globalStyles } from '../styles/globalStyles';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Componente de header personalizado para o Profile
const ProfileHeader = ({ navigation, user }) => (
  <LinearGradient
    colors={Colors.primaryGradient}
    style={styles.profileHeaderGradient}
  >
    <View style={styles.profileHeaderContent}>
      <TouchableOpacity 
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.surface} />
      </TouchableOpacity>
      
      <View style={styles.profileHeaderInfo}>
        <View style={styles.profilePhotoContainer}>
          {user?.photo_url ? (
            <Image source={{ uri: user.photo_url }} style={styles.profileHeaderPhoto} />
          ) : (
            <View style={styles.defaultProfilePhoto}>
              <Ionicons name="person" size={32} color={Colors.primary} />
            </View>
          )}
        </View>
        
        <View style={styles.profileHeaderText}>
          <Text style={styles.profileHeaderName}>
            {user?.name || 'משתמש'}
          </Text>
          <Text style={styles.profileHeaderProfession}>
            {user?.profession || 'וטרינר/ית'}
          </Text>
          <Text style={styles.profileHeaderClinic}>
            📍 {user?.clinic || 'מרפאה וטרינרית'}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.headerActionButton}>
        <Ionicons name="settings" size={24} color={Colors.surface} />
      </TouchableOpacity>
    </View>
  </LinearGradient>
);

// Stack Navigator para Home com telas relacionadas
const HomeStackNavigator = () => {
  const { user } = useAuth();
  
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Inicio" 
        component={HomeScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={({ navigation }) => ({
          headerShown: true,
          header: () => <ProfileHeader navigation={navigation} user={user} />
        })}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ChangePassword" 
        component={ChangePasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="NewConsultation" 
        component={NewConsultationScreen}
        options={{
          title: 'ייעוץ חדש',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.surface,
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
      <Stack.Screen 
        name="NewClient" 
        component={NewClientScreen}
        options={{
          title: 'לקוח חדש',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.surface,
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
      <Stack.Screen 
        name="NewPet" 
        component={NewPetScreen}
        options={{
          title: 'חיית מחמד חדשה',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.surface,
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
      <Stack.Screen 
        name="NewAppointment" 
        component={NewAppointmentScreen}
        options={{
          title: 'תור חדש',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.surface,
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
      <Stack.Screen 
        name="VetLibrary" 
        component={VetLibraryScreen}
        options={{
          title: 'הספרייה הווטרינרית',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.surface,
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
      <Stack.Screen 
        name="AppointmentDetails" 
        component={AppointmentDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="PatientDetails" 
        component={PatientDetailsScreen}
        options={{ headerShown: false }}
      />
      {/* Profile Screens */}
      <Stack.Screen 
        name="NotificationSettings" 
        component={NotificationSettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="BackupSettings" 
        component={BackupSettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="HelpSupport" 
        component={HelpSupportScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="About" 
        component={AboutScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Privacy" 
        component={PrivacyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="VersionInfo" 
        component={VersionInfoScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Stack Navigator para Clientes
const ClientsStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Voltar" 
      component={ClientListScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="NewClient" 
      component={NewClientScreen}
      options={{
        title: 'לקוח חדש',
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.surface,
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    />
  </Stack.Navigator>
);

// Stack Navigator para Pets
const PetsStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Voltar"
      component={PetListScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="NewPet"
      component={NewPetScreen}
      options={{
        title: 'חיית מחמד חדשה',
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.surface,
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    />
    <Stack.Screen
      name="NewConsultation"
      component={NewConsultationScreen}
      options={{
        title: 'ייעוץ חדש',
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.surface,
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    />
  </Stack.Navigator>
);

// Stack Navigator para Agenda
const AgendaStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Voltar" 
      component={AgendaScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="NewConsultation"
      component={NewConsultationScreen}
      options={{
        title: 'ייעוץ חדש',
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.surface,
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    />
    <Stack.Screen
      name="NewAppointment"
      component={NewAppointmentScreen}
      options={{
        title: 'תור חדש',
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.surface,
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    />
    <Stack.Screen
      name="VetLibrary"
      component={VetLibraryScreen}
      options={{
        title: 'הספרייה הווטרינרית',
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.surface,
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    />
  </Stack.Navigator>
);

const MainNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Home':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Clients':
            iconName = focused ? 'people' : 'people-outline';
            break;
          case 'Pets':
            iconName = focused ? 'paw' : 'paw-outline';
            break;
          case 'Agenda':
            iconName = focused ? 'calendar' : 'calendar-outline';
            break;
          case 'Library':
            iconName = focused ? 'library' : 'library-outline';
            break;
          default:
            iconName = 'help-circle-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.textSecondary,
      tabBarStyle: {
        backgroundColor: Colors.surface,
        borderTopColor: Colors.border,
        paddingTop: 8,
        paddingBottom: 8,
        height: 60,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
      },
      headerStyle: {
        backgroundColor: Colors.primary,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: Colors.surface,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
    })}
  >
    <Tab.Screen 
      name="Home" 
      component={HomeStackNavigator} 
      options={{ 
        title: 'בית',
        headerTitle: 'PetCare Pro'
      }}
    />
    <Tab.Screen
      name="Clients"
      component={ClientsStackNavigator}
      options={{
        title: 'לקוחות',
        headerTitle: 'לקוחות'
      }}
    />
    <Tab.Screen
      name="Pets"
      component={PetsStackNavigator}
      options={{
        title: 'חיות מחמד',
        headerTitle: 'חיות מחמד'
      }}
    />
    <Tab.Screen
      name="Agenda"
      component={AgendaStackNavigator}
      options={{
        title: 'יומן',
        headerTitle: 'יומן'
      }}
    />
    <Tab.Screen
      name="Library"
      component={VetLibraryScreen}
      options={{
        title: 'ספרייה',
        headerTitle: 'הספרייה הווטרינרית'
      }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  profileHeaderGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileHeaderInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePhotoContainer: {
    marginRight: 16,
  },
  profileHeaderPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: Colors.surface,
  },
  defaultProfilePhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.surface,
  },
  profileHeaderText: {
    flex: 1,
  },
  profileHeaderName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.surface,
  },
  profileHeaderProfession: {
    fontSize: 14,
    color: Colors.surface,
    opacity: 0.9,
    marginTop: 2,
  },
  profileHeaderClinic: {
    fontSize: 12,
    color: Colors.surface,
    opacity: 0.8,
    marginTop: 4,
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainNavigator;