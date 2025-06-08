import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import Loading from '../components/common/Loading';
import VetLibraryScreen from '../screens/library/VetLibraryScreen';
import MedicationDetailScreen from '../screens/library/MedicationDetailScreen';
import NewMedicationScreen from '../screens/library/NewMedicationScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading message="Inicializando aplicação..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen 
  name="VetLibrary" 
  component={VetLibraryScreen}
  options={{ headerShown: false }}
/>
<Stack.Screen 
  name="MedicationDetail" 
  component={MedicationDetailScreen}
  options={{ headerShown: false }}
/>
<Stack.Screen 
  name="NewMedication" 
  component={NewMedicationScreen}
  options={{ headerShown: false }}
/>
        {user ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;