import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  Alert,
} from 'react-native';

type Role = 'Member' | 'Admin' | 'Committee';

interface User {
  id: string;
  name: string;
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
    building: ' B-300',
    flatNumber: '300',
    society: 'SevenGen society',
    profilePicture: 'https://via.placeholder.com/150',
    phoneNumber: '987-654-3210',
    roles: ['Member'],
  },
  {
    id: '3',
    name: 'Brooklyn Simmons',
    building: ' C-303',
    flatNumber: '303',
    society: 'SevenGen society',
    profilePicture: 'https://via.placeholder.com/150',
    phoneNumber: '555-123-4567',
    roles: ['Member', 'Committee'],
  },
];

const Members = () => {
  const [activeTab, setActiveTab] = useState<Role>('Member'); // Default active tab is 'Member'
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // State to store selected user data

  const renderContent = () => {
    const filteredData = userData.filter(user =>
      user.roles.includes(activeTab),
    );

    return (
      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => handleUserClick(item)}
            style={styles.card}>
            <Image
              source={{uri: item.profilePicture}}
              style={styles.profileImage}
            />
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.details}>
                {item.building} | {item.phoneNumber}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
    );
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user); // Set the selected user data
    setModalVisible(true); // Open the modal
  };

  const handleCloseModal = () => {
    setModalVisible(false); // Close the modal
    setSelectedUser(null); // Clear selected user data
  };

  const handleCall = () => {
    if (selectedUser) {
      Alert.alert(
        `Calling ${selectedUser.name}`,
        `Phone number: ${selectedUser.phoneNumber}`,
      );
    }
  };

  const handleChat = () => {
    if (selectedUser) {
      Alert.alert(
        `Chatting with ${selectedUser.name}`,
        `Chat feature for ${selectedUser.name}`,
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Tab Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Member' && styles.activeTab]}
          onPress={() => setActiveTab('Member')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'Member' && styles.activeTabText,
            ]}>
            Members
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Admin' && styles.activeTab]}
          onPress={() => setActiveTab('Admin')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'Admin' && styles.activeTabText,
            ]}>
            Admin
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'Committee' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('Committee')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'Committee' && styles.activeTabText,
            ]}>
            Committee
          </Text>
        </TouchableOpacity>
      </View>

      {/* Render Content Below */}
      <View style={styles.content}>{renderContent()}</View>

      {/* Modal for displaying user details */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Close button at the top left corner */}
            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            {selectedUser && (
              <>
                <Image
                  source={{uri: selectedUser.profilePicture}}
                  style={styles.modalImage}
                />
                <Text style={styles.modalName}>{selectedUser.name}</Text>
                <Text style={styles.modalDetails}>
                  Phone: {selectedUser.phoneNumber}
                </Text>
                <Text style={styles.modalDetails}>
                  Society: {selectedUser.society}
                </Text>
                <Text style={styles.modalDetails}>
                  Block: {selectedUser.building}
                </Text>
                <Text style={styles.modalDetails}>
                  Flat: {selectedUser.flatNumber}
                </Text>

                <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={handleCall} style={styles.button}>
                    <Text style={styles.buttonText}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleChat} style={styles.button}>
                    <Text style={styles.buttonText}>Chat</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 10,
  },
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
  activeTab: {
    backgroundColor: '#007aff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    height: 100,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  details: {
    fontSize: 14,
    color: '#666',
  },
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
    position: 'relative', // Added to position close button at the top left
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  modalName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDetails: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  button: {
    backgroundColor: '#007aff',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#ddd',
    borderRadius: 15,
    padding: 5,
    zIndex: 1, // Ensure the close button is on top
  },
  closeButtonText: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default Members;
