import React from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ClientListScreen from '../screens/clients/ClientListScreen';
import NewClientScreen from '../screens/clients/NewClientScreen';
import PetListScreen from '../screens/pets/PetListScreen';
import NewPetScreen from '../screens/pets/NewPetScreen';
import NewConsultationScreen from '../screens/consultations/NewConsultationScreen';
import VetLibraryScreen from '../screens/library/VetLibraryScreen';
import AgendaScreen from '../screens/agenda/AgendaScreen';
import { useAuth } from '../contexts/AuthContext';
import { Colors } from '../constants/Colors';
import { globalStyles } from '../styles/globalStyles';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const PlaceholderScreen = ({ route, navigation }) => {
  return (
    <View style={[globalStyles.container, globalStyles.justifyCenter, globalStyles.alignCenter]}>
      <Ionicons 
        name="construct" 
        size={64} 
        color={Colors.textSecondary} 
        style={{ marginBottom: 16 }}
      />
      <Text style={[globalStyles.textLarge, globalStyles.textCenter]}>
        {route.name}
      </Text>
      <Text style={[globalStyles.textRegular, globalStyles.textCenter, { marginTop: 8 }]}>
        Em desenvolvimento
      </Text>
    </View>
  );
};

// Componente Profile temporário
const ProfileScreen = () => {
  const { user, logout } = useAuth();
  
  return (
    <View style={[globalStyles.container, globalStyles.justifyCenter, globalStyles.alignCenter]}>
      <Ionicons 
        name="person-circle" 
        size={100} 
        color={Colors.primary} 
        style={{ marginBottom: 20 }}
      />
      <Text style={[globalStyles.textLarge, { marginBottom: 10 }]}>
        {user?.name || 'Usuário'}
      </Text>
      <Text style={[globalStyles.textRegular, { marginBottom: 30 }]}>
        {user?.email}
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: Colors.error,
          paddingHorizontal: 30,
          paddingVertical: 15,
          borderRadius: 8
        }}
        onPress={() => {
          Alert.alert(
            'Sair',
            'Deseja realmente sair do aplicativo?',
            [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Sair', onPress: logout, style: 'destructive' }
            ]
          );
        }}
      >
        <Text style={{ color: Colors.surface, fontWeight: 'bold' }}>
          Sair
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Stack Navigator para Home com telas relacionadas
const HomeStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="HomeMain" 
      component={HomeScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{
        title: 'Perfil',
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.surface,
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    />
    <Stack.Screen 
      name="NewConsultation" 
      component={NewConsultationScreen}
      options={{
        title: 'Nova Consulta',
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.surface,
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    />
    <Stack.Screen 
      name="NewClient" 
      component={NewClientScreen}
      options={{
        title: 'Novo Cliente',
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.surface,
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    />
    <Stack.Screen 
      name="NewPet" 
      component={NewPetScreen}
      options={{
        title: 'Novo Pet',
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.surface,
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    />
    <Stack.Screen 
      name="ConsultationHistory" 
      component={PlaceholderScreen}
      options={{
        title: 'Histórico de Consultas',
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.surface,
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    />
    <Stack.Screen 
      name="ConsultationDetail" 
      component={PlaceholderScreen}
      options={{
        title: 'Detalhes da Consulta',
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.surface,
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    />
  </Stack.Navigator>
);

// Stack Navigator para Clientes
const ClientsStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="ClientListMain" 
      component={ClientListScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="NewClient" 
      component={NewClientScreen}
      options={{
        title: 'Novo Cliente',
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.surface,
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    />
    <Stack.Screen 
      name="ClientDetail" 
      component={PlaceholderScreen}
      options={{
        title: 'Detalhes do Cliente',
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
      name="PetListMain" 
      component={PetListScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="NewPet" 
      component={NewPetScreen}
      options={{
        title: 'Novo Pet',
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.surface,
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    />
    <Stack.Screen 
      name="NewConsultation" 
      component={NewConsultationScreen}
      options={{
        title: 'Nova Consulta',
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.surface,
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    />
    <Stack.Screen 
      name="PetDetail" 
      component={PlaceholderScreen}
      options={{
        title: 'Detalhes do Pet',
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
      name="AgendaMain" 
      component={AgendaScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="NewConsultation" 
      component={NewConsultationScreen}
      options={{
        title: 'Nova Consulta',
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.surface,
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    />
    <Stack.Screen 
      name="ConsultationHistory" 
      component={PlaceholderScreen}
      options={{
        title: 'Histórico de Consultas',
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.surface,
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    />
    <Stack.Screen 
      name="VetLibrary" 
      component={VetLibraryScreen}
      options={{
        title: 'Biblioteca Veterinária',
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
        title: 'Início',
        headerTitle: 'PetCare Pro'
      }} 
    />
    <Tab.Screen 
      name="Clients" 
      component={ClientsStackNavigator} 
      options={{ 
        title: 'Clientes',
        headerTitle: 'Clientes'
      }} 
    />
    <Tab.Screen 
      name="Pets" 
      component={PetsStackNavigator} 
      options={{ 
        title: 'Pets',
        headerTitle: 'Pets'
      }} 
    />
    <Tab.Screen 
      name="Agenda" 
      component={AgendaStackNavigator} 
      options={{ 
        title: 'Agenda',
        headerTitle: 'Agenda'
      }} 
    />
    <Tab.Screen 
      name="Library" 
      component={VetLibraryScreen} 
      options={{ 
        title: 'Biblioteca',
        headerTitle: 'Biblioteca Veterinária'
      }} 
    />
  </Tab.Navigator>
);

export default MainNavigator;