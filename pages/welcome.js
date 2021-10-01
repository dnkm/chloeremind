import React from 'react';
import { Surface, Text, Button } from 'react-native-paper';
import tw from 'tailwind-react-native-classnames';

import {useContext}  from 'react';
import AppContext  from '../utils/app-context';

export default function Welcome({ navigation }) {

  let {name} = useContext(AppContext);

  return (
    <Surface style={tw`container p-4 bg-pink-100`}>
      <Text>Hello for the first time! - {name}</Text>
      <Text>You are only supposed to see this screen once!</Text>
      <Text>... but that feature is not yet implemented</Text>
      <Text>But nonetheless... enjoy!</Text>
      <Button onPress={() => navigation.navigate('Home')}>→ Go to Setup</Button>
    </Surface>
  );
}
