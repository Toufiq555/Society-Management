import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import imagePaths from '../../constant/imagePaths';

const Editprofile = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={imagePaths.profilepic} style={styles.image} />
        <Text style={styles.name}>Jacob Jons</Text>
        <Text style={styles.address}>A-101 SavenGen Society</Text>
      </View>
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} placeholder="Enter Name" />

      <Text style={styles.label}>Email-Address</Text>
      <TextInput style={styles.input} placeholder="Enter Email adress" />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput style={styles.input} placeholder="Enter Phone Number" />

      <TouchableOpacity style={styles.raiseButton}>
        <Text style={styles.raiseButtonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  imageContainer: {
    paddingLeft: 137,
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 7,
  },
  address: {
    fontSize: 10,
    marginTop: 5,
    color: 'grey',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  raiseButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 230,
  },
  raiseButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
export default Editprofile;
