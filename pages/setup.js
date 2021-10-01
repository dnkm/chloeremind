import React from 'react';
import { Surface, Text, Button, TextInput } from 'react-native-paper';
import tw from 'tailwind-react-native-classnames';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import NavBar from '../components/nav-bar';

export default function Setup({ navigation }) {
  return (
    <View style={tw`h-full bg-white p-4`}>
      <View style={styles.question}>
        <Image
          style={{ width: 99, height: 156, backgroundColor: 'white' }}
          source={require('../assets/RemindMe_question_mark.png')}
        />
      </View>
      <Text style={styles.who}>Who are you?</Text>

      <TouchableOpacity
        style={{
    backgroundColor: '#16C79A',
    padding: 10,
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    fontSize: 20,
    marginTop:10,
  }}
        onPress={() => navigation.navigate('patient-setup')}>
        <Text style={styles.button}>Patient Setup</Text>
      </TouchableOpacity>

      <View
        style={{
          borderBottomColor: '#ECF0EF',
          borderBottomWidth: 3,
          marginBottom: 30,
          marginTop: 30,
          justifyContent: 'center',
        }}></View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('family-setup')}>
        <Text style={styles.button}>Family Setup</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  question: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },

  who: {
    color: '#16C79A',
    fontSize: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#16C79A',
    padding: 10,
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    fontSize: 20,
  },
});
