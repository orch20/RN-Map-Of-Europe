import 'react-native-gesture-handler';

import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CountryDetailsScreen from './src/components/CountryDetailsScreen';
import MapOfEurope from './src/components/MapOfEurope';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Map">
        <Stack.Screen
          name="Map"
          component={MapOfEurope}
          options={{ title: 'Карта Європи' }}
        />
        <Stack.Screen
          name="CountryDetails"
          component={CountryDetailsScreen}
          options={({ route }) => ({
            title: route.params?.countryName ?? 'Деталі країни',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


