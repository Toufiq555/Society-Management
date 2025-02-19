import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React from 'react';

const Creditcard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name on Card</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter name on card"
        keyboardType="default"
      />

      <Text style={styles.label}>Card Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter card number"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Expiry Date</Text>
      <TextInput
        style={styles.input}
        placeholder="MM/YY"
        keyboardType="numeric"
      />

      <Text style={styles.label}>CVV</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter CVV"
        keyboardType="numeric"
        secureTextEntry={true}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.continueButton}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 10,
  },
  continueButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Creditcard;
