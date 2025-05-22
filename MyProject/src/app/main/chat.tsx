import React, { useEffect, useState, useCallback, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
  useColorScheme,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import io from 'socket.io-client';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import MessageCard from '../../components/messagecard';
import imagePaths from '../../constant/imagePaths';
import { API_URL, SOCKET_URL } from "@env";
import { AuthContext } from '../../../context/authContext';

const socket = io(SOCKET_URL);
const { width } = Dimensions.get('window');

type StackParamList = {
  MessageScreen: { userName: string; userId: string };
};

type Chat = {
  id: string;
  userId: string;
  name: string;
  message: string;
  time: string;
  messageCount?: number;
  image: string;
};

// Chat Tab
const ChatScreen = () => {
  const navigation = useNavigation<NavigationProp<StackParamList>>();
  const [messages, setMessages] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const { user } = useContext(AuthContext);
  const userId = user?.id;

  const fetchChats = useCallback(async () => {
    try {
      if (!userId) return;

      const response = await fetch(`${API_URL}/api/v1/chats/${userId}`);
      
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('text/html')) {
        const htmlResponse = await response.text();
        console.error('HTML response:', htmlResponse);
        Alert.alert('Error', 'Received the unexpected HTML response from the server');
        return;
      }
      
      const jsonData = await response.json();
      if (jsonData.success) {
        setMessages(jsonData.chats);
      } else {
        Alert.alert('Error', jsonData.message || 'Failed to load chats');
      }
    } catch (error) {
      console.error('Error fetching the chats:', error);
      Alert.alert('Error', 'Failed to connect to server');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    socket.connect();
    fetchChats();

    const handleNewMessage = (msg: {
      senderId: string;
      senderName: string;
      text: string;
    }) => {
      setMessages((prev) => {
        const existingChatIndex = prev.findIndex(chat => chat.userId === msg.senderId);
        if (existingChatIndex >= 0) {
          const updatedChats = [...prev];
          updatedChats[existingChatIndex] = {
            ...updatedChats[existingChatIndex],
            message: msg.text,
            time: 'Just now',
            messageCount: (updatedChats[existingChatIndex].messageCount || 0) + 1
          };
          return updatedChats;
        } else {
          return [{
            id: msg.senderId,
            userId: msg.senderId,
            name: msg.senderName || 'New User',
            message: msg.text,
            time: 'Just now',
            messageCount: 1,
            image: imagePaths.club_house,
          }, ...prev];
        }
      });
    };

    socket.on('new_message', handleNewMessage);

    return () => {
      socket.disconnect();
      socket.off('new_message', handleNewMessage);
    };
  }, [fetchChats, userId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchChats();
  }, [fetchChats]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.flexContainer}>
      <FlatList
        contentContainerStyle={styles.flatListContent}
        data={messages}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('MessageScreen', { 
              userName: item.name,
              userId: item.userId 
            })}
          >
            <MessageCard
              name={item.name}
              message={item.message}
              image={item.image}
              count={item.messageCount}
              time={item.time}
              darkMode={colorScheme === 'dark'}
            />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No chats yet</Text>
            <Text style={styles.emptySubText}>Start a conversation with your neighbors</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

// The Residents Tab
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
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlock, setSelectedBlock] = useState<string>('All');
  const [showBlockPicker, setShowBlockPicker] = useState(false);
  const navigation = useNavigation<NavigationProp<StackParamList>>();
  const colorScheme = useColorScheme();
  const { user } = useContext(AuthContext);
  
  const currentUserId = user?.id;

  const fetchMembers = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/members`);
      const jsonData = await response.json();
      if (jsonData.success) {
        const otherMembers = jsonData.members.filter((member: Member) => member.id !== currentUserId);
        setMembers(otherMembers);
      } else {
        Alert.alert('Error', jsonData.message || 'Failed to load the members');
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      Alert.alert('Error', 'Failed to connect to server');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMembers();
  }, [fetchMembers]);

  const uniqueBlocks = ['All', ...new Set(members.map((m) => m.block))].sort();

  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBlock = selectedBlock === 'All' || member.block === selectedBlock;
    return matchesSearch && matchesBlock;
  });

  const startChat = useCallback((member: Member) => {
    navigation.navigate('MessageScreen', { 
      userName: member.name,
      userId: member.id 
    });
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.flexContainer}>
      <View style={styles.searchContainer}>
        <View style={[
          styles.searchInputContainer,
          colorScheme === 'dark' && styles.darkSearchInputContainer
        ]}>
          <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={[
              styles.searchInput,
              colorScheme === 'dark' && styles.darkSearchInput
            ]}
            placeholder="Search residents..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity 
          style={[
            styles.blockFilterButton,
            colorScheme === 'dark' && styles.darkBlockFilterButton
          ]}
          onPress={() => setShowBlockPicker(true)}
        >
          <Text style={styles.blockFilterText}>
            {selectedBlock === 'All' ? 'All' : `${selectedBlock}`}
          </Text>
          <Icon name="chevron-down" size={16} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showBlockPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBlockPicker(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => setShowBlockPicker(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          
          <View style={[
            styles.blockPickerContainer,
            colorScheme === 'dark' && styles.darkBlockPickerContainer
          ]}>
            <View style={[
              styles.blockPickerHeader,
              colorScheme === 'dark' && styles.darkBlockPickerHeader
            ]}>
              <Text style={[
                styles.blockPickerTitle,
                colorScheme === 'dark' && styles.darkBlockPickerTitle
              ]}>
                Select Block
              </Text>
              <TouchableOpacity 
                onPress={() => setShowBlockPicker(false)}
                style={styles.blockPickerCloseButton}
              >
                <Icon name="close" size={24} color="#007AFF" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={uniqueBlocks}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.blockPickerItem,
                    selectedBlock === item && styles.blockPickerItemSelected,
                    colorScheme === 'dark' && styles.darkBlockPickerItem
                  ]}
                  onPress={() => {
                    setSelectedBlock(item);
                    setShowBlockPicker(false);
                  }}
                >
                  <Text style={[
                    styles.blockPickerItemText,
                    selectedBlock === item && styles.blockPickerItemTextSelected,
                    colorScheme === 'dark' && styles.darkBlockPickerItemText
                  ]}>
                    {item === 'All' ? 'All Blocks' : `Block ${item}`}
                  </Text>
                  {selectedBlock === item && (
                    <Icon name="checkmark" size={20} color="#007AFF" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <FlatList
        data={filteredMembers}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.memberCard,
              colorScheme === 'dark' && styles.darkMemberCard
            ]}
            onPress={() => startChat(item)}
          >
            <View style={styles.memberInfo}>
              <Text 
                style={[
                  styles.memberName,
                  colorScheme === 'dark' && styles.darkMemberName
                ]}
              >
                {item.name}
              </Text>
              <Text 
                style={[
                  styles.memberDetails,
                  colorScheme === 'dark' && styles.darkMemberDetails
                ]}
              >
                {item.block} - {item.flat_no}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.chatButton}
              onPress={() => startChat(item)}
            >
              <Icon name="chatbubble-ellipses" size={20} color="#007AFF" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[
              styles.emptyText,
              colorScheme === 'dark' && styles.darkEmptyText
            ]}>
              No residents found
            </Text>
            {searchQuery !== '' && (
              <Text style={[
                styles.emptySubText,
                colorScheme === 'dark' && styles.darkEmptySubText
              ]}>
                Try a different search term
              </Text>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
};

// Main Chat Tabs
const Chat = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'resident'>('chat');
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={[
      styles.container, 
      colorScheme === 'dark' && styles.darkContainer
    ]}>
      <View style={[
        styles.tabBar, 
        colorScheme === 'dark' && styles.darkTabBar
      ]}>
        <TouchableOpacity
          style={[
            styles.tabButton, 
            activeTab === 'chat' && styles.activeTab,
            colorScheme === 'dark' && activeTab === 'chat' && styles.darkActiveTab
          ]}
          onPress={() => setActiveTab('chat')}
        >
          <Text style={[
            styles.tabText, 
            activeTab === 'chat' && styles.activeTabText,
            colorScheme === 'dark' && styles.darkTabText,
            colorScheme === 'dark' && activeTab === 'chat' && styles.darkActiveTabText
          ]}>
            Chats
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton, 
            activeTab === 'resident' && styles.activeTab,
            colorScheme === 'dark' && activeTab === 'resident' && styles.darkActiveTab
          ]}
          onPress={() => setActiveTab('resident')}
        >
          <Text style={[
            styles.tabText, 
            activeTab === 'resident' && styles.activeTabText,
            colorScheme === 'dark' && styles.darkTabText,
            colorScheme === 'dark' && activeTab === 'resident' && styles.darkActiveTabText
          ]}>
            Residents
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.flexContainer}>
        {activeTab === 'chat' ? <ChatScreen /> : <ResidentScreen />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Layout styles
  flexContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContent: {
    paddingBottom: 10,
  },

  // Main container styles
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5'
  },
  darkContainer: {
    backgroundColor: '#121212',
  },

  // Tab bar styles
  tabBar: { 
    flexDirection: 'row', 
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width:0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    width:'100%',
  },
  darkTabBar: {
    backgroundColor: '#1e1e1e',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  darkActiveTab: {
    borderBottomColor: '#0a84ff',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  darkTabText: {
    color: '#e5e5e5',
  },
  activeTabText: {
    color: '#007AFF',
  },
  darkActiveTabText: {
    color: '#0a84ff',
  },

  // Member card styles
  memberCard: {
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  darkMemberCard: {
    backgroundColor: '#1e1e1e',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  darkMemberName: {
    color: '#e5e5e5',
  },
  memberDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  darkMemberDetails: {
    color: '#999',
  },
  chatButton: {
    padding: 8,
  },

  // Search bar styles
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  darkSearchInputContainer: {
    backgroundColor: '#2a2a2a',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
  },
  darkSearchInput: {
    color: '#e5e5e5',
  },
  blockFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#e6f2ff',
    borderRadius: 10,
  },
  darkBlockFilterButton: {
    backgroundColor: '#2a2a2a',
  },
  blockFilterText: {
    color: '#007AFF',
    fontWeight: '500',
    marginRight: 4,
  },

  // Modal picker styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  blockPickerContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '50%',
    paddingBottom: 20,
  },
  darkBlockPickerContainer: {
    backgroundColor: '#1e1e1e',
  },
  blockPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  darkBlockPickerHeader: {
    borderBottomColor: '#2a2a2a',
  },
  blockPickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  darkBlockPickerTitle: {
    color: '#e5e5e5',
  },
  blockPickerCloseButton: {
    padding: 4,
  },
  blockPickerItem: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  darkBlockPickerItem: {
    backgroundColor: '#1e1e1e',
  },
  blockPickerItemSelected: {
    backgroundColor: '#f5f5f5',
  },
  blockPickerItemText: {
    fontSize: 16,
    color: '#333',
  },
  darkBlockPickerItemText: {
    color: '#e5e5e5',
  },
  blockPickerItemTextSelected: {
    color: '#007AFF',
    fontWeight: '500',
  },

  // Empty state styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  darkEmptyText: {
    color: '#999',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  darkEmptySubText: {
    color: '#666',
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