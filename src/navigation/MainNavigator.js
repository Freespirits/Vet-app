import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import { Colors } from '../constants/Colors';
import { globalStyles } from '../styles/globalStyles';

const Tab = createBottomTabNavigator();

const PlaceholderScreen = ({ route }) => {
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
      component={HomeScreen} 
      options={{ 
        title: 'Início',
        headerTitle: 'PetCare Pro'
      }} 
    />
    <Tab.Screen 
      name="Clients" 
      component={PlaceholderScreen} 
      options={{ 
        title: 'Clientes',
        headerTitle: 'Clientes'
      }} 
    />
    <Tab.Screen 
      name="Pets" 
      component={PlaceholderScreen} 
      options={{ 
        title: 'Pets',
        headerTitle: 'Pets'
      }} 
    />
    <Tab.Screen 
      name="Agenda" 
      component={PlaceholderScreen} 
      options={{ 
        title: 'Agenda',
        headerTitle: 'Agenda'
      }} 
    />
    <Tab.Screen 
      name="Library" 
      component={PlaceholderScreen} 
      options={{ 
        title: 'Biblioteca',
        headerTitle: 'Biblioteca Veterinária'
      }} 
    />
  </Tab.Navigator>
);

export default MainNavigator;