import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import {
  Surface,
  Text,
  Appbar,
  Provider as PaperProvider,
} from 'react-native-paper';
import tw from 'tailwind-react-native-classnames';

export default function NavBar() {
  const navigation = useNavigation();

  return (
    <Appbar style={{...tw`absolute left-0 right-0 bottom-0 z-50`}}>
      <Appbar.Action
        icon="Home"
        onPress={() => {
          console.log("link")
          /*navigation.navigate("Home")*/
        }}
      />
    </Appbar>
  );
}
