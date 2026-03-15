import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import * as Location from 'expo-location';
import api from '../services/api';
import { calculateDistance } from '../utils/distance';

export default function DashboardScreen({ navigation }) {
  const [assignments, setAssignments] = useState([]);
  const [currentPos, setCurrentPos] = useState(null);

  useEffect(() => {
    (async () => {
      await Location.requestForegroundPermissionsAsync();
      const loc = await Location.getCurrentPositionAsync({});
      setCurrentPos(loc.coords);
      const response = await api.get('/guard/assignments');
      setAssignments(response.data);
    })();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button title="Open Patrol Map" onPress={() => navigation.navigate('Map', { assignments, currentPos })} />
      <FlatList
        data={assignments}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const distance =
            currentPos &&
            calculateDistance(currentPos.latitude, currentPos.longitude, Number(item.latitude), Number(item.longitude));
          return (
            <View style={{ marginTop: 12, borderWidth: 1, padding: 12, borderRadius: 8 }}>
              <Text>{item.location_name}</Text>
              <Text>Status: {item.status}</Text>
              <Text>Distance: {distance ? `${distance.toFixed(2)} m` : 'Calculating...'}</Text>
              <Button title="Open" onPress={() => navigation.navigate('LocationDetail', { item, currentPos })} />
            </View>
          );
        }}
      />
    </View>
  );
}
