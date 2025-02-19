import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';

const MessageCard = ({name, message, time, count, image}: any) => {
  return (
    <TouchableOpacity style={styles.button}>
      <View style={styles.leftContainer}>
        <Image source={image} style={styles.image} />
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.time}>{time}</Text>
        {!!count && (
          <View style={styles.messageCountContainer}>
            <Text style={styles.messageCount}>{count}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

//

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  image: {
    height: 53,
    width: 53,
    borderRadius: 25,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'black',
  },
  message: {
    fontSize: 13,
    color: 'gray',
    fontWeight: '500',
  },
  time: {
    color: 'gray',
    fontWeight: 'bold',
    fontSize: 12,
  },
  messageCountContainer: {
    backgroundColor: 'green',
    width: 22,
    height: 22,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageCount: {
    color: 'white',
    fontSize: 12,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  rightContainer: {
    alignItems: 'flex-end',
    gap: 5,
  },
});
export default MessageCard;
