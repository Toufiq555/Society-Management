import React, {useState} from 'react';
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
import CountryPicker, {CountryCode} from 'react-native-country-picker-modal';
import {useNavigation} from '@react-navigation/native';
import imagePaths from '../../constant/imagePaths';
import axios from 'axios';

const Register = () => {
  const navigation = useNavigation<any>();
  const [name, setname] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState<CountryCode>('US');
  const [callingCode, setCallingCode] = useState('1');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert('Invalid Input', 'Please enter a valid username');
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert('Invalid Input', 'Please enter a valid email address');
      return;
    }
    if (password.trim().length < 6) {
      Alert.alert(
        'Invalid Input',
        'Password must be at least 6 characters long',
      );
      return;
    }
    // Uncomment below if phone number validation is needed
    // if (phoneNumber.length < 10) {
    //   Alert.alert('Invalid phone number', 'Please enter a valid phone number');
    //   return;
    // }

    setLoading(true);
    try {
      const {data} = await axios.post('/auth/register', {
        name,
        email,
        password,
      });
      console.log('register data ', {name, email, password});
      // setLoading(false);
      // Alert.alert(
      //   'Registration Successful',
      //   `Username: ${name}\nEmail: ${email}\nPassword: ${password}`,
      // );
      // Phone: +${callingCode}${phoneNumber}
      navigation.navigate('Login');
    } catch (error) {
      console.log(error);
      setLoading(false);
      Alert.alert(
        'Registration Failed',
        'An error occurred during registration.',
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ImageBackground source={imagePaths.bg_image} style={styles.background}>
        <View style={styles.overlay} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>REGISTER</Text>
          <Text style={styles.subheading}>
            Hello user, please register your account
          </Text>

          {/* Username Input */}
          <View style={styles.inputRow}>
            <Icon name="person" size={24} color="#555" />
            <Text style={styles.divider}>|</Text>
            <TextInput
              style={styles.input}
              placeholder="name"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setname}
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputRow}>
            <Icon name="email" size={24} color="#555" />
            <Text style={styles.divider}>|</Text>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#888"
              value={email}
              keyboardType="email-address"
              onChangeText={setEmail}
            />
          </View>

          {/* Phone Number Input (Optional) */}
          {/*
          <View style={styles.inputRow}>
            <View style={styles.iconContainer}>
              <Icon name="phone" size={24} color="#555" />
              <CountryPicker
                countryCode={countryCode}
                withFilter
                withFlag
                onSelect={(country: any) => {
                  setCountryCode(country.cca2);
                  setCallingCode(country.callingCode[0]);
                }}
              />
              <Text style={styles.callingCode}>+{callingCode}</Text>
            </View>
            <Text style={styles.divider}>|</Text>
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              maxLength={10}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
          */}

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

          {/* Register Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>

          {/* Already have an account? Login */}
          <View style={styles.loginPrompt}>
            <Text style={styles.promptText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  // A semi-transparent overlay to enhance readability over the background image
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
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callingCode: {
    fontSize: 18,
    marginLeft: 5,
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
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  promptText: {
    fontSize: 16,
    color: '#fff',
  },
  loginText: {
    fontSize: 16,
    color: '#FFD700', // Golden color for emphasis; change as desired
    fontWeight: 'bold',
  },
});

export default Register;
