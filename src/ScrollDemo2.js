import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');
const IMAGE_HEIGHT = height / 3;
const BUTTON_CONTAINER_HEIGHT = 50;

const ScrollDemo2 = () => {
  const [activeList, setActiveList] = useState(1);

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
      console.log(scrollY.value);
    },
  });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(scrollY.value, [0, IMAGE_HEIGHT], [IMAGE_HEIGHT, 0]),
    };
  });

  const stickyButtonContainerStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top:
        scrollY.value > IMAGE_HEIGHT - BUTTON_CONTAINER_HEIGHT - 70 ? 0 : -1000,
      left: 0,
      right: 0,
      zIndex: 1,
    };
  });

  const renderButtons = () => (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={() => setActiveList(1)}>
        <Text>Button 1</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => setActiveList(2)}>
        <Text>Button 2</Text>
      </TouchableOpacity>
    </View>
  );

  const renderList = listNumber => {
    return Array.from({length: 20}, (_, index) => (
      <View key={index} style={styles.listItem}>
        <Text>
          {listNumber === 1 ? `Item A${index + 1}` : `Item B${index + 1}`}
        </Text>
      </View>
    ));
  };
  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.stickyButtonContainer, stickyButtonContainerStyle]}>
        {renderButtons()}
      </Animated.View>
      <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
        <Animated.Image
          source={{uri: 'https://via.placeholder.com/350'}}
          style={[styles.image, imageAnimatedStyle]}
          resizeMode="cover"
        />
        {renderButtons()}
        {activeList && renderList(activeList)}
      </Animated.ScrollView>
    </View>
  );
};

export default ScrollDemo2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    width: width,
    height: IMAGE_HEIGHT,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,

    height: BUTTON_CONTAINER_HEIGHT,
    backgroundColor: 'white',
  },
  stickyButtonContainer: {
    backgroundColor: 'white',
    paddingBottom: 20,
  },
  button: {
    backgroundColor: 'pink',
    padding: 5,
    borderRadius: 10,
    width: 150,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItem: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
