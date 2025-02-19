import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';

const Helpdesk = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<'personal' | 'community'>(
    'personal',
  );

  const [personalComplaints, setPersonalComplaints] = useState([
    {id: '1', title: 'Water leakage in my flat.'},
    {id: '2', title: 'Broken light in hallway.'},
  ]);

  const [communityComplaints, setCommunityComplaints] = useState([
    {id: '1', title: 'Community gate not functioning.'},
    {id: '2', title: 'Overflowing garbage bins.'},
  ]);

  const complaints =
    activeTab === 'personal' ? personalComplaints : communityComplaints;

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'personal' && styles.activeTab]}
          onPress={() => setActiveTab('personal')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'personal' && styles.activeTabText,
            ]}>
            Personal
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'community' && styles.activeTab]}
          onPress={() => setActiveTab('community')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'community' && styles.activeTabText,
            ]}>
            Community
          </Text>
        </TouchableOpacity>
      </View>

      {/* Complaints List */}
      <FlatList
        data={complaints}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.complaintItem}>
            <Text style={styles.complaintText}>{item.title}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No complaints found.</Text>
        }
      />

      {/* Raise New Complaint Button */}
      <TouchableOpacity
        style={styles.raiseButton}
        onPress={() =>
          navigation.navigate('Addcomplaint', {
            setPersonalComplaints,
            setCommunityComplaints,
          })
        }>
        <Text style={styles.raiseButtonText}>Raise New Complaint</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTab: {
    borderColor: '#007BFF',
  },
  tabText: {
    fontSize: 16,
    color: '#555',
  },
  activeTabText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  listContainer: {
    flexGrow: 1,
  },
  complaintItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  complaintText: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  raiseButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  raiseButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Helpdesk;
