import React from 'react';
import {View, Text, Image, FlatList, StyleSheet} from 'react-native';

interface Member {
  id: string;
  name: string;
  building: string;
  flatNumber: string;
  society: string;
  profilePicture: string;
}

interface MembersListProps {
  data: Member[];
}

const MembersList: React.FC<MembersListProps> = ({data}) => {
  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <View style={styles.card}>
          <Image
            source={{uri: item.profilePicture}}
            style={styles.profileImage}
          />
          <View style={styles.cardContent}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.details}>
              Building: {item.building}, Flat: {item.flatNumber}
            </Text>
            <Text style={styles.details}>Society: {item.society}</Text>
          </View>
        </View>
      )}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    height: 100,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  details: {
    fontSize: 14,
    color: '#666',
  },
});

export default MembersList;
