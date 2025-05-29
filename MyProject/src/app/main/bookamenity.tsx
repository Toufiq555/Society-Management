import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    ScrollView,
    Image,
    Switch,
    Dimensions,
    Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { RouteProp, useRoute } from '@react-navigation/native';
import { API_URL } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width: screenWidth } = Dimensions.get('window');

// Define all time slots for hourly booking
const timeSlots = [
    '8 AM - 9 AM', '9 AM - 10 AM', '10 AM - 11 AM', '11 AM - 12 PM',
    '12 PM - 1 PM', '1 PM - 2 PM', '2 PM - 3 PM', '3 PM - 4 PM', '4 PM - 5 PM',
    '5 PM - 6 PM', '6 PM - 7 PM', '7 PM - 8 PM', '8 PM - 9 PM', '9 PM - 10 PM', '10 PM - 11 PM'
];

// Enhanced color palette
const colors = {
    primary: '#6366F1',
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',
    secondary: '#F8FAFC',
    accent: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    text: '#1F2937',
    textLight: '#6B7280',
    textMuted: '#9CA3AF',
    background: '#F9FAFB',
    white: '#FFFFFF',
    border: '#E5E7EB',
    success: '#10B981',
    gradient: ['#6366F1', '#8B5CF6'],
};

// Define TypeScript types
type Amenity = {
    name: string;
    description?: string;
    capacity?: number | string;
    advance?: number | string;
    imageUrl?: string;
    images?: string[];
};

type User = {
    name: string;
    flatNo: string;
    block: string;
    phone: string;
};

type Member = {
    flat_no: string;
    block: string;
    name: string;
    phone: string;
};

type RouteParams = {
    BookAmenity: {
        name: string;
    };
};

