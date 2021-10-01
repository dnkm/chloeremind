import {
  format
} from 'date-fns';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import {
  Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import AppContext from '../utils/app-context';
import { firebase } from '../utils/fb';

export default function Home({ navigation }) {
  let { user, userData } = useContext(AppContext);
  const [value, setValue] = useState(moment());
  const [date, setDate] = useState(null);

  let [reminderData, setReminderData] = React.useState([]);
  let [txt, setTxt] = React.useState('');
  const reminderRef = firebase.firestore().collection('reminder');
  let today = new Date();

  function currMonthName() {
    return value.format('MMM');
  }

  function currYear() {
    return value.format('YYYY');
  }

  function prevMonth() {
    return value.clone().subtract(1, 'month');
  }

  function nextMonth() {
    return value.clone().add(1, 'month');
  }
  useEffect(() => {
    const timestamp = new Date();
    timestamp.setHours(0);
    timestamp.setMinutes(0);
    timestamp.setSeconds(0);
    timestamp.setMilliseconds(0);
    setDate(timestamp);
    var tomorrow = new Date(timestamp.getTime());
    tomorrow.setDate(tomorrow.getDate() + 1);

    reminderRef
      .where('patientId', '==', user.uid)
      .where('date', '>=', timestamp)
      .where('date', '<=', tomorrow)
      .orderBy('date', 'desc')
      .onSnapshot(
        (querySnapshot) => {
          console.log(querySnapshot);
          const newEntities = [];
          querySnapshot.forEach((doc) => {
            const entity = {
              reminderId: doc.id,
              reminderTxt: doc.data().reminderTxt,
              completed: doc.data().completed,
            };

            newEntities.push(entity);
          });
          setReminderData(newEntities);
        },
        (error) => {
          console.log(error);
        }
      );
  }, []);
  function dateToText(date) {
    if (!date) {
      return '';
    }
    return format(date, 'MMMM do, yyyy');
  }

  function onAdd() {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const newReminderData = {
      reminderTxt: txt,
      patientId: user.uid,
      date: new Date(),
      createdAt: timestamp,
      completed: false,
      completedAt: null,
    };
    const reminderAdd = reminderRef.add(newReminderData);
    reminderAdd
      .then((_doc) => {
        setTxt('');
        Keyboard.dismiss();
      })
      .catch((error) => {
        alert(error);
      });
    setReminderData([
      ...reminderData,
      { reminderId: reminderAdd.id, reminderTxt: txt, completed: false },
    ]);
    setTxt('');
  }

  function onComplete(index) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    reminderRef
      .doc(reminderData[index].reminderId)
      .update({ completed: true, completedAt: timestamp })
      .catch();
    reminderData[index].completed = true;
    //setData(data.filter((v, i) => i !== index));
    //v.completed ? styles.completed:styles.Button
  }

  return (
    <>
      <View style={styles.hi}>
        <Text style={tw`text-white font-bold`}>
          Hello, {userData.name}!
        </Text>
      </View>

      <Text style={tw`text-lg text-gray-500 p-3`}>Reminders Today</Text>
      <Text style={tw`text-2xl font-bold text-gray-700 p-3`}>
        {dateToText(date)}
      </Text>
      <View style={{ flexDirection: 'row', borderColor: 'transparent' }}>
        <TextInput
          defaultValue={txt}
          onChangeText={setTxt}
          style={styles.textInput}
          placeholder="Type reminder here"
        />

        <TouchableOpacity style={styles.add} onPress={onAdd}>
          <Text style={styles.add}>ADD</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>
        {reminderData.map((v, i) => (
          <TouchableOpacity
            onPress={() => onComplete(i)}
            style={styles.reminderButton}>
            <Text
              style={
                v.completed ? styles.completedReminder : styles.defaultReminder
              }>
              {v.reminderTxt}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}>
        <Button
          title="View Calendar"
          onPress={() => navigation.navigate('calendar')}></Button>

        <Button
          title="Tools"
          onPress={() => navigation.navigate('tools')}></Button>
        <Button
          title="Invite Caretakers"
          onPress={() => navigation.navigate('invite')}></Button>
      </View>
      */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    borderBottomWidth: 1,
    backgroundColor: '#ECF0EF',
    height: 40,
    marginLeft: 10,
    borderRadius: 10,
    padding: 5,
  },
  completedReminder: {
    color: 'lightgray',
    fontStyle: 'italic',
    flex: 1,
    fontSize: 18,
  },
  defaultReminder: {
    flex: 1,
    color: 'blue',
    fontSize: 18,
  },
  reminderButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 7,
  },
  hi: {
    backgroundColor: '#16C79A',
    padding: 20,
    fontSize: 30,
    borderRadius: 20,
    margin: 10,
  },
  add: {
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
