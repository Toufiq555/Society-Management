import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Getsupport = () => {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <MaterialCommunityIcons name="wechat" size={100} color="black" />
      </View>
      <Text style={styles.title}>Get Support</Text>
      <Text style={styles.title1}>Suggest anyway we can improve</Text>

      <Text style={styles.label}>Complaint Type</Text>
      <TextInput style={styles.input} placeholder="Enter complaint type" />

      <Text style={styles.label}>Brief Your Complaint</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Brief your complaint"
        multiline
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit Complaint</Text>
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
  icon: {
    paddingLeft: 138,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title1: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 7,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 15,
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
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
export default Getsupport;
