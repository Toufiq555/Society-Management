import React, {useState, useContext} from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import axios from 'axios';
import {AuthProvider, AuthContext} from '../../../context/authContext';
import { API_URL } from "@env";

const LoginScreen = ({navigation}: any) => {
  const [phone, setPhone] = useState('');
  const authContext = useContext(AuthContext); // ✅ Get AuthContext safely

  const sendOTP = async () => {
    if (!phone) {
      Alert.alert('Error', 'Please enter your phone number.');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          phone,
        },
      );
      Alert.alert('Success', 'OTP sent successfully!');
      navigation.navigate('Otp', {phone});
    } catch (error) {
      Alert.alert('Error Failed to send OTP');
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 24, marginBottom: 20}}>Enter Phone Number</Text>
      <TextInput
        placeholder="+91XXXXXXXXXX"
        style={{borderWidth: 1, width: 250, padding: 10, marginBottom: 10}}
        keyboardType="phone-pad"
        onChangeText={setPhone}
        value={phone}
      />
      <TouchableOpacity
        onPress={sendOTP}
        style={{backgroundColor: 'blue', padding: 10}}>
        <Text style={{color: 'white'}}>Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
