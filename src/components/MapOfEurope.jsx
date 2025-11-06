import React, { useCallback, useRef } from 'react';

import { Animated, PanResponder, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EuropeMapSvg from '../../assets/EuropeMapSvg';

const MIN_SCALE = 0.8;
const MAX_SCALE = 3;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const distanceBetweenTouches = (touches) => {
  if (touches.length < 2) {
    return 0;
  }

  const [first, second] = touches;
  const dx = first.pageX - second.pageX;
  const dy = first.pageY - second.pageY;

  return Math.sqrt(dx * dx + dy * dy);
};


const MapOfEurope = () => {
  const navigation = useNavigation();
  const translation = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scale = useRef(new Animated.Value(1)).current;

  const isPinching = useRef(false);
  const initialPinchDistance = useRef(null);
  const savedScale = useRef(1);
  const latestScale = useRef(1);

  const accumulatedTranslation = useRef({ x: 0, y: 0 });
  const lastPanPoint = useRef(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => evt.nativeEvent.touches.length >= 2,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { dx, dy, numberActiveTouches } = gestureState;
        return numberActiveTouches >= 2 || Math.abs(dx) > 2 || Math.abs(dy) > 2;
      },
      onPanResponderGrant: (evt) => {
        if (evt.nativeEvent.touches.length >= 2) {
          isPinching.current = true;
          initialPinchDistance.current = distanceBetweenTouches(evt.nativeEvent.touches);
          lastPanPoint.current = null;
        } else {
          isPinching.current = false;
          const touch = evt.nativeEvent.touches[0];

          if (touch) {
            lastPanPoint.current = { x: touch.pageX, y: touch.pageY };
          }
        }
      },
      onPanResponderMove: (evt) => {
        const touches = evt.nativeEvent.touches;

        if (touches.length >= 2) {
          const distance = distanceBetweenTouches(touches);

          if (!initialPinchDistance.current) {
            initialPinchDistance.current = distance;
          }

          if (initialPinchDistance.current) {
            const scaleFactor = distance / initialPinchDistance.current;
            const nextScale = clamp(savedScale.current * scaleFactor, MIN_SCALE, MAX_SCALE);

            scale.setValue(nextScale);
            latestScale.current = nextScale;
          }

          isPinching.current = true;
          lastPanPoint.current = null;
          return;
        }

        if (isPinching.current) {
          savedScale.current = latestScale.current;
          initialPinchDistance.current = null;
          isPinching.current = false;
        }

        const touch = touches[0];

        if (!touch) {
          return;
        }

        if (!lastPanPoint.current) {
          lastPanPoint.current = { x: touch.pageX, y: touch.pageY };
          return;
        }

        const deltaX = touch.pageX - lastPanPoint.current.x;
        const deltaY = touch.pageY - lastPanPoint.current.y;

        accumulatedTranslation.current = {
          x: accumulatedTranslation.current.x + deltaX,
          y: accumulatedTranslation.current.y + deltaY,
        };

        translation.setValue(accumulatedTranslation.current);

        lastPanPoint.current = { x: touch.pageX, y: touch.pageY };
      },
      onPanResponderRelease: () => {
        if (isPinching.current) {
          savedScale.current = latestScale.current;
        }

        initialPinchDistance.current = null;
        isPinching.current = false;
        lastPanPoint.current = null;
      },
      onPanResponderTerminate: () => {
        if (isPinching.current) {
          savedScale.current = latestScale.current;
        }

        initialPinchDistance.current = null;
        isPinching.current = false;
        lastPanPoint.current = null;
      },
    }),
  ).current;

  const handleCountryPress = useCallback(
    (countryName, countryId) => {
      if (!countryName) {
        return;
      }

      navigation.navigate('CountryDetails', {
        countryName,
        countryId,
      });
    },
    [navigation],
  );

  return (
    <View style={styles.container}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.mapWrapper,
          {
            transform: [{ scale }, ...translation.getTranslateTransform()],
          },
        ]}
      >
        <EuropeMapSvg style={styles.map} onCountryPress={handleCountryPress} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  mapWrapper: {
    width: '180%',
    height: '180%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default MapOfEurope;