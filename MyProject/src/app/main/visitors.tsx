import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import React from 'react';
import Flatlist from '../../components/Flatlist';

const Visitors = () => {
  return (
    <View>
      <View>
        <Flatlist
          image="https://via.placeholder.com/150"
          name="Visitor Name"
          time="12:00 PM"
          status="Pre-approved"
          onCallPress={() => console.log('Call Pressed')}
          onDeletePress={() => console.log('Delete Pressed')}
          onGatePassPress={() => console.log('Gate Pass Pressed')}
        />

        <Flatlist
          image="https://via.placeholder.com/150"
          name="Visitor Name"
          time="12:00 PM"
          status="Inside"
          onCallPress={() => console.log('Call Pressed')}
          onDeletePress={() => console.log('Delete Pressed')}
          onGatePassPress={() => console.log('Gate Pass Pressed')}
        />

        <Flatlist
          image="https://via.placeholder.com/150"
          name="Visitor Name"
          time="12:00 PM"
          status="Inside"
          onCallPress={() => console.log('Call Pressed')}
          onDeletePress={() => console.log('Delete Pressed')}
          onGatePassPress={() => console.log('Gate Pass Pressed')}
        />
      </View>

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
