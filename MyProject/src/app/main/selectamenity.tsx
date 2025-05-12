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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from "@env";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


type Amenity = {
  id: number;
  name: string;
};

const SelectAmenity = () => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation<any>();

  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/get-amenity`);
      const data = await res.json();
      if (data.success && Array.isArray(data.amenities)) {
        setAmenities(data.amenities);
      } else {
        setAmenities([]);
      }
    } catch (error) {
      console.error("Failed to fetch theamenities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAmenityPress = (amenity: Amenity) => {
    navigation.navigate("BookAmenity", { name: amenity.name });
  };

  const getIconName = (amenityName: string) => {
    const name = amenityName.toLowerCase();
    if (name.includes('swim')) return 'pool';
    if (name.includes('badminton')) return 'badminton';
    if (name.includes('tennis')) return 'tennis';
    if (name.includes('gym')) return 'dumbbell';
    if (name.includes('golf')) return 'golf';
    return 'star'; // default icon
  };

  const filteredAmenities = amenities.filter(a =>
    a.name.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <Text style={styles.heading}>Select Amenity</Text>

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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: 40,
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
  },
  iconLabel: {
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
});

export default SelectAmenity;
