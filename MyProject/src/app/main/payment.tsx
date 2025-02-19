import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';

interface payment {
  id: string;
  title: string;
  amount: string;
  duedate: string;
  isNew: boolean;
  status: 'paid' | 'pending' | 'failed';
}

const paymentList: payment[] = [
  {
    id: '1',
    title: 'Maintenance Charge Jan 2025',
    amount: '$10.00',
    duedate: '10 Jan ',
    isNew: true,
    status: 'paid',
  },
  {
    id: '2',
    title: 'Maintenance Charge Feb 2025',
    amount: '$15.00',
    duedate: '28 Feb ',
    isNew: true,
    status: 'pending',
  },
  {
    id: '3',
    title: 'Security Deposit',
    amount: '$15.00',
    duedate: '20 AUG ',
    isNew: false,
    status: 'failed',
  },
];

const Payment = () => {
  const navigation = useNavigation<any>();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid':
        return styles.paidBackground;
      case 'pending':
        return styles.pendingBackground;
      case 'failed':
        return styles.failedBackground;
      default:
        return {};
    }
  };

  const renderButton = (status: string, item: payment, navigation: any) => {
    if (status === 'paid') {
      return (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Receipt', {payment: item})}>
          <Ionicons name="receipt" size={24} color="black" />
          <Text style={styles.buttonText}>Receipt</Text>
        </TouchableOpacity>
      );
    } else if (status === 'pending' || status === 'failed') {
      return (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Selectpaymentmethod')}>
          <FontAwesome5 name="money-bill" size={24} color="black" />
          <Text style={styles.buttonText}>Pay </Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <FlatList
      data={paymentList}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <View style={[styles.card]}>
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <Text style={styles.title}>{item.title}</Text>
            {item.isNew && <Text style={styles.newTag}>New</Text>}
          </View>

          {/* Description */}
          <View style={styles.cardDescription}>
            <View style={styles.amountContainer}>
              <Text style={styles.amount}>{item.amount}</Text>
              <Text style={styles.dueDate}>{item.duedate}</Text>
            </View>
            {renderButton(item.status, item, navigation)}
          </View>

          {/* Footer */}
          <View style={[styles.footer, getStatusStyle(item.status)]}>
            <Text style={styles.footerText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>
      )}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardDescription: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  newTag: {
    fontSize: 12,
    color: '#fff',
    backgroundColor: '#007aff',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  amountContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  amount: {
    fontSize: 14,
    color: '#666',
  },
  dueDate: {
    fontSize: 14,
    color: '#666',
  },
  iconButton: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 14,
    color: '#000',
    marginLeft: 5,
  },
  footer: {
    marginTop: 10,
    alignSelf: 'center',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  paidBackground: {
    backgroundColor: '#DFF5E1',
  },
  pendingBackground: {
    backgroundColor: '#FFEDD5',
  },
  failedBackground: {
    backgroundColor: '#f8d7da',
  },
  payNowButton: {
    backgroundColor: '#FFE2E5',
  },
  buttonText: {
    fontSize: 14,
    color: 'black',
    marginLeft: 5,
  },
  footerText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
});

export default Payment;
