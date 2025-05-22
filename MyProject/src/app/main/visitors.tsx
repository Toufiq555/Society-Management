import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Flatlist from '../../components/Flatlist';
import { API_URL } from '@env';
const Visitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const flatNumber = await AsyncStorage.getItem('@flatNumber'); // Flat number fetch karein
        if (!flatNumber) {
          console.error('Flat number not found');
          return;
        }
    
        const response = await fetch(`${API_URL}/api/guests?flat=${flatNumber}`);
        const data = await response.json();
        setVisitors(data);
      } catch (error) {
        console.error('Error fetching visitors:', error);
      }
    };
    
    fetchVisitors();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View>
      {visitors.map((visitor, index) => (
        <Flatlist
          key={index}
          image={visitor.image}
          name={visitor.name}
          time={visitor.time}
          status={visitor.status}
          onCallPress={() => console.log('Call Pressed')}
          onDeletePress={() => console.log('Delete Pressed')}
          onGatePassPress={() => console.log('Gate Pass Pressed')}
        />
      ))}

      <View style={styles.buttonContainer}>
        <Button title="Pre-approve Visitors" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 325,
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
});

export default Visitors;
