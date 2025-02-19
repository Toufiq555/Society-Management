import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';

interface Notice {
  id: string;
  title: string;
  description: string;
  postBy: string;
  date: string;
  isNew: boolean;
}

const notices: Notice[] = [
  {
    id: '1',
    title: 'Announcement',
    description:
      'Increasing maintenance to $20 from next month due to security increments',
    postBy: 'Admin',
    date: '19 AUG 05 : 30 PM',
    isNew: true,
  },
  {
    id: '2',
    title: 'New Year celebration',
    description:
      "New year gathering in Seven gen society's hall on 3rd November",
    postBy: 'Admin',
    date: '20 AUG 05 : 30 PM',
    isNew: true,
  },
  {
    id: '3',
    title: 'Christmas party',
    description:
      'It is hereby notified that Christmas will be celebrated on 23rd December, 2018 at our Society auditorium.',
    postBy: 'Admin',
    date: '22 DEC 08 : 30 PM',
    isNew: false,
  },
  {
    id: '4',
    title: 'New Year celebration',
    description:
      "New year gathering in Seven gen society's hall on 3rd November",
    postBy: 'Admin',
    date: '20 AUG 05 : 30 PM',
    isNew: false,
  },

  {
    id: '5',
    title: 'New Year celebration',
    description:
      "New year gathering in Seven gen society's hall on 3rd November",
    postBy: 'Admin',
    date: '20 AUG 05 : 30 PM',
    isNew: false,
  },

  {
    id: '6',
    title: 'New Year celebration',
    description:
      "New year gathering in Seven gen society's hall on 3rd November",
    postBy: 'Admin',
    date: '20 AUG 05 : 30 PM',
    isNew: false,
  },
];

const NoticeBoard: React.FC = () => {
  return (
    <FlatList
      data={notices}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>{item.title}</Text>
            {item.isNew && <Text style={styles.newTag}>New</Text>}
          </View>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.footer}>
            Post by :{item.postBy} {item.date} {/* space*/}
          </Text>
        </View>
      )}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  newTag: {
    fontSize: 12,
    color: '#fff',
    backgroundColor: '#007aff',
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  footer: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 3,
    justifyContent: 'space-between',
  },
});

export default NoticeBoard;
