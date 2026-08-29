import React, { useState, useEffect } from 'react';
import {Text, StyleSheet, Alert,ScrollView,ActivityIndicator, Image} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../Firebase/firebase';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
export default function AddCarScreen({ navigation }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      base64: true, 
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };
  const uploadToCloudinary = async (img) => {
    let base64Img;
    if (img.base64) {
      base64Img = `data:image/jpeg;base64,${img.base64}`;
    } else if (img.uri && img.uri.startsWith('data:image')) {
      base64Img = img.uri;
    } else {
      const response = await fetch(img.uri);
      const blob = await response.blob();
      const reader = new FileReader();
      base64Img = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }
    const res = await fetch(
      'https://api.cloudinary.com/v1_1/dbwgytvpu/image/upload',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: base64Img,
          upload_preset: 'jpofwjih',
          public_id: 'car_' + Date.now(),
          filename_override: 'car_image',
          context: 'alt=car',
        }),
      }
    );
    const file = await res.json();
    console.log('Cloudinary response:', file);
    if (!file.secure_url) {
      throw new Error(file.error?.message || 'Image upload failed');
    }
    return file.secure_url;
  };
  const validate = () => {
    if (!name.trim()) return Alert.alert('Error', 'Enter name'), false;
    if (!price.trim() || isNaN(price)) return Alert.alert('Error', 'Valid price'), false;
    if (!description.trim()) return Alert.alert('Error', 'Enter description'), false;
    return true;
  };
  const handleAdd = async () => {
    if (!validate()) return;
    setUploading(true);

    try {
      if (!user) {
        Alert.alert('Error', 'Login required');
        return;
      }
      let imageUrl = '';
      if (image) {
        imageUrl = await uploadToCloudinary(image);
      }
      await addDoc(collection(db, 'products'), {
        name: name.trim(),
        price: parseFloat(price),
        description: description.trim(),
        image: imageUrl,
        userId: user.uid,
        createdAt: new Date(),
      });
      Alert.alert('Success', 'Car added!');
      navigation.goBack();
    } catch (error) {
      console.log('Full error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setUploading(false);
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Car</Text>
      <CustomInput placeholder="Car Name" value={name} setValue={setName} />
      <CustomInput placeholder="Price" value={price} setValue={setPrice} keyboardType="numeric" />
      <CustomInput placeholder="Description" value={description} setValue={setDescription} />
      <CustomButton title="Pick Image" onPress={pickImage} />
      {image && (
        <Image
          source={{ uri: image.uri }}
          style={{ width: 120, height: 120, alignSelf: 'center', margin: 10 }}
        />
      )}
      {uploading ? (
        <ActivityIndicator size="large" color="#3B71F3" />
      ) : (
        <CustomButton title="Add Car" onPress={handleAdd} />
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F9FBFC',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});