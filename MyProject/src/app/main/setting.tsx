import React, {useState, useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../../../context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Setting = () => {
  const authContext = useContext(AuthContext);
  const navigation = useNavigation<any>();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      await AsyncStorage.removeItem('@auth');
      authContext?.setstate?.({token: '', user: null});
      // No need to navigate manually, AppNavigator will handle redirection
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

      {/* Logout Confirmation Modal */}
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
  itemBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
  },
  icon: {
    marginRight: 15,
  },
  itemText: {
    fontSize: 18,
    color: 'black',
    flex: 1,
  },
  logoutItem: {
    backgroundColor: '#fff5f5',
  },
  logoutText: {
    color: 'red',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    backgroundColor: '#e74c3c',
  },
  modalButtonTextYes: {
    color: 'white',
  },
});

export default Setting;
