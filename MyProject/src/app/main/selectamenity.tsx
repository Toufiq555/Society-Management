import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const data = [
  {
    id: '1',
    image: 'https://via.placeholder.com/50',
    title: 'Club 1',
    price: '20$ per day',
    booking: 'Paid',
  },
  {
    id: '2',
    image: 'https://via.placeholder.com/50',
    title: 'swimming Pool',
    price: '10$ per day',
    booking: 'Paid',
  },
  {
    id: '3',
    image: 'https://via.placeholder.com/50',
    title: 'Guest house',
    price: '50$ per day',
    booking: 'Paid',
  },
  {
    id: '4',
    image: 'https://via.placeholder.com/50',
    title: 'Community Hall',
    price: '30$ per day',
    booking: 'Paid',
  },
  {
    id: '5',
    image: 'https://via.placeholder.com/50',
    title: 'Tennis room',
    price: 'Free',
    booking: 'Free',
  },
];

const Card = ({image, title, price, booking}: any) => {
  const navigation = useNavigation<any>();
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('Bookamenity', {image, title, price, booking})
      }>
      <Image source={{uri: image}} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.price}>{price}</Text>
      </View>
      <Text
        style={[
          styles.booking,
          booking === 'Paid' ? styles.paid : styles.Free,
        ]}>
        {booking}
      </Text>
    </TouchableOpacity>
  );
};
const SelectAmenity = () => {
  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <Card title={item.title} price={item.price} booking={item.booking} />
      )}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f7f7f7',
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    margin: 5,
  },
  details: {
    flex: 1,
    marginHorizontal: 10,
  },
  image: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: 'grey',
  },
  booking: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  paid: {
    color: 'green',
  },
  Free: {
    color: 'red',
  },
});
export default SelectAmenity;
