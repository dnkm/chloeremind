import { View, Text } from 'react-native';
import React, { useState, useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();

import { Ionicons, AntDesign } from '@expo/vector-icons';

import Home from './home';
import Calendar from './calendar';
import Login from './login';
import Setup from './setup';
import Patient from './setup/patient';
import Family from './setup/family';
import Tools from './tools';
import Invite from './invite';

export default function MainTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'tools':
              iconName = 'settings';
              break;
            case 'calendar':
              iconName = 'calendar';
              break;
            case 'invite':
              iconName = 'person-add';
              break;
            default:
              iconName = 'calendar';
              break;
          }

          // if (route.name === 'Home') {
          //   iconName = focused
          //     ? 'ios-information-circle'
          //     : 'ios-information-circle-outline';
          // } else if (route.name === 'Settings') {
          //   iconName = focused ? 'ios-list-box' : 'ios-list';
          // }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#16c79a',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="calendar" component={Calendar} />
      <Tab.Screen name="tools" component={Tools} />
      <Tab.Screen name="invite" component={Invite} />
    </Tab.Navigator>
  );
}
