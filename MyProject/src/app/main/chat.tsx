import MessageCard from '../../components/messagecard';
import imagePaths from '../../constant/imagePaths';
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  SectionList,
} from 'react-native';

// Dummy data for members
const userData = [
  {
    id: '1',
    name: 'Savannah Nguyen',
    building: 'Block A-422',
    flatNumber: '422',
    society: 'SevenGen society',
    profilePicture: 'https://via.placeholder.com/150',
    ownershipStatus: 'Owner',
  },
  {
    id: '2',
    name: 'Cameron Williamson',
    building: 'Block B-300',
    flatNumber: '300',
    society: 'SevenGen society',
    profilePicture: 'https://via.placeholder.com/150',
    ownershipStatus: 'Rented',
  },
  {
    id: '3',
    name: 'Brooklyn Simmons',
    building: 'Block C-303',
    flatNumber: '303',
    society: 'SevenGen society',
    profilePicture: 'https://via.placeholder.com/150',
    ownershipStatus: 'Owner',
  },
  {
    id: '4',
    name: 'Liam Rodriguez',
    building: 'Block A-101',
    flatNumber: '101',
    society: 'SevenGen society',
    profilePicture: 'https://via.placeholder.com/150',
    ownershipStatus: 'Owner',
  },
  {
    id: '5',
    name: 'Emma Watson',
    building: 'Block B-202',
    flatNumber: '202',
    society: 'SevenGen society',
    profilePicture: 'https://via.placeholder.com/150',
    ownershipStatus: 'Rented',
  },
];

// Chat data
const chatData = [
  {
    image: imagePaths.club_house,
    name: 'emma weston',
    message: 'hello',
    time: '6:45 pm',
    messageCount: 1,
  },
  {
    image: imagePaths.club_house,
    name: 'weston',
    message: 'hello',
    time: '6:45 am',
    messageCount: 1,
  },
  {
    image: imagePaths.club_house,
    name: 'weston jon',
    message: 'hello',
    time: '6:45 pm',
    messageCount: 0,
  },
];

// Group members by their blocks
const groupedMembers = [
  {
    title: 'Block A',
    data: userData.filter(user => user.building.includes('Block A')),
  },
  {
    title: 'Block B',
    data: userData.filter(user => user.building.includes('Block B')),
  },
  {
    title: 'Block C',
    data: userData.filter(user => user.building.includes('Block C')),
  },
];

// Chat Screen Component
const ChatScreen = () => {
  return (
    <FlatList
      data={chatData}
      keyExtractor={item => item.name}
      renderItem={({item}) => (
        <MessageCard
          name={item.name}
          message={item.message}
          image={item.image}
          count={item.messageCount}
          time={item.time}
        />
      )}
    />
  );
};

// Resident Screen Component
const ResidentScreen = () => {
  function alert(arg0: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <SectionList
      sections={groupedMembers}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <View style={styles.card}>
          <Image
            source={{uri: item.profilePicture}}
            style={styles.profileImage}
          />
          <View style={styles.memberInfo}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.details}>
              {item.building} | {item.ownershipStatus}
            </Text>
          </View>
          <View style={styles.iconContainer}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => alert(`Calling ${item.name}`)}>
              <Text style={styles.iconText}>📞</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => alert(`Chat with ${item.name}`)}>
              <Text style={styles.iconText}>💬</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      renderSectionHeader={({section: {title}}) => (
        <Text style={styles.blockTitle}>{title}</Text>
      )}
      contentContainerStyle={styles.listContainer}
    />
  );
};

// Main Chat Component
const Chat = () => {
  const [activeTab, setActiveTab] = useState('chat');

  const renderContent = () => {
    if (activeTab === 'chat') {
      return <ChatScreen />;
    } else if (activeTab === 'resident') {
      return <ResidentScreen />;
    }
  };

  return (
    <View style={styles.containers}>
      <View style={styles.container}>
        {/* Top Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'chat' && styles.activeTab]}
            onPress={() => setActiveTab('chat')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'chat' && styles.activeTabText,
              ]}>
              Chat
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'resident' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('resident')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'resident' && styles.activeTabText,
              ]}>
              Residents
            </Text>
          </TouchableOpacity>
        </View>

        {/* Render Content Below */}
        <View style={styles.content}>{renderContent()}</View>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  containers: {
    flex: 1,
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: '#005bb5',
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
  },
  blockTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginVertical: 8,
    padding: 15,
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  memberInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  iconButton: {
    marginLeft: 12,
    padding: 8,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
    color: '#005bb5',
  },
  listContainer: {
    paddingHorizontal: 10,
  },
});

export default Chat;
