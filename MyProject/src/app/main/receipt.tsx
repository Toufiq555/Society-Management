import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import imagePaths from '../../constant/imagePaths';

type RouteParams = {
  payment: {
    id: string;
    title: string;
    amount: number;
    duedate: string;
    status: string;
  };
};

const Receipt = () => {
  const route = useRoute<RouteProp<{params: RouteParams}, 'params'>>();
  const {payment} = route.params;
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      {/* Success Icon */}
      <Image source={imagePaths.check_mark} style={styles.successIcon} />

      <Text style={styles.successText}>Payment successful!!</Text>

      {/* Payment Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Security deposit</Text>
        <Text style={styles.paidStatus}>{payment.status}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Amount paid</Text>
        <Text style={styles.detailValue}>{payment.amount}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Paid on</Text>
        <Text style={styles.detailValue}>{payment.duedate}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Paid via</Text>
        <Text style={styles.detailValue}>NaNaNa</Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Transaction ID</Text>
        <Text style={styles.detailValue}>{payment.id}</Text>
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Download Receipt</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back to home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  successIcon: {
    width: 60,
    height: 60,
    marginBottom: 20,
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C6DBF',
    marginBottom: 20,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 5,
  },
  detailText: {
    fontSize: 16,
    color: '#555',
  },
  paidStatus: {
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 10,
    padding: 15,
    borderRadius: 5,
    borderColor: '#007bff',
    borderWidth: 1,
    width: '100%',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Receipt;
