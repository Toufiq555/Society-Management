import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { API_URL } from '@env';

interface Notice {
  id: string;
  title: string;
  description: string;
  // postBy: string;
  created_at: string;
}

const NoticeBoard: React.FC = () => {
   const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  // const notices: Notice[] = [
  //   {
  //     id: '1',
  //     title: 'Water Supply Maintenance',
  //     description: 'Water supply will be unavailable on 15th May from 9 AM to 5 PM.',
  //     created_at: '2025-05-10',
  //   },
  //   {
  //     id: '2',
  //     title: 'Annual General Meeting',
  //     description: 'The AGM is scheduled for 20th May at 6 PM in the clubhouse.',
  //     created_at: '2025-05-08',
  //   },
  //   {
  //     id: '3',
  //     title: 'Pest Control',
  //     description: 'Pest control service will be conducted on 18th May. Please cooperate.',
  //     created_at: '2025-05-09',
  //   },
  // ];

  //fetch the notice data
  const fetchNotices = async () => {
    try {
      console.log("API",API_URL);
      const response = await fetch(
       `${API_URL}/api/v1/notices/get-notice`,
      );
      console.log("network issue",response);
      const data = await response.json();

      if (data.success) {
        setNotices(data.notices);
        console.log("set notice",data.notices);
      } else {
      
        console.error('Error fetching the notices:', data.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#007aff" style={styles.loader} />
    );
  }

  return (
    <FlatList
      data={notices}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>{item.title}</Text>
            {/* {item.isNew && <Text style={styles.newTag}>New</Text>} */}
          </View>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.footer}>
            Post by : {item.created_at} {/*The  space*/}
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NoticeBoard;