const BookAmenity = () => {
    const route = useRoute<RouteProp<RouteParams, 'BookAmenity'>>();
    const { name } = route.params;

    // State variables
    const [amenity, setAmenity] = useState<Amenity | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
    const [unavailableSlots, setUnavailableSlots] = useState<string[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [dateSelected, setDateSelected] = useState(false);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [bookingMode, setBookingMode] = useState<'hourly' | 'fullday'>('hourly');

    // Function to fetch unavailable hourly slots for a specific date
    const fetchUnavailableSlots = async (date: Date) => {
        console.log('DEBUG: fetchUnavailableSlots: Initiating slot fetch...');
        setLoadingSlots(true);
        setSelectedSlots([]);

        try {
            const formattedDate = date.toISOString().split('T')[0];
            console.log(`DEBUG: fetchUnavailableSlots: Requesting booked slots for amenity: "${name}", date: "${formattedDate}"`);

            const response = await axios.get("http://192.168.1.21:8080/api/v1/amenities/booked-slots", {
                params: {
                    amenityName: name,
                    date: formattedDate,
                    bookingType: 'hourly'
                }
            });

            const receivedUnavailableSlots = response.data.unavailableSlots || [];
            setUnavailableSlots(receivedUnavailableSlots);
            console.log('DEBUG: fetchUnavailableSlots: Successfully updated unavailable slots:', receivedUnavailableSlots);

        } catch (error: unknown) {
            console.error('DEBUG: fetchUnavailableSlots: Error encountered during fetch.');
            if (axios.isAxiosError(error)) {
                console.error('Axios Error Details:', error.response?.data || error.message);
                Alert.alert('Error', error.response?.data?.message || 'Failed to load available time slots. Please check your network or try again.');
            } else if (error instanceof Error) {
                console.error('General Error Details:', error.message);
                Alert.alert('Error', 'An unexpected error occurred while loading slots. Please try again.');
            } else {
                console.error('Unknown Error Details:', error);
                Alert.alert('Error', 'An unknown error occurred. Please try again.');
            }
            setUnavailableSlots([]);
        } finally {
            console.log('DEBUG: fetchUnavailableSlots: Slot fetch process completed.');
            setLoadingSlots(false);
        }
    };

    // Function to fetch unavailable full days within a date range
    const fetchUnavailableDates = async (startDate: Date, endDate: Date) => {
        console.log('DEBUG: fetchUnavailableDates: Initiating full day fetch...');
        setLoadingSlots(true);
        setUnavailableSlots([]);

        try {
            const formattedStartDate = startDate.toISOString().split('T')[0];
            const formattedEndDate = endDate.toISOString().split('T')[0];
            console.log(`DEBUG: fetchUnavailableDates: Requesting booked dates for amenity: "${name}", from: "${formattedStartDate}" to: "${formattedEndDate}"`);

            const response = await axios.get("http://192.168.1.21:8080/api/v1/amenities/booked-slots", {
                params: {
                    amenityName: name,
                    startDate: formattedStartDate,
                    endDate: formattedEndDate,
                    bookingType: 'fullday'
                }
            });

            const receivedUnavailableDates = response.data.unavailableDates || [];
            setUnavailableSlots(receivedUnavailableDates);
            console.log('DEBUG: fetchUnavailableDates: Successfully updated unavailable dates:', receivedUnavailableDates);

        } catch (error: unknown) {
            console.error('DEBUG: fetchUnavailableDates: Error encountered during fetch.');
            if (axios.isAxiosError(error)) {
                console.error('Axios Error Details:', error.response?.data || error.message);
                Alert.alert('Error', error.response?.data?.message || 'Failed to load available full days. Please check your network or try again.');
            } else if (error instanceof Error) {
                console.error('General Error Details:', error.message);
                Alert.alert('Error', 'An unexpected error occurred while loading full days. Please try again.');
            } else {
                console.error('Unknown Error Details:', error);
                Alert.alert('Error', 'An unknown error occurred. Please try again.');
            }
            setUnavailableSlots([]);
        } finally {
            console.log('DEBUG: fetchUnavailableDates: Full day fetch process completed.');
            setLoadingSlots(false);
        }
    };

    // Effect hook to fetch amenity details and current user details on component mount
    useEffect(() => {
        const fetchAmenityAndUserDetails = async () => {
            try {
                // Fetch Amenity Details
                const amenityResponse = await axios.get(`${API_URL}/api/v1/amenities/get-amenity`);
                const amenities = amenityResponse.data?.amenities;
                const matchedAmenity = amenities.find((item: Amenity) => item.name === name);
                setAmenity(matchedAmenity || null);

                // Fetch User Details from AsyncStorage and then from backend members list
                const phoneNumber = await AsyncStorage.getItem("userPhone");
                console.log("DEBUG: Phone number from AsyncStorage:", phoneNumber);
                if (phoneNumber) {
                    const membersResponse = await axios.get(`${API_URL}/api/v1/members`);
                    console.log("DEBUG: Members API Response:", membersResponse.data);
                    const members: Member[] = membersResponse?.data?.members || [];
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
                        console.log("DEBUG: Current User State:", currentUser);
                    } else {
                        console.warn("DEBUG: User not found in member list.");
                    }
                } else {
                    console.warn("DEBUG: Phone number not found in AsyncStorage.");
                }
            } catch (error) {
                console.error('DEBUG: Failed to fetch data:', error);
                Alert.alert('Error', 'Failed to load amenity or user details. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchAmenityAndUserDetails();
    }, [name]);

    // Handler for changes in the start date picker
    const handleDateChange = (event: any, date?: Date) => {
        setShowDatePicker(false);
        if (date) {
            setSelectedDate(date);
            setDateSelected(true);
            setSelectedSlots([]);
            setUnavailableSlots([]);
            console.log('DEBUG: Start Date selected via picker:', date.toISOString().split('T')[0]);

            if (bookingMode === 'hourly') {
                setEndDate(date);
                fetchUnavailableSlots(date);
            } else {
                let newEndDate = endDate;
                if (!endDate || endDate < date) {
                    newEndDate = date;
                    console.log('DEBUG: Adjusting end date to new start date:', newEndDate.toISOString().split('T')[0]);
                }
                setEndDate(newEndDate);
                if (newEndDate && date <= newEndDate) {
                    fetchUnavailableDates(date, newEndDate);
                } else if (newEndDate) {
                    fetchUnavailableDates(date, date);
                }
            }
        }
    };

    // Handler for changes in the end date picker
    const handleEndDateChange = (event: any, date?: Date) => {
        setShowEndDatePicker(false);
        if (date) {
            console.log('DEBUG: End Date selected via picker:', date.toISOString().split('T')[0]);
            if (selectedDate && date < selectedDate) {
                Alert.alert('Invalid Date', 'End date cannot be before the start date.');
                return;
            }
            setEndDate(date);
            if (selectedDate) {
                console.log('DEBUG: Calling fetchUnavailableDates from handleEndDateChange.');
                fetchUnavailableDates(selectedDate, date);
            }
        }
    };

    // Toggles selection of an hourly slot
    const toggleSlot = (slot: string) => {
        setSelectedSlots(prev =>
            prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
        );
    };

    // Helper to parse numbers from string or other types
    const parseNumber = (value: any): number => {
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
    };

    // Helper to get all dates within a given range
    const getDatesInRange = (startDate: Date, endDate: Date): string[] => {
        const dates = [];
        let currentDate = new Date(startDate);
        currentDate.setHours(0, 0, 0, 0);
        const endDay = new Date(endDate);
        endDay.setHours(0, 0, 0, 0);

        while (currentDate <= endDay) {
            dates.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    };

    // Handler for the "Book Now" buttons
    const handleBooking = async () => {
        if (!selectedDate) {
            Alert.alert('Validation Error', 'Please select a date.');
            return;
        }

        if (bookingMode === 'hourly' && selectedSlots.length === 0) {
            Alert.alert('Validation Error', 'Please select at least one time slot for hourly booking.');
            return;
        }

        if (bookingMode === 'fullday' && !endDate) {
            Alert.alert('Validation Error', 'Please select an end date for full day booking.');
            return;
        }

        if (!currentUser || !currentUser.name || !currentUser.block || !currentUser.flatNo) {
            Alert.alert('User Data Missing', 'Could not retrieve complete user details. Please try logging in again.');
            return;
        }

        if (bookingMode === 'fullday' && selectedDate && endDate) {
            const datesToBook = getDatesInRange(selectedDate, endDate);
            const unavailableDatesInSelection = datesToBook.filter(date =>
                unavailableSlots.includes(date)
            );

            if (unavailableDatesInSelection.length > 0) {
                Alert.alert(
                    'Booking Conflict',
                    `The following dates are already booked: ${unavailableDatesInSelection.join(', ')}. Please select different dates.`
                );
                return;
            }
        }

        try {
            const bookingDetails = {
                amenityName: name,
                startDate: selectedDate?.toISOString().split('T')[0],
                endDate: bookingMode === 'fullday' ? endDate?.toISOString().split('T')[0] : selectedDate?.toISOString().split('T')[0],
                timeSlots: bookingMode === 'hourly' ? selectedSlots : timeSlots,
                userBlock: currentUser.block,
                userName: currentUser.name,
                userFlat: currentUser.flatNo,
                bookingType: bookingMode,
            };

            const response = await axios.post(`${API_URL}/api/v1/amenities/book-amenity`, bookingDetails);
            Alert.alert('Booking Success', response.data.message || 'Amenity booked successfully');

            setSelectedDate(null);
            setEndDate(null);
            setDateSelected(false);
            setSelectedSlots([]);
            setUnavailableSlots([]);
        } catch (error: any) {
            console.error('Booking error:', error.response?.data || error.message);
            Alert.alert('Booking Failed', error.response?.data?.message || 'Slot may already be booked or there was a server error.');
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading amenity details...</Text>
            </View>
        );
    }

    if (!amenity) {
        return (
            <View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={64} color={colors.textMuted} />
                <Text style={styles.errorText}>No details found for this amenity.</Text>
            </View>
        );
    }

    const advance = parseNumber(amenity.advance);
    const capacity = amenity.capacity || 'N/A';
    const imageUrl = amenity.imageUrl ? { uri: amenity.imageUrl } : null;

    const isDateUnavailable = (date: Date | null) => {
        if (!date || bookingMode !== 'fullday' || !unavailableSlots.length) {
            return false;
        }
        const formattedDate = date.toISOString().split('T')[0];
        return unavailableSlots.includes(formattedDate);
    };

    const selectedDateRangeUnavailableDates = selectedDate && endDate && bookingMode === 'fullday'
        ? getDatesInRange(selectedDate, endDate).filter(date => unavailableSlots.includes(date))
        : [];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Enhanced Header with Gradient */}
            <View style={styles.headerSection}>
                <View style={styles.imageContainer}>
                    {imageUrl ? (
                        <Image source={imageUrl} style={styles.amenityImage} resizeMode="cover" />
                    ) : (
                        <View style={styles.placeholderImage}>
                            <MaterialIcons name="image" size={48} color={colors.white} />
                            <Text style={styles.placeholderText}>No Image Available</Text>
                        </View>
                    )}
                    <View style={styles.overlay} />
                    <View style={styles.headerContent}>
                        <Text style={styles.amenityTitle}>{amenity.name}</Text>
                        <View style={styles.badgeContainer}>
                            <View style={styles.badge}>
                                <MaterialIcons name="people" size={16} color={colors.white} />
                                <Text style={styles.badgeText}>Capacity: {capacity}</Text>
                            </View>
                            {/* <View style={styles.badge}>
                                <MaterialIcons name="payment" size={16} color={colors.white} />
                                <Text style={styles.badgeText}>₹{advance.toFixed(0)}</Text>
                            </View> */}
                        </View>
                    </View>
                </View>
            </View>

            {/* Booking Mode Selection with Enhanced Design */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <MaterialIcons name="schedule" size={24} color={colors.primary} />
                    <Text style={styles.cardTitle}>Booking Mode</Text>
                </View>
                <View style={styles.modeSelector}>
                    <View style={styles.modeOption}>
                        <View style={styles.modeInfo}>
                            <Text style={[styles.modeTitle, bookingMode === 'hourly' && styles.activeModeTitle]}>
                                Hourly Booking
                            </Text>
                            <Text style={styles.modeDescription}></Text>
                        </View>
                    </View>
                    <Switch
                        trackColor={{ false: colors.border, true: colors.primaryLight }}
                        thumbColor={bookingMode === 'fullday' ? colors.primary : colors.white}
                        ios_backgroundColor={colors.border}
                        onValueChange={() => {
                            setBookingMode(prevMode => {
                                const newMode = prevMode === 'hourly' ? 'fullday' : 'hourly';
                                setSelectedDate(null);
                                setEndDate(null);
                                setDateSelected(false);
                                setSelectedSlots([]);
                                setUnavailableSlots([]);
                                return newMode;
                            });
                        }}
                        value={bookingMode === 'fullday'}
                        style={styles.switch}
                    />
                    <View style={styles.modeOption}>
                        <View style={styles.modeInfo}>
                            <Text style={[styles.modeTitle, bookingMode === 'fullday' && styles.activeModeTitle]}>
                                Full Day
                            </Text>
                            <Text style={styles.modeDescription}>7 AM - 11 PM</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Enhanced Date Selection */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <MaterialIcons name="event" size={24} color={colors.primary} />
                    <Text style={styles.cardTitle}>Select Date{bookingMode === 'fullday' ? 's' : ''}</Text>
                </View>

                <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                    <View style={styles.dateButtonContent}>
                        <MaterialIcons name="calendar-today" size={20} color={colors.primary} />
                        <Text style={styles.dateButtonText}>
                            {selectedDate ? selectedDate.toDateString() : 'Select Start Date'}
                        </Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={colors.textMuted} />
                </TouchableOpacity>

                {selectedDate && bookingMode === 'fullday' && isDateUnavailable(selectedDate) && (
                    <View style={styles.warningContainer}>
                        <MaterialIcons name="warning" size={16} color={colors.warning} />
                        <Text style={styles.warningText}>This start date is unavailable</Text>
                    </View>
                )}

                {showDatePicker && (
                    <DateTimePicker
                        value={selectedDate || new Date()}
                        mode="date"
                        display="default"
                        minimumDate={new Date()}
                        onChange={handleDateChange}
                    />
                )}

                {bookingMode === 'fullday' && selectedDate && (
                    <View style={styles.spacer}>
                        <TouchableOpacity style={styles.dateButton} onPress={() => setShowEndDatePicker(true)}>
                            <View style={styles.dateButtonContent}>
                                <MaterialIcons name="event" size={30} color={colors.primary} />
                                <Text style={styles.dateButtonText}>
                                    {endDate ? endDate.toDateString() : 'Select End Date'}
                                </Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color={colors.textMuted} />
                        </TouchableOpacity>

                        {endDate && isDateUnavailable(endDate) && (
                            <View style={styles.warningContainer}>
                                <MaterialIcons name="warning" size={16} color={colors.warning} />
                                <Text style={styles.warningText}>This end date is unavailable</Text>
                            </View>
                        )}
                    </View>
                )}

                {showEndDatePicker && (
                    <DateTimePicker
                        value={endDate || selectedDate || new Date()}
                        mode="date"
                        display="default"
                        minimumDate={selectedDate || new Date()}
                        onChange={handleEndDateChange}
                    />
                )}
            </View>

            {/* Enhanced Time Slot Selection */}
            {dateSelected && bookingMode === 'hourly' && (
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <MaterialIcons name="access-time" size={24} color={colors.primary} />
                        <Text style={styles.cardTitle}>Select Time Slots</Text>
                    </View>

                    {loadingSlots ? (
                        <View style={styles.loadingSection}>
                            <ActivityIndicator size="small" color={colors.primary} />
                            <Text style={styles.loadingSubtext}>Loading available slots...</Text>
                        </View>
                    ) : (
                        <View style={styles.slotsGrid}>
                            {timeSlots.map((slot) => {
                                const isUnavailable = unavailableSlots.includes(slot);
                                const isSelected = selectedSlots.includes(slot);

                                return (
                                    <TouchableOpacity
                                        key={slot}
                                        style={[
                                            styles.slotCard,
                                            isSelected && styles.selectedSlotCard,
                                            isUnavailable && styles.disabledSlotCard,
                                        ]}
                                        onPress={() => !isUnavailable && toggleSlot(slot)}
                                        disabled={isUnavailable}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[
                                            styles.slotText,
                                            isSelected && styles.selectedSlotText,
                                            isUnavailable && styles.disabledSlotText,
                                        ]}>
                                            {slot}
                                        </Text>
                                        {isUnavailable && (
                                            <View style={styles.bookedBadge}>
                                                <Text style={styles.bookedText}>Booked</Text>
                                            </View>
                                        )}
                                        {isSelected && (
                                            <MaterialIcons name="check-circle" size={16} color={colors.white} style={styles.checkIcon} />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}

                    {selectedSlots.length > 0 && (
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryTitle}>Selected Time Slots</Text>
                            <Text style={styles.summaryText}>{selectedSlots.join(', ')}</Text>
                        </View>
                    )}
                </View>
            )}

            {/* Enhanced Full Day Summary */}
            {dateSelected && bookingMode === 'fullday' && selectedDate && endDate && (
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <MaterialIcons name="event-available" size={24} color={colors.primary} />
                        <Text style={styles.cardTitle}>Booking Summary</Text>
                    </View>

                    <View style={styles.summaryDetails}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>From:</Text>
                            <Text style={styles.summaryValue}>{selectedDate.toDateString()}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>To:</Text>
                            <Text style={styles.summaryValue}>{endDate.toDateString()}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Duration:</Text>
                            <Text style={styles.summaryValue}>Full Day (7 AM - 11 PM)</Text>
                        </View>
                    </View>

                    {loadingSlots && (
                        <View style={styles.loadingSection}>
                            <ActivityIndicator size="small" color={colors.primary} />
                            <Text style={styles.loadingSubtext}>Checking availability...</Text>
                        </View>
                    )}
                </View>
            )}

            {/* Enhanced Book Button */}
            {dateSelected && 
                (bookingMode === 'hourly' && selectedSlots.length > 0 ||
                 bookingMode === 'fullday' && endDate && !loadingSlots) && (
                <View style={styles.bookButtonContainer}>
                    <TouchableOpacity style={styles.bookButton} onPress={handleBooking} activeOpacity={0.8}>
                        <MaterialIcons name="event-available" size={24} color={colors.white} />
                        <Text style={styles.bookButtonText}>Book Now</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: colors.textLight,
        fontWeight: '500',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        paddingHorizontal: 32,
    },
    errorText: {
        marginTop: 16,
        fontSize: 18,
        color: colors.textLight,
        textAlign: 'center',
        fontWeight: '500',
    },

    // Header Section
    headerSection: {
        marginBottom: 20,
    },
    imageContainer: {
        position: 'relative',
        height: 220,
        borderRadius: 16,
        overflow: 'hidden',
        marginHorizontal: 16,
        marginTop: 16,
    },
    amenityImage: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        marginTop: 8,
        fontSize: 14,
        color: colors.white,
        fontWeight: '500',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    headerContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
    },
    amenityTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: 10,
    },
    badgeContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    badgeText: {
        fontSize: 12,
        color: colors.white,
        fontWeight: '600',
    },

    // Card Styles
    card: {
        backgroundColor: colors.white,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        padding: 20,
        ...Platform.select({
            ios: {
                shadowColor: colors.text,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
    },

    // Mode Selection Styles
    modeSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.secondary,
        borderRadius: 12,
        padding: 1,
    },
    modeOption: {
        flex: 1,
    },
    modeInfo: {
        alignItems: 'center',
    },
    modeTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textLight,
        marginBottom: 4,
    },
    activeModeTitle: {
        color: colors.primary,
    },
    modeDescription: {
        fontSize: 12,
        color: colors.textMuted,
        textAlign: 'center',
    },
    switch: {
        marginHorizontal: 20,
        transform: Platform.OS === 'ios' ? [{ scaleX: 1.1 }, { scaleY: 1.1 }] : [],
    },

    // Date Selection Styles
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.secondary,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
    },
    dateButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    dateButtonText: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
    },
    spacer: {
        marginTop: 12,
    },
    warningContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
        gap: 8,
    },
    warningText: {
        fontSize: 14,
        color: colors.warning,
        fontWeight: '500',
    },

    // Loading Section
    loadingSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        gap: 12,
    },
    loadingSubtext: {
        fontSize: 14,
        color: colors.textLight,
        fontWeight: '500',
    },

    // Time Slots Grid
    slotsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap:2.6,
        marginTop: 4,
    },
    slotCard: {
        position: 'relative',
        backgroundColor: colors.secondary,
        borderRadius: 8,
        padding: 0,
        minWidth: (screenWidth - 80) / 3,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.border,
        minHeight: 48,
    },
    selectedSlotCard: {
        backgroundColor: colors.primary,
        borderColor: colors.primaryDark,
    },
    disabledSlotCard: {
        backgroundColor: '#F3F4F6',
        borderColor: '#E5E7EB',
        opacity: 0.6,
    },
    slotText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.text,
        textAlign: 'center',
    },
    selectedSlotText: {
        color: colors.white,
    },
    disabledSlotText: {
        color: colors.textMuted,
    },
    bookedBadge: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: colors.danger,
        borderRadius: 4,
        paddingHorizontal: 4,
        paddingVertical: 1,
    },
    bookedText: {
        fontSize: 8,
        color: colors.white,
        fontWeight: '600',
    },
    checkIcon: {
        position: 'absolute',
        top: 2,
        right: 2,
    },

    // Summary Styles
    summaryCard: {
        backgroundColor: colors.secondary,
        borderRadius: 8,
        padding: 16,
        marginTop: 16,
        borderLeftWidth: 2,
        borderLeftColor: colors.primary,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 8,
    },
    summaryText: {
        fontSize: 14,
        color: colors.textLight,
        lineHeight: 20,
    },
    summaryDetails: {
        gap: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    summaryLabel: {
        fontSize: 14,
        color: colors.textLight,
        fontWeight: '500',
    },
    summaryValue: {
        fontSize: 14,
        color: colors.text,
        fontWeight: '600',
    },

    // Book Button Styles
    bookButtonContainer: {
        paddingHorizontal: 16,
        paddingBottom: 32,
        paddingTop: 8,
    },
    bookButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        ...Platform.select({
            ios: {
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    bookButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.white,
    },

    // Additional utility styles for better UX
    unavailableDateOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unavailableDateText: {
        fontSize: 12,
        color: colors.danger,
        fontWeight: '600',
        textAlign: 'center',
    },
    sectionDivider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: 16,
    },
    infoBox: {
        backgroundColor: '#EFF6FF',
        borderRadius: 8,
        padding: 12,
        marginTop: 12,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
    },
    infoText: {
        fontSize: 13,
        color: colors.primary,
        fontWeight: '500',
        lineHeight: 18,
    },
    emptyStateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    emptyStateText: {
        fontSize: 16,
        color: colors.textMuted,
        textAlign: 'center',
        marginTop: 12,
    },
    refreshButton: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginTop: 16,
    },
    refreshButtonText: {
        fontSize: 14,
        color: colors.white,
        fontWeight: '600',
    },
});

export default BookAmenity;