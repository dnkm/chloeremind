import React, { useState, useContext } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Surface, Text, Button, TextInput } from 'react-native-paper';
import tw from 'tailwind-react-native-classnames';
import AppContext from '../utils/app-context';
import { firebase } from '../utils/fb';

export default function Welcome({ navigation }) {
  const { user, setUser, setUserData } = useContext(AppContext);

  let [email, setEmail] = useState('mike@test.com');
  let [pw, setPw] = useState('123123');

  let [errMsg, setErrMsg] = useState(undefined);

  function login() {
    setErrMsg(undefined);
    console.log('test');

    firebase
      .auth()
      .signInWithEmailAndPassword(email, pw)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;

        const usersRef = firebase.firestore().collection('users');
        usersRef
          .doc(user.uid)
          .get()
          .then((firestoreDocument) => {
            if (!firestoreDocument.exists) {
              alert('User does not exist anymore.');
              return;
            }
            const userData = firestoreDocument.data();
            console.log('test');

            setUser(user);
            setUserData(userData);
            navigation.navigate('main-tab');
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
    <View style={tw`container p-2 flex-1 justify-start bg-white`}>
      <View style={tw`h-1/3 items-center justify-center`}>
        <Image
          style={{ width: 132, height: 115, backgroundColor: 'white' }}
          source={require('../assets/RemindMe_logo.png')}
        />
      </View>
      <Text style={styles.welcome}>Welcome to RemindMe</Text>
      <TextInput
        style={{
          backgroundColor: '#ECF0EF',
          borderRadius: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          marginBottom: 10,
        }}
        value={email}
        placeholder="E-mail"
        onChangeText={setEmail}
      />
      <TextInput
        style={{
          backgroundColor: '#ECF0EF',
          borderRadius: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          marginBottom: 10,
        }}
        value={pw}
        secureTextEntry
        placeholder="Password"
        onChangeText={setPw}
      />

      <TouchableOpacity style={styles.button} onPress={login}>
        <Text style={styles.button}>Login</Text>
      </TouchableOpacity>

      <View
        style={{
           
          borderBottomColor: '#ECF0EF',
          borderBottomWidth: 3,
          marginBottom: 10,
          marginTop: 10,
          justifyContent: 'center',
        }}></View>

      <TouchableOpacity style={styles.createButton}
        onPress={() => navigation.navigate('setup')}
        >
        <Text style={styles.createText}>Create an account</Text>
      </TouchableOpacity>

      {errMsg && (
        <View>
          <Text>{errMsg}</Text>
        </View>
      )}
    </View>
  );
}
//sign up button -> go to setup page, have them choose patient or family, then ask for email/info, then store all info in firebase
const styles = StyleSheet.create({
  welcome: {
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
  createButton: {
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    
    borderColor: '#16C79A',
    borderWidth: 2,
  },
  createText:{
    color: '#16C79A',
    padding: 10,
    fontSize: 20,
  }
});
