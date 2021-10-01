import React, { useState, useContext } from 'react';
import { Surface, Text, TextInput, Button } from 'react-native-paper';
import tw from 'tailwind-react-native-classnames';
import { StyleSheet, View, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppContext from '../../utils/app-context';
import { firebase } from '../../utils/fb';

export default function FamilySetup({ navigation }) {
  let [name, setName] = useState('');
  const { user, setUser, setUserData } = useContext(AppContext);

  // form states
  let [patientEmail, setPatientEmail] = useState('');
  let [email, setEmail] = useState('');
  let [pw, setPw] = useState('123123');

  let [errMsg, setErrMsg] = useState(undefined);

  async function signup() {
    setErrMsg('Processing...');
    // first check if you have been invited
    let { docs } = await firebase
      .firestore()
      .collection('invites')
      .where('family_email', '==', email)
      .get();

    if (docs.length === 0 || docs[0].data().patient_email !== patientEmail) {
      setErrMsg(
        'Sorry, the patient email address you provided never invited you. Please talk with your patient or make sure the email address was entered correctly'
      );
      return;
    }

    const puid = docs[0].data().puid;
    console.log('puid', puid);

    await firebase.firestore().collection('invites').doc(docs[0].id).update({
      status: 'DONE',
    });

    console.log(2);
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, pw)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        // ...
        const data = {
          email,
          type: 'family',
          puid,
          name,
        };
        const usersRef = firebase.firestore().collection('users');
        usersRef
          .doc(user.uid)
          .set(data)
          .then(() => {
            setUser(user);
            setUserData(data);
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
      <Text style={styles.words}>Caretaker Setup</Text>
<View style={{backgroundColor: 'white', borderRadius: 15, padding: 15, marginBottom:10}}>
<Text style={{...tw `text-gray-600`, fontSize: 18, }}>Patient Information</Text>
      <TextInput
        placeholder="Patient Email"
        value={patientEmail}
        onChangeText={setPatientEmail}
        style={{
          backgroundColor: '#ECF0EF',
          borderRadius: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          marginBottom: 10,
          marginTop: 10,
        }}
      />
</View>

<View style={{backgroundColor: 'white', borderRadius: 15, padding: 15, marginBottom:20}}>
<Text style={{...tw `text-gray-600`, fontSize: 18, }}>Your Information</Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Your first and last name"
        style={{
          backgroundColor: '#ECF0EF',
          borderRadius: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          marginBottom: 10,
          marginTop: 10,
        }}
      />
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Your login E-mail"
        style={{
          backgroundColor: '#ECF0EF',
          borderRadius: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          marginBottom: 10,
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
          marginBottom: 10,
        }}
        
      />
      </View>

      <TouchableOpacity style={styles.button} onPress={signup}>
      <Text style={styles.button}>Sign Up</Text>
      </TouchableOpacity>

      {errMsg && (
        <View>
          <Text style={tw`text-red-700`}>{errMsg}</Text>
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
    marginTop: 10,
    marginBottom:10
  },
  button: {
    backgroundColor: '#16C79A',
    padding: 5,
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    fontSize: 20,
  },
});
