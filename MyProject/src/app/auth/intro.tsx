import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const Intro = () => {
  const [data, setData] = useState([1, 2, 3]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation<any>();

  const textData = [
    'Improve your safety',
    'Enhance your security',
    'Boost your confidence',
  ];

  const handleNext = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleGetStarted = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        horizontal
        onScroll={e => {
          const x = e.nativeEvent.contentOffset.x;
          setCurrentIndex(Math.round(x / width));
        }}
        renderItem={({item, index}) => (
          <View style={styles.slide}>
            <TouchableOpacity disabled={true} style={styles.slideContent} />
          </View>
        )}
      />

      {/* Scroll Indicator */}
      <View style={styles.indicatorContainer}>
        {data.map((item, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentIndex === index && styles.activeIndicator,
            ]}
          />
        ))}
      </View>

      {/* Dynamic Text */}
      <Text style={styles.text}>{textData[currentIndex]}</Text>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          accessibilityLabel="Go to previous slide"
          style={[styles.button, currentIndex === 0 && styles.disabledButton]}
          onPress={handlePrevious}
          disabled={currentIndex === 0}>
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>

        {currentIndex === data.length - 1 ? (
          <TouchableOpacity
            accessibilityLabel="Start the app"
            style={[styles.button, styles.getStartedButton]}
            onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            accessibilityLabel="Go to next slide"
            style={[styles.button, styles.nextButton]}
            onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  slide: {
    width: width,
    height: height / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideContent: {
    width: '90%',
    height: '90%',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'gray',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#2D3748',
  },
  text: {
    alignSelf: 'center',
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.1,
    width: '80%',
  },
  button: {
    backgroundColor: '#2D3748',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  getStartedButton: {
    backgroundColor: '#4CAF50', // Green color for Get Started
  },
  nextButton: {
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Intro;
