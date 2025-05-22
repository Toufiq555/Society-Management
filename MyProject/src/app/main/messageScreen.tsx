import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { io, Socket } from 'socket.io-client';
import { API_URL, SOCKET_URL } from "@env";

interface Message {
  id: string;
  sender_id: string;
  content: string;
  timestamp: string;
}

type MessageScreenRouteParams = {
  userName: string;
  userId: string;
};

type MessageScreenRouteProp = RouteProp<any, 'MessageScreen'>;

const MessageScreen = () => {
  const route = useRoute<MessageScreenRouteProp>();
  const navigation = useNavigation();
  const { userName, userId: otherUserId } = route.params as MessageScreenRouteParams;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>('user123'); //  Get from auth

 useEffect(() => {
    const fetchOrCreateChatId = async () => {
      if (!currentUserId || !otherUserId) return;

      try {
        console.log('API_URL:', `${API_URL}/api/v1/chats`);
console.log('Method:', 'POST');
console.log('Headers:', { 'Content-Type': 'application/json' });
console.log('Body:', JSON.stringify({ userId1: currentUserId, userId2: otherUserId }));

        const response = await fetch(`${API_URL}/api/v1/chats`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId1: currentUserId, userId2: String(otherUserId) }), // Convert the otherUserId to a string
        });
        const data = await response.json();

        if (data.success && data.chatId) {
          setChatId(data.chatId);
        }
      } catch (error) {
        console.error('Error fetching/creating chat ID:', error);
      }
    };

    fetchOrCreateChatId();
  }, [currentUserId, otherUserId]);


  useEffect(() => {
    if (chatId) {
      const newSocket = io(SOCKET_URL);
      setSocket(newSocket);

      newSocket.emit('joinChat', chatId);

      const fetchMessages = async () => {
        try {
          const response = await fetch(`${API_URL}/api/v1/messages/${chatId}`); //  the Corrected route
          const data = await response.json();
          if (data.success) {
            setMessages(data.messages);
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      fetchMessages();

      const handleNewMessage = (message: Message) => {
        console.log("New message received", message);
        setMessages((prevMessages) => [...prevMessages, message]);
      };

      newSocket.on('newMessage', handleNewMessage);

      return () => {
        newSocket.disconnect();
        setSocket(null);
        newSocket.off('newMessage', handleNewMessage);
      };
    }
  }, [chatId]);

  const sendMessage = useCallback(() => {
    if (newMessageText.trim() && chatId && currentUserId) {
      socket?.emit('sendMessage', {
        sender: currentUserId,
        receiver: otherUserId,
        message: newMessageText,
        chatId: chatId, // Pass the chatId here
      });
      setNewMessageText('');
    }
  }, [newMessageText, chatId, currentUserId, otherUserId, socket]);

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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{userName}</Text>
      </View>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessageText}
          onChangeText={setNewMessageText}
          placeholder="Send a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Icon name="send" size={24} color="#007AFF" />
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