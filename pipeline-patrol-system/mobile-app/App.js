import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import MapScreen from './screens/MapScreen';
import LocationDetailScreen from './screens/LocationDetailScreen';
import PatrolReportScreen from './screens/PatrolReportScreen';
import { initDb } from './database/sqlite';
import { startSyncEngine } from './sync/syncEngine';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    initDb();
    const timer = startSyncEngine();
    return () => clearInterval(timer);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="LocationDetail" component={LocationDetailScreen} />
        <Stack.Screen name="PatrolReport" component={PatrolReportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
