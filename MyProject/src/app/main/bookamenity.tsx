import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Alert,
  FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { RouteProp, useRoute } from '@react-navigation/native';
import { API_URL } from '@env';

type Amenity = {
  name: string;
  description: string;
  capacity: number;
  price: number;
  advance: number;
};

type RouteParams = {
  BookAmenity: {
    name: string;
  };
};

const timeSlots = Array.from({ length: 12 }, (_, i) => `${i + 1}pm-${i + 2 > 12 ? 1 : i + 2}pm`);

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

  const [slotModalVisible, setSlotModalVisible] = useState(false);

  const toggleSlot = (slot: string) => {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const calculateAmount = () => {
    if (!amenity) return 0;
    if (fullDayBooking) {
      const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
      return amenity.price * 24 * days;
    } else {
      return amenity.price * selectedSlots.length;
    }
  };

  const handleBooking = async () => {
    const bookingDetails = {
      name,
      startDate,
      endDate: fullDayBooking ? endDate : startDate,
      timeSlots: fullDayBooking ? ['Full Day'] : selectedSlots,
      amount: calculateAmount(),
    };

    try {

      console.log('Sending booking data:', bookingDetails); // Debugging log
      const response = await axios.post(`${API_URL}/api/v1/book-amenity`,bookingDetails);
      console.log('Booking successful', response);
      Alert.alert('Booking Success', response.data.message || 'Amenity booked successfully');
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Booking Failed', 'Selected Time slot is Not Available');
    }
  };

  useEffect(() => {
    const fetchAmenityDetails = async () => {
      try {
        console.log("Name:",name);
        const response = await axios.get(`${API_URL}/api/v1/get-amenity`);
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!amenity) {
    return (
      <View style={styles.center}>
        <Text>No details found for this amenity.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{amenity.name}</Text>
      <Text style={styles.label}>Description:</Text>
      <Text style={styles.value}>{amenity.description}</Text>

      <Text style={styles.label}>Capacity: {amenity.capacity}</Text>
      <Text style={styles.label}>Price/hour: ₹{amenity.price}</Text>
      <Text style={styles.label}>Advance: ₹{amenity.advance}</Text>

      <Text style={styles.label}>Booking Mode:</Text>
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, !fullDayBooking && styles.activeToggle]}
          onPress={() => setFullDayBooking(false)}
        >
          <Text>Hourly</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, fullDayBooking && styles.activeToggle]}
          onPress={() => setFullDayBooking(true)}
        >
          <Text>Full Day</Text>
        </TouchableOpacity>
      </View>
      // Inside your return (after booking mode toggle buttons):

<TouchableOpacity onPress={() => setShowStartPicker(true)}>
  <Text style={styles.label}>
    {fullDayBooking ? 'Start Date' : 'Date'}: {startDate.toDateString()}
  </Text>
</TouchableOpacity>

{showStartPicker && (
  <DateTimePicker
    value={startDate}
    mode="date"
    display="default"
    onChange={(_, selectedDate) => {
      setShowStartPicker(false);
      if (selectedDate) setStartDate(selectedDate);
    }}
  />
)}

// ✅ Only show End Date picker if Full Day selected
{fullDayBooking && (
  <>
    <TouchableOpacity onPress={() => setShowEndPicker(true)}>
      <Text style={styles.label}>End Date: {endDate.toDateString()}</Text>
    </TouchableOpacity>

    {showEndPicker && (
      <DateTimePicker
        value={endDate}
        mode="date"
        display="default"
        onChange={(_, selectedDate) => {
          setShowEndPicker(false);
          if (selectedDate) setEndDate(selectedDate);
        }}
      />
    )}
  </>
)}


      {!fullDayBooking && (
        <>
          <TouchableOpacity
            onPress={() => setSlotModalVisible(true)}
            style={styles.selectSlotButton}
          >
            <Text style={styles.selectSlotText}>Select Time Slots</Text>
          </TouchableOpacity>

          <Text style={styles.label}>
            Selected Slots: {selectedSlots.length > 0 ? selectedSlots.join(', ') : 'None'}
          </Text>

          <Modal visible={slotModalVisible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Choose Time Slots</Text>
                <FlatList
                  data={timeSlots}
                  numColumns={3}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.slot,
                        selectedSlots.includes(item) && styles.selectedSlot,
                      ]}
                      onPress={() => toggleSlot(item)}
                    >
                      <Text style={[
                        styles.slotText,
                        selectedSlots.includes(item) && styles.selectedSlotText,
                      ]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setSlotModalVisible(false)}
                >
                  <Text style={styles.modalCloseText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}

      <Text style={styles.total}>Total Price: ₹{calculateAmount()}</Text>

      <TouchableOpacity style={styles.bookBtn} onPress={handleBooking}>
        <Text style={styles.bookText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  label: { fontSize: 16, marginTop: 10 },
  value: { fontSize: 16 },
  toggleRow: { flexDirection: 'row', marginTop: 10 },
  toggleBtn: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    marginRight: 10,
  },
  activeToggle: {
    backgroundColor: '#ddd',
  },
  slot: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    margin: 5,
    flex: 1,
    alignItems: 'center',
  },
  selectedSlot: {
    backgroundColor: '#007AFF',
  },
  selectedSlotText: {
    color: '#fff',
  },
  slotText: {
    color: '#000',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
  bookBtn: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  bookText: {
    color: '#fff',
    fontSize: 16,
  },
  selectSlotButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  selectSlotText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalCloseButton: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default BookAmenity;
