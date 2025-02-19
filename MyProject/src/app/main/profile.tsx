import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import imagePaths from '../../constant/imagePaths';

const Profile = () => {
  const navigation = useNavigation<any>();

  const familyData = [
    {
      id: '1',
      name: 'Robert Fox',
      relation: 'Father',
      image: imagePaths.profilepic,
    },
    {
      id: '2',
      name: 'Guy Hawkins',
      relation: 'Mother',
      image: imagePaths.profilepic,
    },
    {
      id: '3',
      name: 'Jenny Wilson',
      relation: 'Wife',
      image: imagePaths.profilepic,
    },
    {
      id: '4',
      name: 'Jenny Wilson',
      relation: 'Wife',
      image: imagePaths.profilepic,
    },
  ];

  const helpData = [
    {
      id: '1',
      name: 'Robert Fox',
      relation: 'Maid',
      image: imagePaths.profilepic,
    },
    {
      id: '2',
      name: 'Guy Hawkins',
      relation: 'Laundry',
      image: imagePaths.profilepic,
    },
    {
      id: '3',
      name: 'Wade Warren',
      relation: 'Milkman',
      image: imagePaths.profilepic,
    },
    {
      id: '4',
      name: 'Wade Warren',
      relation: 'Milkman',
      image: imagePaths.profilepic,
    },
  ];

  const renderItem = ({item}: {item: any}) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.cardImage} />
      <Ionicons
        name="qr-code-outline"
        size={20}
        color="black"
        style={styles.cardScanner}
      />
      <Text style={styles.cardName}>{item.name}</Text>
      <Text style={styles.cardRelation}>{item.relation}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Profile</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Setting')}
        style={styles.icon}>
        <Ionicons name="settings-outline" size={30} color="black" />
      </TouchableOpacity>

      {/* Profile Info */}
      <View style={styles.infoContainer}>
        <View style={styles.upperContainer}>
          <Image source={imagePaths.profilepic} style={styles.profileImage} />
          <View style={styles.headerText}>
            <Text style={styles.name}>Jacob Jones</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Editprofile')}>
              <Text style={styles.viewProfile}>Edit profile</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Ionicons
              name="qr-code-outline"
              size={50}
              color="black"
              style={styles.headerIcons}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.lowerContainer}>
          <View style={styles.infoColumn}>
            <Ionicons name="home-outline" size={24} color="black" />
            <Text style={styles.infoText}>SevenGen</Text>
            <Text style={styles.infoText}>Society</Text>
          </View>
          <View style={styles.infoColumn}>
            <Ionicons name="document-text-outline" size={24} color="black" />
            <Text style={styles.infoText}>Flat no.</Text>
            <Text style={styles.infoValue}>521</Text>
          </View>
          <View style={styles.infoColumn}>
            <Ionicons name="cube-outline" size={24} color="black" />
            <Text style={styles.infoText}>Block no.</Text>
            <Text style={styles.infoValue}>A</Text>
          </View>
          <View style={styles.infoColumn}>
            <Ionicons
              name="share-social-outline"
              size={24}
              color="black"
              style={styles.share}
            />
          </View>
        </View>
      </View>

      {/* Household */}
      <View style={styles.householdContainer}>
        <Text style={styles.household}>Household</Text>
      </View>

      {/* My Family Section */}
      <View style={styles.infoFamily}>
        <View>
          <Text style={styles.title}>Daily Help</Text>
          <Text style={styles.text}>
            Add maid, laundry, helper for quick entry
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addText}>+ Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={familyData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />

      {/* Daily Help Section */}
      <View style={styles.infoFamily}>
        <View>
          <Text style={styles.title}>Daily Help</Text>
          <Text style={styles.text}>
            Add maid, laundry, helper for quick entry
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addText}>+ Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={helpData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    top: 7,
  },
  icon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  infoContainer: {
    height: 190,
    backgroundColor: '#e6f2f2',
    marginTop: 15,
    borderRadius: 15,
    borderWidth: 0.2,
  },
  upperContainer: {
    padding: 10,
    paddingTop: 15,
    paddingBottom: 20,
    borderBottomWidth: 0.2,
    borderStyle: 'dashed',
    flexDirection: 'row',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  headerText: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewProfile: {
    fontSize: 14,
    color: '#aaa',
  },
  lowerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoColumn: {
    alignItems: 'center',
    paddingTop: 15,
    padding: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
  },
  share: {
    paddingTop: 20,
    paddingRight: 15,
  },
  householdContainer: {
    height: 50,
    backgroundColor: 'lightgray',
    marginTop: 20,
  },
  household: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  infoFamily: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 12,
    color: 'grey',
  },
  addButton: {
    width: 60,
    height: 30,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  addText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
  },
  flatListContainer: {
    marginTop: 10,
  },
  card: {
    width: 120,
    height: 130,
    marginRight: 10,
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
  cardImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 10,
  },
  cardScanner: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  cardName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  cardRelation: {
    fontSize: 12,
    color: 'grey',
  },
  headerIcons: {
    marginLeft: 10,
  },
});

export default Profile;
