import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
  ImageBackground,
  FlatList,
  Image,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { RouteProp, useRoute } from '@react-navigation/native';
import { API_URL } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome'; // Ensure that you have this installed
//import  the LinearGradient from 'react-native-linear-gradient';


const timeSlots = [
  '8 AM - 9 AM', '9 AM - 10 AM', '10 AM - 11 AM', '11 AM - 12 PM',
  '12 PM - 1 PM', '1 PM - 2 PM', '2 PM - 3 PM', '3 PM - 4 PM', '4 PM - 5 PM',
  '5 PM - 6 PM', '6 PM - 7 PM', '7 PM - 8 PM', '8 PM - 9 PM', '9 PM - 10 PM', '10 PM - 11 PM'
];

type Amenity = {
  name: string;
  description?: string;
  capacity?: number | string;
  price?: number | string;
  advance?: number | string;
  imageUrl?: string; // Changed 'image' to 'imageUrl' to match backend
  images?: string[];
};

type RouteParams = {
  BookAmenity: {
    name: string;
  };
};

const BookAmenity = () => {
  const route = useRoute<RouteProp<RouteParams, 'BookAmenity'>>();
  const { name } = route.params;

  const [amenity, setAmenity] = useState<Amenity | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [fullDayBooking, setFullDayBooking] = useState(false);
  const [unavailableSlots, setUnavailableSlots] = useState<string[]>([]);

  useEffect(() => {
    const fetchAmenityDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/amenities/get-amenity`);
        const amenities = response.data?.amenities;
        const matched = amenities.find((item: Amenity) => item.name === name);
        setAmenity(matched || null);
      } catch (error) {
        console.error('Failed to fetch amenity details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAmenityDetails();
  }, [name]);

  useEffect(() => {
    const fetchUnavailableSlots = async () => {
      try {
        const formattedDate = startDate.toISOString().split('T')[0];
        const response = await axios.get(`${API_URL}/api/v1/booked-slots?amenity=${name}&date=${formattedDate}`);
        setUnavailableSlots(response.data.unavailableSlots || []);
      } catch (error) {
        console.error('Error fetching unavailable slots:', error);
      }
    };
    if (!fullDayBooking) fetchUnavailableSlots();
  }, [startDate, name, fullDayBooking]);

  const toggleSlot = (slot: string) => {
    setSelectedSlots(prev =>
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
    );
  };

  const parseNumber = (value: any): number => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  const calculateAmount = () => {
    if (!amenity) return 0;
    const hourlyRate = parseNumber(amenity.price);
    if (fullDayBooking) {
      const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
      return hourlyRate * 24 * days;
    } else {
      return hourlyRate * selectedSlots.length;
    }
  };

  const handleBooking = async () => {
    if (!fullDayBooking && selectedSlots.length === 0) {
      Alert.alert('Validation Error', 'Please select at least one time slot.');
      return;
    }

    try {
      const user = JSON.parse(await AsyncStorage.getItem('user') || '{}');
      const bookingDetails = {
        name,
        startDate,
        endDate: fullDayBooking ? endDate : startDate,
        timeSlots: fullDayBooking ? ['Full Day'] : selectedSlots,
        amount: calculateAmount(),
        userId: user.id,
        userName: user.name,
        userFlat: user.flatNo,
      };

      const response = await axios.post(`${API_URL}/api/v1/amenities/book-amenity`, bookingDetails);
      Alert.alert('Booking Success', response.data.message || 'Amenity booked successfully');
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Booking Failed', 'Slot may already be booked or something went wrong.');
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#6F6CFF" /></View>;
  }

  if (!amenity) {
    return <View style={styles.center}><Text>No details found for this amenity.</Text></View>;
  }

  const advance = parseNumber(amenity.advance);
  const price = parseNumber(amenity.price);
  const capacity = amenity.capacity || 'N/A';
  const imageUrl = amenity.imageUrl ? { uri: amenity.imageUrl } : null;

  // {/* ---  The Future Image FlatList Start --- */}
  const renderImageItem = ({ item }: { item: string }) => (
    <View style={styles.imageItemContainer}>
      <Image source={{ uri: item }} style={styles.imageItem} />
    </View>
  );
  // {/* --- Future Image FlatList End --- */}

  return (
    <ScrollView style={styles.container}>
      {/* --- Future Image Display Start --- */}
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image source={imageUrl} style={styles.defaultImage} resizeMode="cover" />
        ) : (
          <View style={styles.defaultImage}>
            <Icon name="image" size={40} color="#777" />
            <Text style={styles.defaultImageText}>No Image Available</Text>
          </View>
        )}
      </View>
      {/* --- Future Image Display End --- */}

      <View style={styles.headerContainer}>
        <Text style={styles.amenityNameHeader}>{amenity.name}</Text>
        <Text style={styles.priceHeader}>₹{price.toFixed(2)} {'\n'}per hour</Text>
      </View>

      <View style={styles.detailCard}>
        <Text style={styles.detailTitle}>Booking Details</Text>
        <View style={styles.detailInfoContainer}>
          <View style={styles.detailRowContainer}>
            <View style={styles.detailItemContainer}>
              <Text style={styles.detailLabel}>Capacity:</Text>
              <Text style={styles.detailValue}>{capacity}</Text>
            </View>
            <View style={styles.detailItemContainer}>
              <Text style={styles.detailLabel}>Advance Payment:</Text>
              <Text style={styles.detailValue}>₹{advance.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.bookingModeContainer}>
        <TouchableOpacity
          style={[styles.bookingModeButton, !fullDayBooking && styles.activeMode]}
          onPress={() => setFullDayBooking(false)}>
          <Text style={[styles.modeText, !fullDayBooking && styles.activeText]}>Hourly</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bookingModeButton, fullDayBooking && styles.activeMode]}
          onPress={() => setFullDayBooking(true)}>
          <Text style={[styles.modeText, fullDayBooking && styles.activeText]}>Full Day</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => setShowStartPicker(true)}>
        <Text style={styles.dateLabel}>{fullDayBooking ? 'Start Date' : 'Date'}: {startDate.toDateString()}</Text>
      </TouchableOpacity>
      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onChange={(_, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) setStartDate(selectedDate);
          }}
        />
      )}

      {fullDayBooking && (
        <>
          <TouchableOpacity onPress={() => setShowEndPicker(true)}>
            <Text style={styles.dateLabel}>End Date: {endDate.toDateString()}</Text>
          </TouchableOpacity>
          {showEndPicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              minimumDate={startDate}
              onChange={(_, selectedDate) => {
                setShowEndPicker(false);
                if (selectedDate) setEndDate(selectedDate);
              }}
            />
          )}
        </>
      )}

      {!fullDayBooking && (
        <View>
          <Text style={styles.dateLabel}>Select Time Slots</Text>
          <View style={styles.slotGrid}>
            {timeSlots.map((slot, index) => (
              <TouchableOpacity
                key={slot}
                style={[
                  styles.slotButton,
                  selectedSlots.includes(slot) && styles.selectedSlot,
                  unavailableSlots.includes(slot) && styles.disabledSlot,
                  index % 3 !== 0 && styles.slotMarginLeft,
                ]}
                onPress={() => !unavailableSlots.includes(slot) && toggleSlot(slot)}
                disabled={unavailableSlots.includes(slot)}
              >
                <Text
                  style={[
                    styles.slotText,
                    selectedSlots.includes(slot) && styles.selectedSlotText,
                    unavailableSlots.includes(slot) && styles.disabledSlotText,
                  ]}
                >
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <Text style={styles.totalPrice}>Total Price: ₹{calculateAmount().toFixed(2)}</Text>

      <View style={styles.bookButtonContainer}>
        <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
          <Text style={styles.bookText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F9FF', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageContainer: { marginBottom: 10 },
  imageFlatList: { marginBottom: 0 },
  imageItemContainer: { marginRight: 10 },
  imageItem: { width: 150, height: 100, borderRadius: 8 },
  defaultImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#ADC7F7',
    borderTopLeftRadius: 8,
    borderTopRightRadius:8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultImageText: { fontSize: 14, color: '#777', marginTop: 0 },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical:10,
    marginBottom: 30,
    backgroundColor:'#ADC7F7',
    marginTop:-9,
    borderBottomLeftRadius:8,
    borderBottomRightRadius:8,
  },
  amenityNameHeader: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  priceHeader: { fontSize: 18, color: 'black' },
  headerBackground: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,

  },
  headerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(196, 43, 43, 0.3)',
    width: '100%',
    height: '100%',
    paddingHorizontal: 16,
  },
  amenityName: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  capacityPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  capacity: { color: '#fff', fontSize: 18 },
  price: { fontSize: 20, color: '#fff' },
  detailCard: { backgroundColor: '#fff', borderRadius: 10, padding: 0, marginBottom: 20 },
  detailTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  detailInfoContainer: {
    backgroundColor: '#ADC7F7',
    borderRadius: 8,
    padding: 16,
    marginBottom:20,
  },
  detailRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItemContainer: {
    flex: 1,
    marginRight: 10,
  },
  detailLabel: { fontSize: 17, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  detailValue: { fontSize: 15, color: '#555' },
  infoBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  infoBoxLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  infoBoxText: {
    fontSize: 14,
    color: '#555',
  },
  bookingModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingVertical: 5,
  },
  bookingModeButton: {
    paddingVertical: 14,
    paddingHorizontal: 65,
    backgroundColor: '#ddd',
    marginHorizontal: 0,
    borderRadius: 8,
  },
  activeMode: { backgroundColor: '#ADC7F7' },
  modeText: { fontSize: 14, color: '#333' },
  activeText: { color: '#fff' },
  dateLabel: { fontSize: 16, marginVertical: 10, color: '#333' },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
  slotButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 6,
    backgroundColor: '#fff',
    width: '30%',
    alignItems: 'center',
  },
  slotMarginLeft: {
    marginLeft: '3.33%',
  },
  selectedSlot: { backgroundColor: '#F2EF8D', borderColor: '#F2EF8D' },
  disabledSlot: { backgroundColor: '#ddd', borderColor: '#ccc' },
  slotText: { color: '#000', fontSize: 12 },
  selectedSlotText: { color: 'black' },
  disabledSlotText: { color: '#999' },
  totalPrice: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#333' },
  bookButtonContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 30,
  },
  bookButton: {
    backgroundColor: '#ADC7F7',
    paddingVertical: 14,
    alignItems: 'center',
  },
  bookText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default BookAmenity;