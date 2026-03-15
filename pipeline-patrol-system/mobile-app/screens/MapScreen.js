import React from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapScreen({ route }) {
  const { assignments = [], currentPos } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: currentPos?.latitude || 0,
          longitude: currentPos?.longitude || 0,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {currentPos && <Marker coordinate={{ latitude: currentPos.latitude, longitude: currentPos.longitude }} title="You" />}
        {assignments.map((a) => (
          <Marker
            key={a.id}
            coordinate={{ latitude: Number(a.latitude), longitude: Number(a.longitude) }}
            title={a.location_name}
          />
        ))}
      </MapView>
    </View>
  );
}
