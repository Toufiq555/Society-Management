import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../type';

const amenities = [
  {
    id: '1',
    image: require('../../assets/images/gym.jpg'),
    name: 'Gym',
    title: 'Gym Details',
    description: 'Maximum booking for 30 days per month per flat is allowed.',
    maxCapacity: 10,
    advanceBookingDays: 90,
    bookingSlots: [
      { time: '6 - 7 AM', price: 20 },
      { time: '7 - 8 AM', price: 20 },
    ],
  },
  {
    id: '2',
    image: require('../../assets/images/swimmingPool.jpg'),
    name: 'Swimming Pool',
    title: 'Swimming Pool Details',
    description: 'Pool access is available only for registered residents.',
    maxCapacity: 20,
    advanceBookingDays: 30,
    bookingSlots: [
      { time: '6 - 7 AM', price: 50 },
      { time: '7 - 8 AM', price: 50 },
    ],
  },
  {
    id: '3',
    image: require('../../assets/images/Badminton.jpg'),
    name: 'Badminton Court',
    title: 'Badminton Court Details',
    description: 'Bookings are available in hourly slots.',
    maxCapacity: 4,
    advanceBookingDays: 15,
    bookingSlots: [
      { time: '6 - 7 AM', price: 30 },
      { time: '7 - 8 AM', price: 30 },
    ],
  },
];

const AmenitiesScreen = () => {
  const navigation = useNavigation<NavigationProps>();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select an Amenity</Text>
      <FlatList
        data={amenities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>{
                console.log('Navigating with item:', item);
             navigation.navigate('BookAmenity', item)
            }}
            style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default AmenitiesScreen;
