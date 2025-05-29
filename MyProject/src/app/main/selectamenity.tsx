import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from "@env";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// --- Type Definitions ---
type Amenity = {
  id: number;
  name: string;
};

type Booking = {
  id: number;
  amenityName: string;
  bookingDate: string;
  endDate: string; // Ensure this is always present, even if same as bookingDate
  bookingTime: string; // Will be empty or 'Full Day' for 'fullday' bookings from backend
  bookingType: 'hourly' | 'fullday';
};

type Member = {
  id: number; // Ensure 'id' is part of your Member type from the backend
  flat_no: string;
  block: string;
  name: string;
  phone: string;
};

type User = {
  name: string;
  flatNo: string;
  block: string;
  phone: string;
};

// --- Main Component ---
const SelectAmenity = () => {
  const [activeTab, setActiveTab] = useState<'amenities' | 'myBookings'>('amenities');
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingAmenities, setLoadingAmenities] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigation = useNavigation<any>();

  // Effect to fetch amenities when the 'amenities' tab is active
  useEffect(() => {
    if (activeTab === 'amenities') {
      fetchAmenities();
    }
  }, [activeTab]);

  // Effect to fetch user details and bookings when 'myBookings' tab is active
  useEffect(() => {
    if (activeTab === 'myBookings') {
      fetchCurrentUserDetails(); // Fetch user details for display
      // fetchMyBookings will now be called after currentUser is set,
      // or when activeTab changes and currentUser is already available.
    }
  }, [activeTab]);

  // This useEffect will run whenever the 'currentUser' state changes,
  // allowing you to see its updated value reliably.
  // It also triggers fetchMyBookings once currentUser is available.
  useEffect(() => {
    if (currentUser) {
      console.log("DEBUG: Current User State updated:", currentUser);
      // Now that currentUser is available, fetch bookings
      fetchMyBookings();
    } else {
      console.log("DEBUG: Current User State is null.");
      // If currentUser becomes null (e.g., logout), clear bookings
      setBookings([]);
    }
  }, [currentUser]); // Depend on currentUser to re-fetch when it changes

  // This function is for fetching user details for DISPLAY purposes (like "Booked by: John Doe (A-101)")
  // It does NOT dictate how the backend fetches bookings.
  const fetchCurrentUserDetails = async () => {
    let token = null;

    try {
      token = await AsyncStorage.getItem('userToken');
      const phoneNumber = await AsyncStorage.getItem("userPhone");
      console.log("MyBooking: Phone number from AsyncStorage:", phoneNumber);

      if (phoneNumber) {
        // Fetch user details from the members list using the phone number
        const membersResponse = await axios.get(`${API_URL}/api/v1/members`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        console.log("Member Found", membersResponse);
        const members: Member[] = membersResponse.data?.members || [];
        const trimmedPhone = phoneNumber.trim();

        const foundUser = members.find(
          (m) => m.phone?.trim() === trimmedPhone
        );
        console.log("DEBUG: Found user:", foundUser);

        if (foundUser) {
          setCurrentUser({
            name: foundUser.name || "No Name",
            block: foundUser.block,
            flatNo: foundUser.flat_no || "N/A",
            phone: foundUser.phone,
          });
        } else {
          Alert.alert("User Not Found", "Your user details could not be found. Please contact support.");
          setCurrentUser(null);
        }
      } else {
        Alert.alert("Login Required", "Phone number not found. Please log in.");
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      Alert.alert("Error", "Failed to load your user details. Please check your network connection.");
    }
  };

  // This function now fetches bookings using currentUser details as query parameters.
  // IMPORTANT: The backend API must be updated to accept these parameters for filtering.
  const fetchMyBookings = async () => {
    setLoadingBookings(true);

    // Ensure currentUser details are available before attempting to fetch bookings
    if (!currentUser) {
      Alert.alert("User Details Missing", "Cannot fetch bookings without user information. Please ensure you are logged in.");
      setBookings([]);
      setLoadingBookings(false);
      return;
    }

    try {
      // Construct query parameters from currentUser details
      const queryParams = new URLSearchParams({
        name: currentUser.name,
        block: currentUser.block,
        flatNo: currentUser.flatNo,
      }).toString();

      const res = await fetch(`${API_URL}/api/v1/amenities/my-bookings?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (res.ok && data.success && Array.isArray(data.bookings)) {
        setBookings(data.bookings);
      } else {
        setBookings([]);
        Alert.alert("Info", data.message || "No bookings found or failed to load.");
      }
    } catch (error) {
      console.error("Failed to fetch my bookings:", error);
      Alert.alert("Error", "Failed to load your bookings. Please check your network connection.");
    } finally {
      setLoadingBookings(false);
    }
  };

  // --- Amenity Fetching Logic ---
  const fetchAmenities = async () => {
    try {
      setLoadingAmenities(true);
      const res = await fetch(`${API_URL}/api/v1/amenities/get-amenity`);
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.amenities)) {
        setAmenities(data.amenities);
      } else {
        setAmenities([]);
        console.warn("API returned no amenities or data.success is false:", data);
      }
    } catch (error) {
      console.error("Failed to fetch amenities:", error);
      Alert.alert("Error", "Failed to load amenities. Please check your network connection.");
    } finally {
      setLoadingAmenities(false);
    }
  };

  // --- Amenity Icon Mapping ---
  const getIconName = (amenityName: string) => {
    const name = amenityName.toLowerCase();
    if (name.includes('swim')) return 'pool';
    if (name.includes('badminton')) return 'badminton';
    if (name.includes('tennis')) return 'tennis-ball';
    if (name.includes('gym')) return 'dumbbell';
    if (name.includes('golf')) return 'golf';
    if (name.includes('sauna')) return 'hot-tub';
    if (name.includes('squash')) return 'racquetball';
    return 'star'; // Default icon
  };

  // --- Amenity Handlers ---
  const handleAmenityPress = (amenity: Amenity) => {
    navigation.navigate("BookAmenity", { name: amenity.name });
  };

  const filteredAmenities = amenities.filter(a =>
    a.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // --- Render Functions for Tabs ---
  const renderAmenitiesTab = () => {
    if (loadingAmenities) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading amenities...</Text>
        </View>
      );
    }

    return (
      <>
        <View style={styles.searchBox}>
          <Icon name="magnify" size={22} color="#aaa" style={styles.searchIcon} />
          <TextInput
            placeholder="Search Amenities"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <FlatList
          data={filteredAmenities}
          numColumns={3}
          columnWrapperStyle={styles.columnWrapper}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => handleAmenityPress(item)}
            >
              <View style={styles.iconCircle}>
                <Icon name={getIconName(item.name)} size={30} color="#007AFF" />
              </View>
              <Text style={styles.iconLabel}>{item.name}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Icon name="magnify-remove-outline" size={50} color="#ccc" />
              <Text style={styles.emptyStateText}>No amenities found matching your search.</Text>
            </View>
          )}
        />
      </>
    );
  };

  const renderMyBookingsTab = () => {
    if (loadingBookings) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading your bookings...</Text>
        </View>
      );
    }

    if (!currentUser) {
      return (
        <View style={styles.emptyState}>
          <Icon name="account-off-outline" size={50} color="#ccc" />
          <Text style={styles.emptyStateText}>User details not loaded. Please ensure you are logged in.</Text>
          <TouchableOpacity
            style={styles.bookNowButton}
            onPress={() => setActiveTab('amenities')}
          >
            <Text style={styles.bookNowButtonText}>Browse Amenities</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (bookings.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Icon name="calendar-remove-outline" size={50} color="#ccc" />
          <Text style={styles.emptyStateText}>You don't have any active bookings yet.</Text>
          <TouchableOpacity
            style={styles.bookNowButton}
            onPress={() => setActiveTab('amenities')}
          >
            <Text style={styles.bookNowButtonText}>Book an Amenity Now</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const renderBookingItem = ({ item }: { item: Booking }) => (
      <View style={styles.bookingItem}>
        <Text style={styles.bookingAmenityName}>{item.amenityName}</Text>
        {currentUser && (
          <View style={styles.bookingDetailsRow}>
            <Icon name="account" size={16} color="#555" />
            <Text style={styles.bookingDetailText}>Booked by: {currentUser.name} ({currentUser.block}-{currentUser.flatNo})</Text>
          </View>
        )}
        <View style={styles.bookingDetailsRow}>
          <Icon name="calendar" size={16} color="#555" />
          <Text style={styles.bookingDetailText}>Date: {item.bookingDate}</Text>
        </View>
        {item.bookingType === 'fullday' && item.bookingDate !== item.endDate && (
          <View style={styles.bookingDetailsRow}>
            <Icon name="calendar-end" size={16} color="#555" />
            <Text style={styles.bookingDetailText}>End Date: {item.endDate}</Text>
          </View>
        )}

        {/* --- the MODIFICATION STARTS HERE --- */}
        {item.bookingType === 'hourly' && ( // Only show time if bookingType is 'hourly'
          <View style={styles.bookingDetailsRow}>
            <Icon name="clock-outline" size={16} color="#555" />
            <Text style={styles.bookingDetailText}>Time: {item.bookingTime}</Text>
          </View>
        )}
        {/* --- MODIFICATION ENDS HERE --- */}

        <View style={styles.bookingDetailsRow}>
          <Icon name="tag" size={16} color="#555" />
          <Text style={styles.bookingDetailText}>Type: {item.bookingType === 'hourly' ? 'Hourly' : 'Full Day'}</Text>
        </View>
      </View>
    );

    return (
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderBookingItem}
        contentContainerStyle={styles.flatListContentContainer}
      />
    );
  };

  // --- Main Render ---
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'amenities' && styles.activeTabButton]}
          onPress={() => setActiveTab('amenities')}
        >
          <Text style={[styles.tabText, activeTab === 'amenities' && styles.activeTabText]}>
            Amenities
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'myBookings' && styles.activeTabButton]}
          onPress={() => setActiveTab('myBookings')}
        >
          <Text style={[styles.tabText, activeTab === 'myBookings' && styles.activeTabText]}>
            My Bookings
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conditional Content Rendering based on activeTab */}
      <View style={styles.contentArea}>
        {activeTab === 'amenities' ? renderAmenitiesTab() : renderMyBookingsTab()}
      </View>
    </View>
  );
};

// --- Styles (Same as before) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#555',
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginTop: 40,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabButton: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  activeTabText: {
    color: '#fff',
  },
  contentArea: {
    flex: 1,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 6,
    color: '#6F6CFF',
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '30%',
    marginBottom: 20,
    alignItems: 'center',
  },
  iconCircle: {
    backgroundColor: '#E0F0FF',
    padding: 18,
    borderRadius: 50,
    marginBottom: 6,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
  },
  iconLabel: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6F6CFF',
    marginTop: 4,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
    textAlign: 'center',
  },
  flatListContentContainer: {
    paddingBottom: 20,
  },
  bookingItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  bookingAmenityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  bookingDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bookingDetailText: {
    fontSize: 15,
    color: '#555',
    marginLeft: 5,
  },
  bookNowButton: {
    backgroundColor: '#6F6CFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  bookNowButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SelectAmenity;