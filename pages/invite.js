import React, { useState, useContext, useEffect } from 'react';
import { Surface, Text, TextInput, Button } from 'react-native-paper';
import tw from 'tailwind-react-native-classnames';
import { StyleSheet, View, FlatList, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppContext from '../utils/app-context';
import { firebase } from '../utils/fb';
 
export default function Tools() {
  const { user, setUser } = useContext(AppContext);
  let [email, setEmail] = useState('');
  let [invites, setInvites] = useState([]);

  async function loadInvites() {
    let { docs } = await firebase
      .firestore()
      .collection('invites')
      .where('patient_email', '==', user.email)
      .get();
    setInvites(docs);
  }

  async function doInvite() {
    // TODO: check if email already invited...,,,
    let { id } = await firebase.firestore().collection('invites').add({
      patient_email: user.email,
      family_email: email,
      puid: user.uid
    });
    setEmail('');
    Alert.alert(
      'Success',
      'Successfully invited ' +
        email +
        '. Please ask your family member to download the app and track your data...'
    );
    let doc = await firebase.firestore().collection('invites').doc(id).get();
    setInvites([...invites, doc]);
  }

  function deleteEntry(id) {
    firebase.firestore().collection('invites').doc(id).delete();
    setInvites(invites.filter((v) => v.id !== id));
  }

  useEffect(() => {
    loadInvites();
  }, []);

  return (
    <View style={tw`p-4 flex-1 bg-white`}>
<Text style={styles.text}>Invite</Text>
      <Text style={tw`text-lg text-gray-500 p-3`}>Enter Caretaker E-mail address:</Text>

      <View style={tw`flex-row items-center`}>
        <TextInput
          value={email}
          placeholder="email"
          onChangeText={setEmail}
          style={{
            flex:1,
          backgroundColor: '#ECF0EF',
          borderRadius: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          marginBottom: 20,
        }}
        />
        <TouchableOpacity style={styles.inviteButton}onPress={doInvite}>
        <Text style={styles.inviteButton}>Invite</Text></TouchableOpacity>
      </View>

      <View style={tw`border-t`}></View>

      <FlatList
        data={invites}
        renderItem={({ item }) => (
          <View style={tw`flex-row items-center`}>
            <Text>
              {item.data().family_email} -{' '}
              <Text style={tw`text-gray-500`}>{item.data().status || "Awaiting..."}</Text>
            </Text>
            <Button onPress={() => deleteEntry(item.id)}>x</Button>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  text: {
    marginTop: 30,
    color: '#16C79A',
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 20,
  },
  inviteButton: {
    backgroundColor: '#16C79A',
    color: 'white',
    borderRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    fontSize: 18,
  },
});
