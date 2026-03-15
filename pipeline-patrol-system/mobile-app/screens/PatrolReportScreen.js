import React, { useState } from 'react';
import { View, TextInput, Button, Image, Text } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import * as Network from 'expo-network';
import api from '../services/api';
import db from '../database/sqlite';

export default function PatrolReportScreen({ route, navigation }) {
  const { item } = route.params;
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState([]);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);

  if (!permission?.granted) {
    return <Button title="Allow Camera" onPress={requestPermission} />;
  }

  const capture = async () => {
    if (!cameraRef) return;
    const result = await cameraRef.takePictureAsync({ quality: 0.7 });
    setPhotos((prev) => [...prev, result.uri]);
  };

  const submit = async () => {
    const loc = await Location.getCurrentPositionAsync({});
    const payload = {
      location_id: item.location_id,
      comment,
      actual_latitude: loc.coords.latitude,
      actual_longitude: loc.coords.longitude,
      submitted_at: new Date().toISOString(),
    };

    const net = await Network.getNetworkStateAsync();
    if (!net.isConnected) {
      db.runSync(
        'INSERT INTO offline_reports(location_id, comment, actual_latitude, actual_longitude, submitted_at, sync_status) VALUES(?,?,?,?,?,?)',
        [payload.location_id, payload.comment, payload.actual_latitude, payload.actual_longitude, payload.submitted_at, 'pending'],
      );
      const reportId = db.getFirstSync('SELECT last_insert_rowid() as id').id;
      photos.forEach((uri) => {
        db.runSync('INSERT INTO offline_images(offline_report_id, image_uri, location_id, sync_status) VALUES(?,?,?,?)', [
          reportId,
          uri,
          item.location_id,
          'pending',
        ]);
      });
      navigation.goBack();
      return;
    }

    const report = await api.post('/patrol-report', payload);

    for (const uri of photos) {
      const formData = new FormData();
      formData.append('report_id', String(report.data.id));
      formData.append('location_id', String(item.location_id));
      formData.append('image', { uri, name: `${Date.now()}.jpg`, type: 'image/jpeg' });
      await api.post('/upload-image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    }

    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraView style={{ flex: 1 }} facing="back" ref={(ref) => setCameraRef(ref)} />
      <View style={{ padding: 12, gap: 8 }}>
        <TextInput placeholder="Comment" value={comment} onChangeText={setComment} style={{ borderWidth: 1, padding: 8 }} />
        <Button title="Capture Photo" onPress={capture} />
        <Text>Captured: {photos.length}</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>{photos.map((p) => <Image source={{ uri: p }} key={p} style={{ width: 48, height: 48 }} />)}</View>
        <Button title="Submit Report" onPress={submit} />
      </View>
    </View>
  );
}
