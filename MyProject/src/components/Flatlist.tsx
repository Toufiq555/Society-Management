import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface FlatlistProps {
  image: string;
  name: string;
  time: string;
  status: string;
  onCallPress: () => void;
  onDeletePress: () => void;
  onGatePassPress: () => void;
}

const Flatlist: React.FC<FlatlistProps> = ({
  image,
  name,
  time,
  status,
  onCallPress,
  onDeletePress,
  onGatePassPress,
}) => {
  return (
    <View style={styles.card}>
      {/* Image Section */}
      <Image source={{uri: image}} style={styles.image} />

      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.time}>{time}</Text>
        <Text style={styles.status}>{status}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onCallPress} style={styles.iconButton}>
          <Ionicons name="call-outline" size={24} color="green" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDeletePress} style={styles.iconButton}>
          <Ionicons name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onGatePassPress} style={styles.iconButton}>
          <Ionicons name="document-text-outline" size={24} color="blue" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Flatlist;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    height: 100,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 14,
    color: 'gray',
  },
  status: {
    fontSize: 12,
    color: '#2ecc71', // Green for status
    marginTop: 5,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iconButton: {
    marginLeft: 10,
  },
});
