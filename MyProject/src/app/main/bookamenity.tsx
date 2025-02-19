import {useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import {RouteProp} from '@react-navigation/native';
import imagePaths from '../../constant/imagePaths';

type RouteParams = {
  image: string;
  title: string;
  price: string;
  booking: string;
};

const BookAmenity = () => {
  const route = useRoute<RouteProp<{params: RouteParams}, 'params'>>();
  const {image, title, price, booking} = route.params;

  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState<{
    type: 'from' | 'to';
    show: boolean;
  }>({
    type: 'from',
    show: false,
  });

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    if (selectedDate) {
      if (showPicker.type === 'from') {
        setFromDate(selectedDate);
      } else {
        setToDate(selectedDate);
      }
    }
    setShowPicker({...showPicker, show: false});
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select Date';
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Amenity Details</Text>
      <Image source={imagePaths.club_house} style={styles.image} />
      <FlatList
        data={[
          {key: 'Title', value: title},
          {key: 'Price', value: price},
          {key: 'Booking', value: booking},
        ]}
        keyExtractor={item => item.key}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Text style={styles.label}>{item.key}:</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.dateContainer}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowPicker({type: 'from', show: true})}>
          <Text style={styles.dateText}>From: {formatDate(fromDate)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowPicker({type: 'to', show: true})}>
          <Text style={styles.dateText}>To: {formatDate(toDate)}</Text>
        </TouchableOpacity>
      </View>
      {showPicker.show && (
        <DateTimePicker
          value={new Date()}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleDateChange}
          minimumDate={
            showPicker.type === 'to' && fromDate ? fromDate : undefined
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  listContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#555',
  },
  dateContainer: {
    marginTop: 20,
  },
  dateButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default BookAmenity;

// import { useRoute } from '@react-navigation/native';
// import React from 'react';
// import { View, Text, FlatList, StyleSheet, Image } from 'react-native';

// import { RouteProp } from '@react-navigation/native';
// import imagePaths from '@/src/constant/imagePaths';

// type RouteParams = {
//     image: string;
//     title: string;
//     price: string;
//     booking: string;
// };

// const BookAmenity = () => {
//     const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
//     const { image, title, price, booking } = route.params
//     // Transform the data into a FlatList-compatible array
//     const data = [
//         { key: 'Title', value: title },
//         { key: 'Price', value: price },
//         { key: 'Booking', value: booking },
//     ];

//     return (
//         <View style={styles.container}>
//             <Text style={styles.header}>Amenity Details</Text>
//             <Image source={imagePaths.club_house} style={styles.image} />
//             <FlatList
//                 data={data}
//                 keyExtractor={(item) => item.key}
//                 renderItem={({ item }) => (
//                     <View style={styles.item}>
//                         <Text style={styles.label}>{item.key}:</Text>
//                         <Text style={styles.value}>{item.value}</Text>
//                     </View>

//                 )}
//                 contentContainerStyle={styles.listContainer}
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//         backgroundColor: '#f7f7f7',
//     },
//     image: {
//         width: '100%',
//         height: 200,
//         borderRadius: 10,
//         marginBottom: 20,
//     },
//     header: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         textAlign: 'center',
//         marginBottom: 20,
//         color: '#333',
//     },
//     listContainer: {
//         backgroundColor: '#fff',
//         borderRadius: 8,
//         padding: 15,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 4,
//         elevation: 3,
//     },
//     item: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         paddingVertical: 10,
//         borderBottomWidth: 1,
//         borderBottomColor: '#ddd',
//     },
//     label: {
//         fontWeight: 'bold',
//         fontSize: 16,
//         color: '#333',
//     },
//     value: {
//         fontSize: 16,
//         color: '#555',
//     },
// });

// export default BookAmenity;
