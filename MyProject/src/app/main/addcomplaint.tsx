import React, {useState} from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

interface ComplaintRouteParams {
  setPersonalComplaints: (complaints: any) => void;
  setCommunityComplaints: (complaints: any) => void;
}

const AddComplaint = ({navigation}: any) => {
  const route = useRoute<RouteProp<{params: ComplaintRouteParams}, 'params'>>();
  const {setPersonalComplaints, setCommunityComplaints} = route.params || {};
  const [activeTab, setActiveTab] = useState<'personal' | 'community'>(
    'personal',
  );
  const [complaintType, setComplaintType] = useState('');
  const [complaintDescription, setComplaintDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Function to handle image selection
  const handleImagePick = async () => {
    const options = {
      mediaType: 'photo' as const,
      quality: 1 as const,
    };

    Alert.alert('Select Image', 'Choose an option', [
      {
        text: 'Camera',
        onPress: async () => {
          const result = await launchCamera(options);
          if (result.assets && result.assets.length > 0) {
            setImageUri(result.assets[0].uri || null);
          }
        },
      },
      {
        text: 'Gallery',
        onPress: async () => {
          const result = await launchImageLibrary(options);
          if (result.assets && result.assets.length > 0) {
            setImageUri(result.assets[0].uri || null);
          }
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const handleSubmit = () => {
    if (!complaintType || !complaintDescription) {
      Alert.alert('Error', 'Please fill in all the fields.');
      return;
    }

    const newComplaint = {
      id: Math.random().toString(),
      title: `${complaintType}: ${complaintDescription}`,
      image: imageUri,
    };

    if (activeTab === 'personal') {
      setPersonalComplaints((prev: any) => [...prev, newComplaint]);
    } else {
      setCommunityComplaints((prev: any) => [...prev, newComplaint]);
    }

    Alert.alert('Success', 'Complaint added successfully.');
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'personal' && styles.activeTab]}
          onPress={() => setActiveTab('personal')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'personal' && styles.activeTabText,
            ]}>
            Personal
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'community' && styles.activeTab]}
          onPress={() => setActiveTab('community')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'community' && styles.activeTabText,
            ]}>
            Community
          </Text>
        </TouchableOpacity>
      </View>

      {/* Image Picker */}
      <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
        {imageUri ? (
          <Image source={{uri: imageUri}} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imagePickerText}>Attach a photo (optional)</Text>
        )}
      </TouchableOpacity>

      {/* Form */}
      <Text style={styles.label}>Complaint Type</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter complaint type"
        value={complaintType}
        onChangeText={setComplaintType}
      />

      <Text style={styles.label}>Brief Your Complaint</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Brief your complaint"
        value={complaintDescription}
        onChangeText={setComplaintDescription}
        multiline
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Complaint</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTab: {
    borderColor: '#007BFF',
  },
  tabText: {
    fontSize: 16,
    color: '#555',
  },
  activeTabText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  imagePicker: {
    backgroundColor: '#f0f0f0',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imagePickerText: {
    color: '#888',
    fontSize: 16,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddComplaint;
