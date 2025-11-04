import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

const CountryDetailsScreen = ({ route }) => {
  const { countryName, countryId } = route.params ?? {};

  return (
    <View style={styles.container}>
      <Text style={styles.countryName}>{countryName ?? 'Невідома країна'}</Text>
      {countryId ? <Text style={styles.countryCode}>{countryId}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  countryName: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  countryCode: {
    fontSize: 16,
    color: '#666',
    textTransform: 'uppercase',
  },
});

export default CountryDetailsScreen;
