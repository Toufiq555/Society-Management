import React, {useState, useContext} from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import axios from 'axios';
import {AuthContext} from '../../../context/authContext';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({navigation}: any) => {
  const [phone, setPhone] = useState('');
  const authContext = useContext(AuthContext); // Get AuthContext safely

  // Function to send OTP to the user's phone
  const sendOTP = async () => {
    if (!phone) {
      Alert.alert('Error', 'Please enter your phone number.');
      return;
    }

    try {
      console.log('API_URL:', API_URL); // Debugging of API_URL

      // Make API call to send OTP
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        phone,
      });

      // Check for successful response
      if (response.status === 200) {
        await AsyncStorage.setItem('userPhone', phone); // Save phone number in AsyncStorage
        Alert.alert('Success', 'OTP sent successfully!');
        
        // Navigate to OTP screen and pass phone number
        navigation.navigate('Otp', { phone });
      } else {
        Alert.alert('Error', 'Failed to send OTP.');
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      Alert.alert('Error', 'Failed to send OTP. Please try again later.');
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 24, marginBottom: 20}}>Enter Phone Number</Text>
      <TextInput
        placeholder="+91XXXXXXXXXX"
        style={{borderWidth: 1, width: 250, padding: 10, marginBottom: 10}}
        keyboardType="phone-pad"
        onChangeText={setPhone} // Update phone state
        value={phone} // Bind phone number input
      />

      <TouchableOpacity
        onPress={sendOTP} // Send OTP on press
        style={{backgroundColor: 'blue', padding: 10, borderRadius: 5}}>
        <Text style={{color: 'white', fontSize: 16}}>Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
