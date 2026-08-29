import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Modal, ScrollView, Image, ActivityIndicator, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { collection, getDocs, deleteDoc, updateDoc, doc, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../Firebase/firebase';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
export default function CarsScreen({ navigation }) {
  const [cars, setCars] = useState([]);
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    if (auth.currentUser) {
      setUser(auth.currentUser);
      fetchCars(auth.currentUser.uid);
    }
  }, []);
  const fetchCars = async (uid) => {
    try {
      const q = query(collection(db, 'products'), where('userId', '==', uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCars(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  const deleteCar = async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setCars((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  const handleDelete = (id) => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to delete this Car?')) {
        deleteCar(id);
      }
    } else {
      Alert.alert('Delete', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteCar(id),
        },
      ]);
    }
  };
  const openEdit = (car) => {
    setSelectedCar(car);
    setName(car.name);
    setPrice(String(car.price));
    setDescription(car.description);
    setImage(car.image ? { uri: car.image } : null);
    setModalVisible(true);
  };
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
    if (!file.secure_url) {
      throw new Error(file.error?.message || 'Image upload failed');
    }
    return file.secure_url;
  };

  const handleUpdate = async () => {
    if (!name.trim() || !price.trim() || isNaN(price) || !description.trim()) {
      Alert.alert('Error', 'Please fill all fields correctly');
      return;
    }
    setUploading(true);
    try {
      let imageUrl = selectedCar.image || '';
      if (image && image.uri && image.uri !== selectedCar.image) {
        imageUrl = await uploadToCloudinary(image);
      }
      const ref = doc(db, 'products', selectedCar.id);
      await updateDoc(ref, {
        name: name.trim(),
        price: parseFloat(price),
        description: description.trim(),
        image: imageUrl,
      });
      setCars((prev) =>
        prev.map((p) =>
          p.id === selectedCar.id
            ? { ...p, name: name.trim(), price: parseFloat(price), description: description.trim(), image: imageUrl }
            : p
        )
      );
      setModalVisible(false);
      Alert.alert('Success', 'Car updated!');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setUploading(false);
    }
  };
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="contain" />
      ) : null}
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardPrice}>${item.price}</Text>
        <Text style={styles.cardDesc}>{item.description}</Text>
      </View>
      <View style={styles.cardButtons}>
        <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(item)}>
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Cars</Text>

      <FlatList
        data={cars}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No Cars found</Text>}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Car</Text>
            <CustomInput placeholder="Car Name" value={name} setValue={setName} />
            <CustomInput placeholder="Price" value={price} setValue={setPrice} keyboardType="numeric" />
            <CustomInput placeholder="Description" value={description} setValue={setDescription} />
            <CustomButton title="Pick New Image" onPress={pickImage} />
            {image && (
              <Image
                source={{ uri: image.uri }}
                style={{ width: 100, height: 100, alignSelf: 'center', margin: 10, borderRadius: 8 }}
                resizeMode="contain"
              />
            )}
            {uploading ? (
              <ActivityIndicator size="large" color="#3B71F3" />
            ) : (
              <CustomButton title="Update" onPress={handleUpdate} />
            )}
            <CustomButton
              title="Cancel"
              onPress={() => setModalVisible(false)}
              style={styles.cancelBtn}
            />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FBFC',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  cardImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginRight: 15,
    alignSelf: 'center',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  cardPrice: {
    fontSize: 18,
    color: '#3B71F3',
    marginVertical: 6,
  },
  cardDesc: {
    fontSize: 16,
    color: '#666',
  },
  cardButtons: {
    justifyContent: 'space-between',
    marginLeft: 12,
  },
  editBtn: {
    backgroundColor: '#3B71F3',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  empty: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 50,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  cancelBtn: {
    backgroundColor: '#aaa',
  },
});