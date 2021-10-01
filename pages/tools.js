import React, { useState, useEffect } from 'react';
import { Surface, Text, TextInput, Button } from 'react-native-paper';
import tw from 'tailwind-react-native-classnames';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { useContext } from 'react';
import AppContext from '../utils/app-context';
import { firebase } from '../utils/fb';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Tools() {
  let { user, userData, setUserData } = useContext(AppContext);
  let [hospital, setHospital] = useState(userData.hospital);
  let [medicalInfo, setMedicalInfo] = useState(userData.medicalInfo);
  let [completed, setCompleted] = useState(true);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (userData) setHospital(userData.hospital);
  }, [userData]);

  console.log(userData, userData.hospital);

  const storeData = async ({ hospital }) => {
    try {
      await AsyncStorage.setItem('@storage_Key', { hospital });
    } catch (e) {
      // saving error
    }

    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('@storage_Key');
        if ({ hospital } !== null) {
          // value previously stored
        }
      } catch (e) {
        // error reading value
      }
    };
  };

  async function load() {
    let doc = await firebase
      .firestore()
      .collection('users')
      .doc(userData.puid)
      .get();
    setHospital(doc.data().hospital);
    setHospital(doc.data().medicalInfo);
  }

  function doSubmit() {
    setCompleted(true);
    const medicalData = {
      hospital,
      medicalInfo,
    };

    firebase
      .firestore()
      .collection('users')
      .doc(userData.puid)
      .update(medicalData);
    setUserData({ ...userData, ...medicalData });
  }

  return (
    <View style={tw`bg-white p-4`}>
      <Text style={styles.text}>Tools</Text>
      <Text
        style={{
          ...tw`text-gray-700 font-bold`,
          fontSize: 20,
          marginBottom: 10,
        }}>
        Hello, {userData.name}
      </Text>



      <View
        style={{
          flexDirection: 'row',
          marginBottom: 20,
        }}>
        <Image
          style={{ width: 32, height: 32, backgroundColor: 'white', marginRight: 20,}}
          source={require('../assets/RemindMe_icon_envelope.png')}
        />
        <Text>{user.email}</Text>
      </View>



      

      <View style={{
          flexDirection: 'row',
          marginBottom: 20,
        }}>
        <Image
          style={{ width: 32, height: 32, backgroundColor: 'white', marginRight: 20 }}
          source={require('../assets/RemindMe_icon_plus.png')}
        />
        <Text>Hospital: {userData.hospital}</Text>
      </View>

      {completed ? (
        <>
          
        </>
        ) : (
        <>
          <TextInput
            placeholder="Which hospital do you go to?"
            value={hospital}
            onChangeText={setHospital}
            style={{
              backgroundColor: '#ECF0EF',
              borderRadius: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              marginBottom: 20,
              marginTop: 10,
            }}
          />
          </>
        )}




          <View style={{
          flexDirection: 'row',
          marginBottom: 20,
        }}>
            <Image
              style={{ width: 32, height: 32, backgroundColor: 'white', marginRight: 20 }}
              source={require('../assets/RemindMe_icon_idcard.png')}
            />
            <Text>Medical ID: {medicalInfo}</Text>
          </View>

          {completed ? (
        <>
          
        </>
      ) : (
        <>
         <TextInput
            placeholder="Optional: What is your medical ID?"
            value={medicalInfo}
            onChangeText={setMedicalInfo}
            style={{
              backgroundColor: '#ECF0EF',
              borderRadius: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              marginBottom: 20,
            }}
          />
        </>
      )}


      <TouchableOpacity style={styles.button} onPress={doSubmit}>
        <Text style={styles.button}>Save</Text>
      </TouchableOpacity>

{/*THIS VIEW BELOW IS FOR A WHITE GAP WITH LINE TO SEPARATE SAVE AND EDIT BUTTON (like login page separates login and create account)*/}
      <View
        style={{
          borderBottomColor: '#ECF0EF',
          borderBottomWidth: 3,
          marginBottom: 30,
          marginTop: 30,
          justifyContent: 'center',
        }}/>



      <TouchableOpacity
        style={{
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 20,
          borderColor: '#16C79A',
          borderWidth: 2,
          marginTop: 10,
        }}
        onPress={() => setCompleted(false)}>
        <Text
          style={{
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            color: '#16C79A',
            fontSize: 20,
            padding: 20,
          }}>
          Edit
        </Text>
      </TouchableOpacity>




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
