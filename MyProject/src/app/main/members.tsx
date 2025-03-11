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

  email: string;

  building: string;
  flatNumber: string;
  society: string;
  profilePicture: string;
  phone: string; // Added phoneNumber
  roles: Role[];
}

const Members = () => {
  const [activeTab, setActiveTab] = useState<Role>('Member');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<User[]>([]);

  // ✅ Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.1.10:8080/api/v1/members'); // Change to actual API URL
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
    console.log('Rendering Data:', userData);
    // const filteredData = userData.filter(user =>
    //   user.roles.includes(activeTab),
    // );

    return (
      <FlatList
        data={userData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => handleUserClick(item)}
            style={styles.card}>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.details}>
                {item.building} | {item.phone}
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
        `Phone: ${selectedUser.phone}`,
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
                  Phone: {selectedUser.phone}
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
