import React from 'react';
import { View, Text, Button, Linking } from 'react-native';
import { calculateDistance } from '../utils/distance';

export default function LocationDetailScreen({ route, navigation }) {
  const { item, currentPos } = route.params;
  const distance = currentPos
    ? calculateDistance(currentPos.latitude, currentPos.longitude, Number(item.latitude), Number(item.longitude))
    : null;

  return (
    <View style={{ padding: 16, gap: 8 }}>
      <Text>Name: {item.location_name}</Text>
      <Text>Latitude: {item.latitude}</Text>
      <Text>Longitude: {item.longitude}</Text>
      <Text>Remark: {item.remark || '-'}</Text>
      <Text>Distance: {distance ? `${distance.toFixed(2)} m` : 'Unknown'}</Text>
      <Button
        title="Navigate to location"
        onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`)}
      />
      <Button title="Submit Patrol Report" onPress={() => navigation.navigate('PatrolReport', { item })} />
    </View>
  );
}
