import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Platform,
  SafeAreaView,
} from 'react-native';
import { API_URL } from '@env';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Notice {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

const NoticeBoard: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotices = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/notices/get-notice`);
      const data = await response.json();

      if (data.success) {
        setNotices(data.notices);
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
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('black');
    }
    StatusBar.setBarStyle('light-content');
  }, []);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
    <StatusBar
    
    backgroundColor="black"
    barStyle="light-content"
  />
  
      <View style={styles.container}>
        <Text style={styles.header}>Notices</Text>
        <FlatList
          data={notices}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <View style={styles.dateTimeRow}>
                <Ionicons name="calendar-outline" size={16} color="#888" />
                <Text style={styles.dateText}>{formatDateTime(item.created_at)}</Text>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    backgroundColor: '#f4f7fb',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'left',
    paddingVertical: 1,
    paddingHorizontal: 16,
    color: '#222',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
  },
  description: {
    fontSize: 15,
    color: '#444',
    marginVertical: 10,
    lineHeight: 20,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NoticeBoard;
