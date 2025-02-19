import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import imagePaths from '../../constant/imagePaths';

const user = {
  name: 'John Doe',
  profilePicture: 'https://via.placeholder.com/150', // Replace with actual image URL or local asset
  society: "sevenGen'[] Society",
};

const gridData = [
  {title: 'Members', icon: 'people-outline', screen: 'Members'},
  {title: 'Visitors', icon: 'people-sharp', screen: 'Visitors'},
  {title: 'Notice Board', icon: 'newspaper-outline', screen: 'Noticeboard'},
  {title: 'Payment', icon: 'cash-outline', screen: 'Payment'},
  {title: 'Book Amenities', icon: 'calendar-outline', screen: 'Bookamenities'},
  {title: 'Help Desk', icon: 'help-circle-outline', screen: 'Helpdesk'},
];

const Home = () => {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.container}>
      {/*Header Section*/}

      <View style={styles.header}>
        <Image source={imagePaths.profilepic} style={styles.profileImage} />
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.society}>{user.society}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.notificationIcon}
          onPress={() => navigation.navigate('Notification')}>
          <Ionicons name="notifications-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Notice Bar Section */}
      <View style={styles.noticeBar}>
        <Text style={styles.noticeText}>Notice</Text>
      </View>

      {/* Main Content Section */}
      <Text style={styles.communityTitle}>Community Hub</Text>
      <FlatList
        data={gridData}
        numColumns={2}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => navigation.navigate(item.screen)}>
            <Ionicons name={item.icon as any} size={30} color="#fff" />
            <Text style={styles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.title}
        contentContainerStyle={styles.gridLayout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#2c3e50',
    padding: 15,
    borderRadius: 10,
  },

  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  userInfo: {
    marginLeft: 10,
    flex: 1,
  },

  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },

  society: {
    fontSize: 14,
    color: '#bdc3c7',
  },

  notificationIcon: {
    padding: 5,
  },

  noticeBar: {
    backgroundColor: 'white',
    paddingVertical: 100,
    marginBottom: 20,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  noticeText: {
    fontSize: 16,
    color: 'black',
  },

  communityTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },

  gridCard: {
    width: '45%',
    backgroundColor: '#3498db',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardTitle: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },

  gridLayout: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
  },
});

export default Home;
