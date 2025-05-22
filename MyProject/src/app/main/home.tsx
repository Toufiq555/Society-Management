import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@env";

// ✅ TypeScript of Interface for the Member
interface Member {
  phone: string;
  name?: string;
  profilePicture?: string;
  society?: string;
}

// Interface for Ads
interface Ad {
  id: number;
  ImageUrl: string;
  
}

// Feature Grid Icons and Labels - Keeping  the original functionality while updating appearance
const features = [
  { icon: "people-outline", label: "Members", screen: "Members" },
  { icon: "person-outline", label: "Visitors", screen: "Visitors" },
  { icon: "help-outline", label: "Help", screen: "Help" },
  { icon: "credit-card", label: "Payments", lib: "MaterialIcons", screen: "Payment" },
  { icon: "campaign", label: "Notice", lib: "MaterialIcons", screen: "Noticeboard" },
  { icon: "build", label: "Amenities", lib: "MaterialIcons", screen: "SelectAmenity" },
  { icon: "chatbubbles", label: "Discussion", screen: "Discussion" },
  { icon: "help-outline", label: "Ask Society", screen: "AskSociety" },
  { icon: "support-agent", label: "Helpdesk", lib: "MaterialIcons", screen: "Helpdesk" },
];

const IconRenderer = ({ icon, lib }: { icon: string; lib?: string }) => {
  if (lib === "MaterialIcons") {
    return <MaterialIcons name={icon} size={24} color="#2a4365" />;
  }
  return <Ionicons name={icon} size={24} color="#2a4365" />;
};

