import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';

type RouteParams = {
  userName: string;
};
const MessageScreen = ({router, navigation}: any) => {
  const route = useRoute<RouteProp<{params: RouteParams}, 'params'>>();
  const {userName} = route.params; // username fetch

  const [messages, setMessage] = useState([
    {id: '1', text: 'hello', sender: 'other'},
    {id: '2', text: 'hi', sender: 'me'},
  ]);

  const [newMessage, setNewMessage] = useState('');
  const sendMessage = () => {
    if (newMessage.trim().length > 0) {
      const newMsg = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'me',
      };
      setMessage([...messages, newMsg]);
      setNewMessage('');
    }
  };
  return (
    <View style={styles.container}>
      {/*Top bar*/}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>{'←'}</Text>
        </TouchableOpacity>
        <Text style={styles.userName}>{userName}</Text>
      </View>

      {/*Message List*/}
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View
            style={[
              styles.messageBubble,
              item.sender === 'me' ? styles.myMessage : styles.otherMessage,
            ]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        inverted // Latest message neeche se upar aaye
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#007bff',
  },
  backButton: {
    fontSize: 20,
    color: 'white',
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  messageBubble: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: '75%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
  },
  messageText: {
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonText: {
    color: 'white',
  },
});

export default MessageScreen;
