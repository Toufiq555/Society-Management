import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Language = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages = ['English', 'हिंदी', 'मराठी'];

  const handleUpdate = () => {
    Alert.alert('Language Updated', `Selected language: ${selectedLanguage}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Language</Text>
      </View>

      {/* Language List */}
      <FlatList
        data={languages}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.languageItem}
            onPress={() => setSelectedLanguage(item)}>
            <Text style={styles.languageText}>{item}</Text>
            {selectedLanguage === item && (
              <Ionicons name="checkmark-circle" size={20} color="#007BFF" />
            )}
          </TouchableOpacity>
        )}
      />

      {/* Update Button */}
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  languageText: {
    fontSize: 16,
    color: '#333',
  },
  updateButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  updateButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Language;
