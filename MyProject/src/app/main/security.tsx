

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { StackNavigationProp } from "@react-navigation/stack";
// 🔹 Define Stack Navigation Types
type RootStackParamList = {
  Security: undefined;
  AddGuest: undefined;
  AddDelivery:undefined;
  History:undefined;

};

// 🔹 Define Props Type for Navigation
type securityProps = {
  navigation: StackNavigationProp<RootStackParamList, "Security">;
};

const Security: React.FC<securityProps> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>GateApp</Text>
        <Image source={{ uri: 'https://example.com/user-profile.jpg' }} style={styles.profileImage} />
      </View>
      
      {/* Pre Approve Visitors Section */}
      <Text style={styles.sectionTitle}>Pre Approve Visitors</Text>
      <Text style={styles.subtitle}>Add visitor details for quick entries</Text>

      {/* Buttons for Adding Visitors */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("AddGuest")}>
          <Text style={styles.buttonText}>Add Guest</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}onPress={() => navigation.navigate("AddDelivery")}>
          <Text style={styles.buttonText}>Add Delivery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Add Service</Text>
        </TouchableOpacity>
       
      </View>
      
      {/* Community Section */}
      <Text style={styles.sectionTitle}>Community</Text>
      <Text style={styles.subtitle}>Everything about society management</Text>

      {/* Community Features */}
      <TouchableOpacity style={styles.card}>
        <Text style={styles.cardText}>HelpDesk - Complaints & Suggestions</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card}>
        <Text style={styles.cardText}>Notice Board - Society Announcements</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card}>
        <Text style={styles.cardText}>Due Society Payment</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card}onPress={() => navigation.navigate("History")}>
        <Text style={styles.cardText}>History</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: 'center',
    width: '48%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  cardText: {
    fontSize: 16,
  },
});

export default Security;