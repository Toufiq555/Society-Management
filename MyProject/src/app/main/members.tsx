import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
} from 'react-native';

// TypeScript types
type Role = 'Member' | 'Admin' | 'Committee';

interface User {
  name: string;
  roles: Role[];
  email: string;
  phoneNumber: string;
  building: string;
  flatNumber: string;
  society: string;
  profilePicture: string;
  phoneNumber: string; // Added phoneNumber
  roles: Role[];
}

const userData: User[] = [
  {
    id: '1',
    name: 'Savannah Nguyen',
    building: 'Block A-422',
    flatNumber: '422',
    society: 'SevenGen society',
    profilePicture: 'https://via.placeholder.com/150',
    phoneNumber: '123-456-7890', // Added phone number
    roles: ['Member', 'Admin', 'Committee'],
  },
  {
    id: '2',
    name: 'Cameron Williamson',
    building: 'Block B-300',
    flatNumber: '300',
    society: 'SevenGen society',
    profilePicture: 'https://via.placeholder.com/150',
    phoneNumber: '987-654-3210',
    roles: ['Member'],
  },
  {
    id: '3',
    name: 'Brooklyn Simmons',
    building: 'Block C-303',
    flatNumber: '303',
    society: 'SevenGen society',
    profilePicture: 'https://via.placeholder.com/150',
    phoneNumber: '555-123-4567',
    roles: ['Member', 'Committee'],
  },
];

const Members = () => {
  const [activeTab, setActiveTab] = useState<Role>('Member');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<User[]>([]);

  // ✅ Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://your-api-url/api/v1/members'); // Change to actual API URL
        const data = await response.json();
        if (data.success) {
          setUserData(data.members);
        } else {
          Alert.alert('Error', 'Failed to fetch members');
        }
      } catch (error) {
        console.error('Fetch Error:', error);
        Alert.alert('Error', 'Could not fetch members');
      }
    };
    fetchData();
  }, []);

  const renderContent = () => {
    const filteredData = userData.filter(user =>
      user.roles.includes(activeTab),
    );

    return (
      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => handleUserClick(item)}
            style={styles.card}>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.details}>
                {item.building} | {item.society}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
    );
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  const handleCall = () => {
    if (selectedUser) {
      Alert.alert(
        `Calling ${selectedUser.name}`,
        `Phone: ${selectedUser.phoneNumber}`,
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Tab Buttons */}
      <View style={styles.buttonContainer}>
        {['Member', 'Admin', 'Committee'].map(role => (
          <TouchableOpacity
            key={role}
            style={[styles.tabButton, activeTab === role && styles.activeTab]}
            onPress={() => setActiveTab(role as Role)}>
            <Text
              style={[
                styles.tabText,
                activeTab === role && styles.activeTabText,
              ]}>
              {role}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Render Content */}
      <View style={styles.content}>{renderContent()}</View>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            {selectedUser && (
              <>
                <Text style={styles.modalName}>{selectedUser.name}</Text>
                <Text style={styles.modalDetails}>
                  Role: {selectedUser.roles.join(', ')}
                </Text>
                <Text style={styles.modalDetails}>
                  Email: {selectedUser.email}
                </Text>
                <Text style={styles.modalDetails}>
                  Phone: {selectedUser.phoneNumber}
                </Text>
                <Text style={styles.modalDetails}>
                  Building: {selectedUser.building}
                </Text>
                <Text style={styles.modalDetails}>
                  Flat No: {selectedUser.flatNumber}
                </Text>

                <TouchableOpacity onPress={handleCall} style={styles.button}>
                  <Text style={styles.buttonText}>Call</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {flex: 1},
  listContainer: {padding: 10},
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#e0e0e0',
    padding: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  activeTab: {backgroundColor: '#007aff'},
  tabText: {fontSize: 14, fontWeight: '600', color: '#333'},
  activeTabText: {color: '#fff'},
  content: {flex: 1, padding: 10},
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    height: 80,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    padding: 15,
    elevation: 3,
  },
  name: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  details: {fontSize: 14, color: '#666'},
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
  },
  modalName: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
  modalDetails: {fontSize: 14, color: '#333', marginBottom: 5},
  button: {
    backgroundColor: '#007aff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {color: 'white', fontWeight: '600'},
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ddd',
    borderRadius: 15,
    padding: 5,
  },
  closeButtonText: {fontSize: 20, color: '#333', fontWeight: 'bold'},
});

export default Members;