const Home = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState({
    name: "",
    profilePicture: "https://via.placeholder.com/150",
    society: "",
  });
  const [notices, setNotices] = useState<
    { id: number; title: string; description: string }[]
  >([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [userSocieties, setUserSocieties] = useState<string[]>([]);
  const [showSocietyDropdown, setShowSocietyDropdown] = useState(false);

  useEffect(() => {
    fetchUserDetails();
    fetchNotices();
    fetchAds();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const phoneNumber = await AsyncStorage.getItem("userPhone");
      if (!phoneNumber) return;

      const response = await axios.get(`${API_URL}/api/v1/members`);
      const members: Member[] = response?.data?.members || [];
      const trimmedPhone = phoneNumber.trim();

      // Find the current user
      const currentUser = members.find(
        (m) => m.phone?.trim() === trimmedPhone
      );

      if (currentUser) {
        setUser({
          name: currentUser.name || "No Name",
          profilePicture:
            currentUser.profilePicture || "https://via.placeholder.com/150",
          society: currentUser.society || "Unknown Society",
        });
        
        // Get all societies this user belongs to (assuming a user can be in multiple societies)
        const userMemberships = members.filter(
          (m) => m.phone?.trim() === trimmedPhone && m.society
        );
        
        // Extract unique societies
        const societies = [...new Set(userMemberships.map(m => m.society))].filter(Boolean) as string[];
        
        setUserSocieties(societies.length > 0 ? societies : [currentUser.society || "Unknown Society"]);
      }
    } catch (err) {
      console.error("Failed, to fetch user details:", err);
    }
  };

  const fetchNotices = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/notices/get-notice`);
      const data = await response.json();
      if (data.success && Array.isArray(data.notices)) {
        setNotices(data.notices);
      }
    } catch (err) {
      console.error("Error fetching notices:", err);
    }
  };

  const fetchAds = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/advertisements/get-advertisements`);
      console.log("fetch Ads:", response);
      
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        
        console.log("Ad response data:", data); // Log to inspect the response format
        
        // Check if the response contains 'ads' instead of 'advertisements'
        if (data.success && Array.isArray(data.advertisements) && data.advertisements.length > 0) {
          setAds(data.advertisements);
          return;
        }
      }
  
      console.log("Invalid ad response format or empty ads array");
      setAds([]);  // Set empty array if no valid ads
    } catch (err) {
      console.error("Error fetching ads:", err);
      setAds([]);  // Fallback to the empty ads
    }
  };
  
  
  const changeSociety = async (selectedSociety: string) => {
    try {
      setUser({...user, society: selectedSociety});
      await AsyncStorage.setItem("userSociety", selectedSociety);
      setShowSocietyDropdown(false);
      // Refresh notices or other society-specific data if needed
      fetchNotices();
    } catch (error) {
      console.error("Error changing society:", error);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  const renderNoticesWithAds = () => {
    if (notices.length === 0) {
      return [
        <View style={styles.noticeCard} key="default-notice">
          <View style={styles.noticeHeader}>
            <View style={styles.noticeIconContainer}>
              <FontAwesome5 name="bullhorn" size={18} color="#ffffff" />
            </View>
            <View>
              <Text style={styles.noticeTitle}>Notice</Text>
              <Text style={styles.noticeAdmin}>Admin</Text>
            </View>
          </View>
          <Text style={styles.noticeHeadline}>
            May 2025 labour day no fit out work will be allowed
          </Text>
          <Text style={styles.noticeBody}>
            Dear Residents Greeting for the day May 2025 Labour day no fit out work will be allow in T7 to T10 premises Kindly co operate Regards
          </Text>
        </View>
      ];
    }
  
    const combinedItems: React.JSX.Element[] = [];
    let adIndex = 0;
  
    notices.forEach((notice, index) => {
      // Add notice
      combinedItems.push(
        <View style={styles.noticeCard} key={`notice-${notice.id || index}`}>
          <View style={styles.noticeHeader}>
            <View style={styles.noticeIconContainer}>
              <FontAwesome5 name="bullhorn" size={18} color="#ffffff" />
            </View>
            <View>
              <Text style={styles.noticeTitle}>Notice</Text>
              <Text style={styles.noticeAdmin}>Admin</Text>
            </View>
          </View>
          <Text style={styles.noticeHeadline}>{notice.title}</Text>
          <Text style={styles.noticeBody}>{notice.description}</Text>
        </View>
      );
  
      // After every 2 notices, insert a valid ad
      if ((index + 1) % 2 === 0) {
        // Skip empty ad array or missing ImageUrl
        while (adIndex < ads.length) {
          const ad = ads[adIndex];
          adIndex++;
  
          if (ad && ad.ImageUrl) {
            combinedItems.push(
              <View style={styles.adContainer} key={`ad-${ad.id || adIndex}`}>
                <Image
                  source={{ uri: ad.ImageUrl }}
                  style={styles.adImage}
                  resizeMode="cover"
                  onError={(e) => console.log("Ad image failed to load:", e.nativeEvent.error)}
                />
              </View>
            );
            break; // Only add one ad after every 2 notices
          }
        }
      }
    });
  
    return combinedItems;
  };
  
  return (
    <ScrollView style={styles.container}>
      {/* Header - Updated styling to match image while maintaining original structure */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{user.name || "User"}</Text>
          <TouchableOpacity 
            style={styles.societySelector}
            onPress={() => setShowSocietyDropdown(true)}
          >
            <Text style={styles.subtitle}>{user.society || "Select Society"}</Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
        </View>
      </View>

      {/* Society Selection Modal */}
      <Modal
        visible={showSocietyDropdown}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSocietyDropdown(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSocietyDropdown(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Society</Text>
            {userSocieties.map((society, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.societyOption,
                  society === user.society && styles.selectedSociety
                ]}
                onPress={() => changeSociety(society)}
              >
                <Text 
                  style={[
                    styles.societyOptionText,
                    society === user.society && styles.selectedSocietyText
                  ]}
                >
                  {society}
                </Text>
                {society === user.society && (
                  <MaterialIcons name="check" size={20} color="#244676" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Top Row  of the Features */}
      <View style={styles.topFeatureRow}>
        {features.slice(0, 4).map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.topFeatureItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={styles.iconContainer}>
              <IconRenderer icon={item.icon} lib={item.lib} />
            </View>
            <Text style={styles.featureLabel}>{index === 0 ? "Approve" : item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Promo Banner */}
     

      {/* Middle Feature Grid */}
      <View style={styles.midFeatureGrid}>
        {features.slice(4, 8).map((item, index) => (
          <TouchableOpacity
    key={index}
    style={styles.featureItem}
    onPress={() => navigation.navigate(item.screen)}
  >
    <View style={styles.iconContainer}>
      <IconRenderer icon={item.icon} lib={item.lib} />
    </View>
    <Text style={styles.featureLabel}>{item.label}</Text>
  </TouchableOpacity>
        ))}
      </View>

      {/* Notices with Ads */}
      <View style={styles.noticeContainer}>
        {renderNoticesWithAds()}
      </View>

      {/* Bottom Features */}
      <View style={styles.bottomFeatureRow}>
        {features.slice(-1).map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.bottomFeatureItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={styles.iconContainer}>
              <IconRenderer icon={item.icon} lib={item.lib} />
            </View>
            <Text style={styles.featureLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.bottomFeatureItem}
          onPress={() => navigation.navigate("AskSociety")}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="chatbox-ellipses-outline" size={24} color="#2a4365" />
          </View>
          <Text style={styles.featureLabel}>Ask Society</Text>
        </TouchableOpacity>
      </View>

      {/* Add Button */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa" 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#244676",
    padding: 20,
    paddingVertical: 30,
  },
  title: { 
    color: "white", 
    fontSize: 28, 
    fontWeight: "bold" 
  },
  subtitle: { 
    color: "white", 
    fontSize: 16 
  },
  societySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E15B5B",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#edf2f7",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#244676',
  },
  societyOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  selectedSociety: {
    backgroundColor: '#f0f7ff',
  },
  societyOptionText: {
    fontSize: 16,
    color: '#4a5568',
  },
  selectedSocietyText: {
    fontWeight: 'bold',
    color: '#244676',
  },
  topFeatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#244676",
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  topFeatureItem: { 
    alignItems: "center", 
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    width: "22%",
  },
  midFeatureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "white",
  },
  featureItem: { 
    alignItems: "center", 
    width: "22%",
    marginVertical: 10,
  },
  bottomFeatureRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "white",
    marginTop: 10,
  },
  bottomFeatureItem: { 
    alignItems: "center", 
    width: "45%",
    marginVertical: 10,
  },
  iconContainer: {
    marginBottom: 5,
  },
  featureLabel: { 
    marginTop: 4, 
    color: "#2a4365", 
    fontSize: 12,
    textAlign: "center",
  },
  promoBanner: {
    backgroundColor: "#FFF9C4",
    padding: 15,
  },
  promoText: { 
    color: "#000000", 
    fontWeight: "bold",
    fontSize: 16,
  },
  noticeContainer: { 
    padding: 10,
    backgroundColor: "white",
  },
   noticeCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 15,
  },
  noticeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  noticeIconContainer: {
    backgroundColor: "#244676",
    padding: 10,
    borderRadius: 25,
    marginRight: 10,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#244676",
  },
  noticeAdmin: {
    fontSize: 12,
    color: "#718096",
  },
  noticeHeadline: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
    color: "#2a4365",
  },
  noticeBody: {
    fontSize: 14,
    color: "#4a5568",
  },
  adContainer: {
    marginBottom: 15,
    borderRadius: 8,
    objectFit:"cover",
    elevation: 3,
    backgroundColor: 'red',
  },
  adImage: {
    width: '100%',
    height: 200,
    backgroundColor:"red",
  },
  addButtonContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  addButton: {
    backgroundColor: "#244676",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },

  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingVertical: 10,
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: "center",
  },
  navLabel: {
    fontSize: 12,
    color: "#a0aec0",
    marginTop: 2,
  },
});

export default Home;