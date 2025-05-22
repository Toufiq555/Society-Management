

import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, Modal, FlatList, Button, Image, 
  StyleSheet, ScrollView, 
  Alert
} from "react-native";
import { API_URL } from "@env";

const buildings = ["Building A", "Building B", "Building C", "Building D", "Building E", "Building F"];
const flats = ["101", "102", "103", "104", "201", "202", "203", "204", "301", "302", "303", "304"];
const deliveryCompanies = [
  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { name: "Flipkart", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Flipkart_logo.png" },
  { name: "Zomato", logo: "https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png" },
  { name: "Swiggy", logo: "https://upload.wikimedia.org/wikipedia/commons/1/13/Swiggy_logo.png" },
  { name: "Dunzo", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Dunzo_logo.png" },
  { name: "Blinkit", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Blinkit_logo.png" }
];

const AddDeliveryScreen = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedFlat, setSelectedFlat] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [customCompany, setCustomCompany] = useState("");
  const [modalType, setModalType] = useState(""); // "building", "flat"
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");

   // Function to handle form submission
    const handleSubmit = async () => {
      if (!name || !mobile || !selectedBuilding || !selectedFlat || !vehicleNumber ) {
        Alert.alert("Error", "All fields except company name are required!");
        return;
      }
    
      const Deliveries = {
        name,
        mobile,
        building: selectedBuilding,
        flat: selectedFlat,
        vehicle: vehicleNumber,
        company:selectedCompany

      };
    
      try {
        console.log("Sending request to API...");
        const response = await fetch(`${API_URL}/api/v1/Deliveries`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, mobile, building: selectedBuilding, flat: selectedFlat, vehicle: vehicleNumber,company:selectedCompany
          }),
        });
    
        const responseText = await response.text(); // Response ko JSON se pehle text me dekho
        console.log("Raw Response:", responseText);
    
        try {
          const result = JSON.parse(responseText); // Phir parse karo
          console.log("Parsed JSON:", result);
          if (response.ok) {
            Alert.alert("Success", "Request  Sended!");
          } else {
            Alert.alert("Error", result.message);
          }
        } catch (jsonError) {
          console.log("JSON Parse Error:", jsonError);
          Alert.alert("Error", "Invalid response from server.");
        }
    
      } catch (error) {
        console.log("Fetch Error:", error);
        Alert.alert("Network Error", "Please try again later.");
      }
    };
    

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.header}>Add Delivery</Text>

      {/* Name Input */}
      <Text style={styles.label}>Name:</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} />

      {/* Mobile Number Input */}
      <Text style={styles.label}>Mobile Number:</Text>
      <TextInput value={mobile} onChangeText={setMobile} style={styles.input} keyboardType="numeric" />

      {/* Building & Flat Number */}
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Building:</Text>
          <TouchableOpacity 
            style={styles.input} 
            onPress={() => { setModalType("building"); setModalVisible(true); }}
          >
            <Text>{selectedBuilding || "Select Building"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.column}>
          <Text style={styles.label}>Flat Number:</Text>
          <TouchableOpacity 
            style={styles.input} 
            onPress={() => { setModalType("flat"); setModalVisible(true); }}
          >
            <Text>{selectedFlat || "Select Flat"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Vehicle Number Input */}
      <Text style={styles.label}>Vehicle Number:</Text>
      <TextInput value={vehicleNumber} onChangeText={setVehicleNumber} style={styles.input} />

      {/* Delivery Company Selection */}
      <Text style={styles.label}>Delivery Company:</Text>
      <View style={styles.companyRow}>
        {deliveryCompanies.map((company) => (
          <TouchableOpacity 
            key={company.name} 
            style={[styles.companyBlock, selectedCompany === company.name && styles.selectedCompany]} 
            onPress={() => { setSelectedCompany(company.name); setCustomCompany(""); }}
          >
            <Image source={{ uri: company.logo }} style={styles.companyLogo} />
            <Text style={styles.companyText}>{company.name}</Text>
          </TouchableOpacity>
        ))}

        {/* Others Option */}
        <TouchableOpacity 
          style={[styles.companyBlock, selectedCompany === "Others" && styles.selectedCompany]} 
          onPress={() => { setSelectedCompany("Others"); }}
        >
          <Text style={styles.companyText}>Others</Text>
        </TouchableOpacity>
      </View>

      {/* Custom Company Input */}
      {selectedCompany === "Others" && (
        <TextInput 
          placeholder="Enter Company Name"
          value={customCompany}
          onChangeText={setCustomCompany}
          style={styles.input}
        />
      )}

      {/* Modal for Building & Flat Selection */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput 
              placeholder={'Search ${modalType === "building" ? "Building" : "Flat"}'}
              value={search}
              onChangeText={setSearch}
              style={styles.input}
            />
            <FlatList
                                data={(modalType === "building" ? buildings : flats).filter(item => item.includes(search))}
                                keyExtractor={(item) => item}
                                numColumns={3}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.blockItem}
                                        onPress={() => {
                                            modalType === "building" ? setSelectedBuilding(item) : setSelectedFlat(item);
                                            setModalVisible(false);
                                        }}
                                    >
                                        <Text style={styles.blockText}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                            />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Submit Button */}
       <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Send Request</Text>
              </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  input: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5 },
  
  row: { flexDirection: "row", justifyContent: "space-between" },
  column: { width: "48%" },
  
  companyRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 10 },
  companyBlock: { width: "30%", alignItems: "center", padding: 10, borderWidth: 1, borderRadius: 5, marginBottom: 10 },
  selectedCompany: { backgroundColor: "#d0ebff", borderColor: "blue" },
  companyLogo: { width: 40, height: 40, marginBottom: 5 },
  companyText: { fontSize: 12, textAlign: "center" },
  
  button: { backgroundColor: "blue", padding: 15, marginTop: 10, borderRadius: 5, alignItems: "center" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  
  modalContainer: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "white", padding: 20, margin: 20, borderRadius: 10 },
  scrollContainer: { maxHeight: 300 },
  
  blockItem: { width: "30%", padding: 15, margin: 5, backgroundColor: "#f5f5f5", borderRadius: 5, alignItems: "center", borderWidth: 1, borderColor: "#ddd" },
  blockText: { fontSize: 16, fontWeight: "bold" }
});

export default AddDeliveryScreen;