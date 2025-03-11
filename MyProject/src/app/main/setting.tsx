import React, {useState, useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../../../context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Setting = () => {
  const authContext = useContext(AuthContext); // Ensure it's not null
  const navigation = useNavigation<any>();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLogout = async () => {
    try {
      authContext?.setstate?.({token: '', user: null}); // Optional chaining
      await AsyncStorage.removeItem('@auth');
      navigation.reset({index: 0, routes: [{name: 'login'}]});
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.itemBox}
        onPress={() => navigation.navigate('Editprofile')}>
        <Ionicons
          name="person-outline"
          size={24}
          color="gray"
          style={styles.icon}
        />
        <Text style={styles.itemText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.itemBox}
        onPress={() => navigation.navigate('Language')}>
        <Ionicons
          name="language-outline"
          size={24}
          color="gray"
          style={styles.icon}
        />
        <Text style={styles.itemText}>Language</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.itemBox}
        onPress={() => navigation.navigate('Getsupport')}>
        <Ionicons
          name="help-circle-outline"
          size={24}
          color="gray"
          style={styles.icon}
        />
        <Text style={styles.itemText}>Get Support</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.itemBox}
        onPress={() => navigation.navigate('Terms')}>
        <Ionicons
          name="document-text-outline"
          size={24}
          color="gray"
          style={styles.icon}
        />
        <Text style={styles.itemText}>Terms & Condition</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.itemBox}
        onPress={() => navigation.navigate('Policy')}>
        <Ionicons
          name="shield-checkmark-outline"
          size={24}
          color="gray"
          style={styles.icon}
        />
        <Text style={styles.itemText}>Privacy Policy</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.itemBox, styles.logoutItem]}
        onPress={() => setIsModalVisible(true)}>
        <Ionicons
          name="log-out-outline"
          size={24}
          color="red"
          style={styles.icon}
        />
        <Text style={[styles.itemText, styles.logoutText]}>Logout</Text>
      </TouchableOpacity>

      {/* Modal for Logout Confirmation */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setIsModalVisible(false)}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonYes]}
                onPress={handleLogout}>
                <Text
                  style={[styles.modalButtonText, styles.modalButtonTextYes]}>
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9', // Background color for each item box
    borderRadius: 10, // Rounded corners
    marginBottom: 10, // Space between boxes
    elevation: 2, // Add a shadow effect for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.1, // Shadow opacity for iOS
    shadowRadius: 5, // Shadow blur for iOS
    shadowOffset: {width: 0, height: 2}, // Shadow direction for iOS
  },
  icon: {
    marginRight: 15, // Space between icon and text
  },
  itemText: {
    fontSize: 18,
    color: 'black',
    flex: 1,
  },
  logoutItem: {
    backgroundColor: '#fff5f5', // Lighter background for logout item
  },
  logoutText: {
    color: 'red', // Red color for the "Logout" text
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark background for modal
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#ddd',
  },
  modalButtonText: {
    fontSize: 16,
    color: 'black',
  },
  modalButtonYes: {
    backgroundColor: '#e74c3c', // Red color for "Yes"
  },
  modalButtonTextYes: {
    color: 'white', // White text for "Yes"
  },
});

export default Setting;
