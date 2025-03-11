import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import icons
import Home from './home';
import Profile from './profile';
import Service from './service';
import Security from './security';
import Chat from './chat';

const Bottomtab = () => {
  const [activeScreen, setActiveScreen] = useState('Home'); // Track the active screen

  // Render the active screen based on the state
  const renderScreen = () => {
    switch (activeScreen) {
      case 'Home':
        return <Home />;
      case 'Chat':
        return <Chat />;
      case 'Security':
        return <Security />;
      case 'Service':
        return <Service />;
      case 'Profile':
        return <Profile />;

      default:
        return <Home />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Main Content */}
      <View style={styles.content}>{renderScreen()}</View>

      {/* Persistent Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => setActiveScreen('Home')}>
          <Icon
            name="home"
            size={30}
            color={activeScreen === 'Home' ? '#FF6347' : '#000'}
          />
          <Text
            style={[
              styles.label,
              activeScreen === 'Home' && styles.activeLabel,
            ]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => setActiveScreen('Chat')}>
          <Icon
            name="chat"
            size={30}
            color={activeScreen === 'Chat' ? '#FF6347' : '#000'}
          />
          <Text
            style={[
              styles.label,
              activeScreen === 'Chat' && styles.activeLabel,
            ]}>
            Chat
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => setActiveScreen('Security')}>
          <Icon
            name="security"
            size={30}
            color={activeScreen === 'Security' ? '#FF6347' : '#000'}
          />
          <Text
            style={[
              styles.label,
              activeScreen === 'Security' && styles.activeLabel,
            ]}>
            Security
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => setActiveScreen('Service')}>
          <Icon
            name="room-service"
            size={30}
            color={activeScreen === 'Service' ? '#FF6347' : '#000'}
          />
          <Text
            style={[
              styles.label,
              activeScreen === 'Service' && styles.activeLabel,
            ]}>
            Service
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => setActiveScreen('Profile')}>
          <Icon
            name="person"
            size={30}
            color={activeScreen === 'Profile' ? '#FF6347' : '#000'}
          />
          <Text
            style={[
              styles.label,
              activeScreen === 'Profile' && styles.activeLabel,
            ]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  content: {
    flex: 1, // Take up available space for the main content
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    flexDirection: 'row', // Arrange buttons horizontally
    justifyContent: 'space-around', // Distribute buttons evenly
    alignItems: 'center',
    paddingVertical: 10, // Add padding for spacing
    borderTopWidth: 1, // Add a border line above the buttons
    borderTopColor: '#ccc',
    backgroundColor: '#fff', // Background color for the button bar
  },
  bottomButton: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12, // Smaller font size for labels
    marginTop: 5, // Space between icon and label
    color: '#000', // Default label color
  },
  activeLabel: {
    color: '#FF6347', // Active label color
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Bottomtab;
