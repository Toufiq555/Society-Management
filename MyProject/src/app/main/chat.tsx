import {useNavigation, NavigationProp} from '@react-navigation/native';
type StackParamList = {
  MessageScreen: {userName: string};
};
import MessageCard from '../../components/messagecard';
import imagePaths from '../../constant/imagePaths';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  SectionList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

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

const ChatScreen = () => {
  const navigation = useNavigation<NavigationProp<StackParamList>>();
  return (
    <FlatList
      data={chatData}
      keyExtractor={item => item.name}
      renderItem={({item}) => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('MessageScreen', {userName: item.name})
          }>
          <MessageCard
            name={item.name}
            message={item.message}
            image={item.image}
            count={item.messageCount}
            time={item.time}
          />
        </TouchableOpacity>
      )}
    />
  );
};

// Resident Screen Component
type Member = {
  id: string;
  name: string;
  block: string;
  flat_no: string;
  phone: string;
  role: string;
};

const ResidentScreen = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  // ✅ API Call to Fetch Members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('http://192.168.1.5:8080/api/v1/members'); // 🔹 Replace with actual API URL
        const jsonData = await response.json();
        if (jsonData.success) {
          setMembers(jsonData.members); // ✅ Save API data
        } else {
          Alert.alert('Error', 'Failed to load members');
        }
      } catch (error) {
        console.error('Error fetching members:', error);
        Alert.alert('Error', 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // ✅ Extract unique blocks
  const uniqueBlocks = [...new Set(members.map(member => member.block))].sort();

  // ✅ Filter members based on selected block
  const filteredMembers = selectedBlock
    ? members.filter(member => member.block === selectedBlock)
    : [];

  // ✅ Show loader while fetching data
  if (loading) {
    return (
      <ActivityIndicator size="large" color="#005bb5" style={{marginTop: 20}} />
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔹 Block Selection (Only show if no block is selected) */}
      {!selectedBlock ? (
        <View style={styles.blockContainer}>
          {uniqueBlocks.map(block => (
            <TouchableOpacity
              key={block}
              style={styles.blockButton}
              onPress={() => setSelectedBlock(block)}>
              <Text style={styles.blockText}>Block {block}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        // 🔹 Show only selected block with a back button
        <View style={styles.selectedBlockContainer}>
          <TouchableOpacity
            onPress={() => setSelectedBlock(null)}
            style={styles.backButton}>
            <Icon name="arrow-back" size={22} color="#333" />
            {/* <Text style={styles.backText}>Back</Text> */}
          </TouchableOpacity>
          <Text style={styles.selectedBlockText}>Block {selectedBlock}</Text>
        </View>
      )}

      {/* 🔹 Show Selected Block's Members */}
      {selectedBlock ? (
        filteredMembers.length > 0 ? (
          <FlatList
            data={filteredMembers}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <View style={styles.card}>
                <Text style={styles.name}>
                  {item.name} ({item.role})
                </Text>
                <Text style={styles.details}>
                  Flat: {item.flat_no} | {item.phone}
                </Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noMembersText}>
            No members found in Block {selectedBlock}
          </Text>
        )
      ) : (
        <Text style={styles.selectText}>
          Please select a block to view members
        </Text>
      )}
    </View>
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
    backgroundColor: 'white',
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
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    elevation: 4,
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
  blockContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginBottom: 15,
    marginTop: 10,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  blockButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
  selectedBlock: {backgroundColor: '#005bb5'},
  blockText: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  selectText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  noMembersText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
  selectedBlockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  selectedBlockText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005bb5',
    marginTop: 10,
    padding: 8,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  backButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  backText: {fontSize: 16, color: '#333'},
});

export default Chat;
