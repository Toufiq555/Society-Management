import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React from 'react';

const Terms = () => {
  return (
    <View>
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
export default Terms;
