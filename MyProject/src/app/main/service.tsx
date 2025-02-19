import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TextInput} from 'react-native-gesture-handler';

const gridData = [
  {title: 'Home Cleaning', icon: 'cleaning-services', screen: ''},
  {title: 'Plumbing Service', icon: 'plumbing', screen: ''},
  {title: 'Hair & Beauty', icon: 'face', screen: ''},
  {title: 'Packer & Mover', icon: 'local-shipping', screen: ''},
  {title: 'Home Painting', icon: 'format-paint', screen: ''},
  {title: 'Carpenters Service', icon: 'carpenter', screen: ''},
  {title: 'Appliance Repair', icon: 'settings', screen: ''},
  {title: 'Home Sanitize', icon: 'sanitizer', screen: ''},
];

const Service = () => {
  const navigation = useNavigation<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [problemDescription, setProblemDescription] = useState('');

  const handleItemPress = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleBookVisit = () => {
    // Perform booking logic here
    console.log('Booking details:', {
      service: selectedItem?.title,
      problemDescription,
    });
    setModalVisible(false);
  };

  return (
    <View>
      <Text style={styles.Title}>Nearby Service Provider</Text>
      <FlatList
        data={gridData}
        numColumns={2}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => handleItemPress(item)}>
            <MaterialIcons name={item.icon} size={30} color="black" />
            <Text style={styles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.title}
        contentContainerStyle={styles.gridLayout}
      />
      {/* Modal */}
      {selectedItem && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContant}>
              <MaterialIcons
                name={selectedItem.icon}
                size={80}
                color="black"
                style={styles.modalIcon}
              />

              {/* Service Title */}
              <Text style={styles.modalTitle}>{selectedItem.title}</Text>

              {/* Select Service Input */}
              <Text style={styles.label}>Select Service</Text>
              <TextInput
                style={styles.input}
                placeholder="Service you want"
                value={selectedItem.screen}
                editable={false}
              />

              <Text style={styles.label}>Brief Your Problem</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Brief your problem"
                multiline
              />

              <View style={styles.buttonContainer}>
                <Button
                  title="Cancel"
                  onPress={() => setModalVisible(false)}
                  color="red"
                />
                <Button
                  title="Book Visit"
                  onPress={handleBookVisit}
                  color="green"
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  Title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 12,
  },

  gridCard: {
    width: '45%',
    backgroundColor: 'white',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardTitle: {
    color: 'black',
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },

  gridLayout: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContant: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalSubTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalIcon: {
    alignSelf: 'center',
    marginBottom: 20,
    paddingLeft: 15,
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
});
export default Service;
