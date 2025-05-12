import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import io from 'socket.io-client';
import { API_URL, SOCKET_URL } from "@env";
import { AuthContext } from '../../../context/authContext';
import { StackParamList } from '../../navigation/types';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  timestamp: string;
  // Add the other properties
}

type MessageScreenRouteProp = RouteProp<StackParamList, 'MessageScreen'>;

const MessageScreen = () => {
  const route = useRoute<MessageScreenRouteProp>();
  const navigation = useNavigation();
  const { userName, userId: otherUserId } = route.params;
  const { user, loading: authLoading } = useContext(AuthContext); // Include loading state
  console.log("MessageScreen - AuthContext user:", user);
  const currentUserId = user?.userData?.id;
  console.log("MessageScreen - currentUserId:", currentUserId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatId, setChatId] = useState(null);
  const socket = io(SOCKET_URL);
  const [loadingChatId, setLoadingChatId] = useState(true); // Add loading state for chatId

  useEffect(() => {
    const fetchOrCreateChatId = async () => {
      setLoadingChatId(true); // Set loading to true before API call
      try {
        const response = await fetch(`${API_URL}/api/v1/chats`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId1: currentUserId, userId2: otherUserId }),
        });
        const data = await response.json();
        console.log("fetchOrCreateChatId response:", data);
        if (data.success && data.chatId) {
          setChatId(data.chatId);
        } else {
          console.error('Failed to get or create chat ID:', data?.message);
          // Handle error appropriately
        }
      } catch (error) {
        console.error('Error fetching/creating chat ID:', error);
        // Handle error
      } finally {
        setLoadingChatId(false); // Set loading to false after API call completes
      }
    };

    if (currentUserId && otherUserId) {
      fetchOrCreateChatId();
    } else {
      setLoadingChatId(false); // If user IDs are not available
    }

    return () => {
      socket.disconnect();
    };
  }, [currentUserId, otherUserId]);

  useEffect(() => {
    if (chatId) {
      socket.connect();
      socket.emit('joinChat', chatId);

      const fetchMessages = async () => {
        // ... your fetch messages logic
      };
      fetchMessages();

      const handleNewMessage = (newMessage: Message) => {
        console.log("Frontend received newMessage:", newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };
      socket.on('newMessage', handleNewMessage);

      return () => {
        socket.off('newMessage', handleNewMessage);
      };
    }
  }, [chatId, socket]);

  const sendMessage = useCallback(() => {
    console.log("sendMessage called. newMessage:", newMessage);
    console.log("sendMessage called. chatId:", chatId);
    console.log("sendMessage called. currentUserId:", currentUserId);
    if (newMessage.trim() && chatId && currentUserId && otherUserId && !loadingChatId && !authLoading) { // ✅ Check loading states
      socket.emit('sendMessage', {
        sender: currentUserId,
        receiver: otherUserId,
        message: newMessage,
      });
      setNewMessage('');
    } else {
      console.log("Could not send message. Conditions not met:", { newMessage, chatId, currentUserId, otherUserId, loadingChatId, authLoading });
    }
  }, [newMessage, chatId, currentUserId, otherUserId, socket, loadingChatId, authLoading]); // Add loading states to dependency array

  if (loadingChatId || authLoading || !currentUserId) {
    return (
      <View style={styles.container}>
        <Text>Loading chat...</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.sender_id === currentUserId ? styles.sentMessage : styles.receivedMessage,
    ]}>
      <Text style={styles.messageText}>{item.content}</Text>
      <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Display the userName at the top */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{userName}</Text>
      </View>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Send a message..."
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessage}
          disabled={loadingChatId || authLoading || !currentUserId}
        >
          <Icon name="send" size={24} color={loadingChatId || authLoading || !currentUserId ? '#ccc' : '#007AFF'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'white',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageContainer: {
    borderRadius: 10,
    padding: 8,
    marginVertical: 4,
    marginHorizontal: 10,
    maxWidth: '70%',
  },
  sentMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#777',
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
  },
  sendButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#e6f2ff',
  },
});

export default MessageScreen;