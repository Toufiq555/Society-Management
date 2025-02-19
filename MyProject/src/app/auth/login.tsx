import React, {useState, useContext} from 'react';
import {AuthContext} from '../../../context/authContext';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import imagePaths from '../../constant/imagePaths';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  //global state
  const [state, setState] = useContext(AuthContext);
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Invalid Input', 'Please enter a valid email address');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Invalid Input', 'Please enter your password');
      return;
    }
    setLoading(true);
    try {
      const {data} = await axios.post('/auth/login', {email, password});
      setState(data);
      await AsyncStorage.setItem('@auth', JSON.stringify(data));
      navigation.navigate('main', {screen: 'Home'});
      console.log('login data ', {email, password});
      setLoading(false);
      // Alert.alert('login Successful');
      // Alert.alert(
      //   'Registration Successful',
      //   `Username: ${name}\nEmail: ${email}\nPassword: ${password}`,
      // );
      // Phone: +${callingCode}${phoneNumber}
    } catch (error) {
      console.log(error);
      setLoading(false);
      Alert.alert('login Failed', 'An error occurred during login.');
    }
    // Navigate to the main app screen (update the route/screen as needed)
    //   navigation.reset({
    //     index: 0,
    //     routes: [{name: 'main', params: {screen: 'Chat'}}],
    //   });
    // }, 1000);
  };
  // temp function to check local storage
  const getLocalStorageData = async () => {
    let data = await AsyncStorage.getItem('@auth');
    console.log('Local Storage ==>', data);
  };
  getLocalStorageData();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ImageBackground source={imagePaths.bg_image} style={styles.background}>
        {/* Overlay to improve readability */}
        <View style={styles.overlay} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>LOGIN</Text>
          <Text style={styles.subheading}>
            Hello user, please login to your account
          </Text>

          {/* Email Input */}
          <View style={styles.inputRow}>
            <Icon name="email" size={24} color="#555" />
            <Text style={styles.divider}>|</Text>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#888"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputRow}>
            <Icon name="lock" size={24} color="#555" />
            <Text style={styles.divider}>|</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Don't have an account? Register */}
          <View style={styles.registerPrompt}>
            <Text style={styles.promptText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  // A semi-transparent overlay to enhance text readability over the background image
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'serif',
  },
  subheading: {
    fontSize: 16,
    fontWeight: '300',
    marginBottom: 20,
    textAlign: 'center',
    color: '#eee',
    fontFamily: 'serif',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    height: 50,
  },
  divider: {
    fontSize: 18,
    marginHorizontal: 10,
    color: '#ccc',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#2D3748',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    elevation: 3,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  registerPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  promptText: {
    fontSize: 16,
    color: '#fff',
  },
  registerText: {
    fontSize: 16,
    color: '#FFD700', // This color differentiates the Register text
    fontWeight: 'bold',
  },
});
