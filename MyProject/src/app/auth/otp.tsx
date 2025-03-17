import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {AuthProvider, AuthContext} from '../../../context/authContext';
import { API_URL } from "@env";

type RouteParams = {
  phone: string;
};

const Otp = () => {
  const [otp, setOtp] = useState('');
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{params: RouteParams}, 'params'>>();
  const {phone} = route.params;
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <Text>Loading...</Text>; // ✅ Prevent error if context is null
  }

  const {login} = authContext;
  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      Alert.alert('Invalid OTP', 'Please enter the OTP');
      return;
    }

    try {
      const {data} = await axios.post(
        `${API_URL}/api/auth/verify-otp`,
        {phone, otp},
      );

      if (data.success) {
        const {token, user} = data; // ✅ Get token & user from response
        login(token, user); // ✅ Store token & user in AuthContext
        console.log('User:', user);
        console.log('Token:', token);
        console.log('Data:', data);
        Alert.alert('Success', 'OTP Verified Successfully');

        // ✅ Navigate to main screen & reset navigation stack
        // navigation.reset({index: 0, routes: [{name: 'main'}]});
      } else {
        Alert.alert('Error', data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Verification Failed', 'Error verifying OTP');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subText}>OTP sent to {phone}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        keyboardType="numeric"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
      />

      <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Otp;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  title: {fontSize: 24, fontWeight: 'bold'},
  subText: {fontSize: 16, marginVertical: 10},
  input: {
    width: '80%',
    borderWidth: 1,
    padding: 10,
    textAlign: 'center',
    fontSize: 18,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#2D3748',
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
  },
  buttonText: {fontSize: 18, color: '#fff'},
});
