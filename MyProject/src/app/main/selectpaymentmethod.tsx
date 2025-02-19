import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import React from 'react';
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';

const paymentOptions = [
  {id: '1', lable: 'Credit Card', screen: 'Creditcard'},
  {id: '2', lable: 'Debit Card', screen: 'Debitcard'},
  {id: '3', lable: 'PayPal', screen: 'PaypalScreen'},
  {id: '4', lable: 'Visa', screen: 'VisaScreen'},
  {id: '5', lable: 'Pay Cash To Admin', screen: 'CashPaymentScreen'},
];

const Selectpaymentmethod = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const navigation = useNavigation<any>();

  const handleContinue = () => {
    if (selectedOption) {
      const selectedScreen = paymentOptions.find(
        option => option.id === selectedOption,
      )?.screen;
      if (selectedScreen) {
        navigation.navigate(selectedScreen);
      }
    } else {
      alert('Please select a payment method');
    }
  };

  return (
    <View style={styles.container}>
      <Text></Text>
      <FlatList
        data={paymentOptions}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[
              styles.option,
              selectedOption === item.id && styles.selectedOption,
            ]}
            onPress={() => setSelectedOption(item.id)}>
            <Text style={styles.optionText}>{item.lable}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>Continue</Text>
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

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  option: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: '#d1e7dd',
    borderColor: '#0f5132',
  },

  optionText: {
    fontSize: 16,
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

export default Selectpaymentmethod;
function alert(arg0: string) {
  throw new Error('Function not implemented.');
}
