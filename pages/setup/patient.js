import React, { useState, useContext } from 'react';
import { Surface, Text, TextInput, Button } from 'react-native-paper';
import tw from 'tailwind-react-native-classnames';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppContext from '../../utils/app-context';
import { firebase } from '../../utils/fb';

//like name, make external variable with medical info to store in TOOLS

export default function PatientSetup({ navigation }) {
  const { user, setUser, setUserData } = useContext(AppContext);

  let [name, setName] = useState('');
  let [email, setEmail] = useState('');
  let [pw, setPw] = useState('');

  let [errMsg, setErrMsg] = useState(undefined);

  // async function save() {
  //   await AsyncStorage.setItem('patient-name', name);
  //   console.log('done');
  // }

  function signup() {
    setErrMsg(undefined);
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, pw)
      .then((userCredential) => {
        // Signed in
        let user = userCredential.user;
        // ...
        const data = {
          type: 'patient',
          puid: user.uid,
          name,
        };
        firebase
          .firestore()
          .collection('users')
          .doc(user.uid)
          .set(data)
          .then(() => {
            setUserData(data);
            setUser(user);
            navigation.navigate('Home');
          })
          .catch((error) => {
            alert(error);
          });
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        setErrMsg(errorMessage);
      });
  }

  return (
    <View style={{ ...tw`h-full p-4`, backgroundColor: '#F3F9F8' }}>
      <Text style={styles.words}>Patient Setup</Text>
      <TextInput
        value={name}
        placeholder="Name"
        onChangeText={setName}
        style={{
          backgroundColor: '#ECF0EF',
          borderRadius: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          marginBottom: 20,
          marginTop: 50,
        }}
      />
      <TextInput
        value={email}
        placeholder="E-mail"
        onChangeText={setEmail}
        style={{
          backgroundColor: '#ECF0EF',
          borderRadius: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          marginBottom: 20,
        }}
      />
      <TextInput
        value={pw}
        secureTextEntry
        placeholder="Password"
        onChangeText={setPw}
        style={{
          backgroundColor: '#ECF0EF',
          borderRadius: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          marginBottom: 20,
        }}
      />

      <TouchableOpacity style={styles.button} onPress={signup}>
        <Text style={styles.button}>Sign Up</Text>
      </TouchableOpacity>

      {errMsg && (
        <View>
          <Text>{errMsg}</Text>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  words: {
    color: '#16C79A',
    fontSize: 30,
    textAlign: 'center',
    marginTop: 50,
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
