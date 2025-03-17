import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { API_URL } from "@env";

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

  //fetch notice data
  const fetchNotices = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/get-notice`,
      );
      const data = await response.json();

      if (data.success) {
        setNotices(data.notices);
      } else {
        console.error('Error fetching notices:', data.message);
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
            Post by : {item.created_at} {/* space*/}
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
