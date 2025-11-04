import React, { useCallback, useRef } from 'react';

import { Animated, PanResponder, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EuropeMapSvg from '../../assets/EuropeMapSvg';


const MapOfEurope = () => {
  const navigation = useNavigation();
  const translation = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dx) > 2 || Math.abs(dy) > 2;
      },
      onPanResponderGrant: () => {
        translation.stopAnimation((value) => {
          translation.setOffset({ x: value.x, y: value.y });
          translation.setValue({ x: 0, y: 0 });
        });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: translation.x, dy: translation.y }],
        { useNativeDriver: false },
      ),
      onPanResponderRelease: () => {
        translation.flattenOffset();
      },
      onPanResponderTerminate: () => {
        translation.flattenOffset();
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
        style={[styles.mapWrapper, { transform: translation.getTranslateTransform() }]}
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