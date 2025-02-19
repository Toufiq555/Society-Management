import imagePaths from '../../constant/imagePaths';
import React from 'react';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';

const PrivacyPolicy = () => {
  return (
    <View style={styles.container}>
      {/* Logo and Title */}
      <View style={styles.logoContainer}>
        <Image
          source={imagePaths.bg_image} // Replace with your logo path
          style={styles.logo}
        />
        <Text style={styles.title}>SEVENGEN</Text>
        <Text style={styles.subtitle}>Society</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <Text style={styles.paragraph}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eu
          scelerisque neque neque vestibulum augue ed enullakl qui mauris. Ac
          sollicitudin est aliquet neque adipiscing. Leo aliquam, aliquam non
          sit valor feugiat. Morbi felis volutpat eu vestibulum, ornare purus
          atth the puruse. Pretium maecenas in eget sapien odioh.
        </Text>
        <Text style={styles.paragraph}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Imperdiet
          accumsan nec, enim viverra. Interdum massa diam. Pellentesque ornare
          ornare lobortis sit. Ut pulvinar tincidunt amet mi elit rutrum.
          Liberolorem accommod. Egestas vel duis ut a venenatis. Lectuss Lorem
          ipsum dolor sit amet, consectetur adipiscing elit.
        </Text>
        <Text style={styles.paragraph}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Imperdiet
          accumsan nec, enim viverra. Interdum massa diam. Pellentesque ornare
          ornare lobortis sit. Ut pulvinar tincidunt amet mi elit rutrum.
          Liberolorem accommod. Egestas vel duis ut a venenatis. Lectuss Lorem
          ipsum dolor sit amet, consectetur adipiscing elit.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
  },
  content: {
    paddingHorizontal: 20,
  },
  paragraph: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    marginBottom: 15,
  },
});

export default PrivacyPolicy;
