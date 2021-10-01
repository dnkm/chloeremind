import React from 'react';
import moment from 'moment';
import { useState, useEffect } from 'react';
import { Surface, Text, Button } from 'react-native-paper';
import tw from 'tailwind-react-native-classnames';
import Constants from 'expo-constants';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import {
  addMonths,
  addDays,
  getDate,
  endOfMonth,
  getDaysInMonth,
  startOfMonth,
  startOfWeek,
  getMonth,
  getYear,
  format,
} from 'date-fns';
import { fapp } from '../utils/fb';
import { firebase } from '../utils/fb';
import { decode } from 'html-entities';
import { useContext } from 'react';
import AppContext from '../utils/app-context';

export default function Calendar() {
  const [calendar, setCalendar] = useState([]);
  const [value, setValue] = useState(moment());
  const [date, setDate] = useState(null);

  let { user, userData } = useContext(AppContext);
  let [txt, setTxt] = React.useState('');
  let [reminderData, setReminderData] = React.useState([]);
  const reminderRef = firebase.firestore().collection('reminder');

  var daysOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

  const startDay = value.clone().startOf('month').startOf('week');
  const endDay = value.clone().endOf('month').endOf('week');

  useEffect(() => {
    const day = startDay.clone().subtract(1, 'day');
    const a = [];
    while (day.isBefore(endDay, 'day')) {
      a.push(
        Array(7)
          .fill(0)
          .map(() => day.add(1, 'day').clone())
      );
    }
    setCalendar(a);
  }, [value]);

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
      .where('patientId', '==', userData.puid)
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

  function onAdd() {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const newReminderData = {
      reminderTxt: txt,
      patientId: user.uid,
      date: date,
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

  function onDayClick(day) {
    setDate(day.toDate());
    var tomorrow = day.toDate();
    tomorrow.setDate(tomorrow.getDate() + 1);

    reminderRef
      .where('patientId', '==', user.uid)
      .where('date', '>=', day.toDate())
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
  }
  function dateToText(date) {
    if (!date) {
      return '';
    }
    return format(date, 'MMMM do, yyyy');
  }

  return (
    <>
      <View style={{ ...tw`flex-1`, backgroundColor: '#f3f9f8' }}>
        <View style={tw`flex-row justify-center items-center`}>
          <Text style={{
              ...tw`text-gray-500`,
              fontSize: 30,
              margin: 10,
              backgroundColor: '#f3f9f8',
            }}
             onPress={() => setValue(prevMonth())}>
            {decode('&lt;')}
          </Text>

          <Text
            style={{
              ...tw`text-gray-600`,
              fontSize: 20,
              backgroundColor: '#f3f9f8',
            }}>
            {date && format(date, 'MMMM')}
          </Text>

          <Text style={{
              ...tw`text-gray-500`,
              fontSize: 30,
              margin: 10,
              backgroundColor: '#f3f9f8',
            }}
             onPress={() => setValue(nextMonth())}>
            {decode('&gt;')}
          </Text>
        </View>

        <View style={tw`flex-row `}>
          {daysOfWeek.map((item, key) => (
            <View key={key} style={styles.weekCell}>
              <Text>{item}</Text>
            </View>
          ))}
        </View>

        <View style={tw`flex-wrap bg-yellow-400 `}>
          {calendar.map((week) => (
            <View style={cellStyle}>
              {week.map((day) => (
                <TouchableOpacity
                  style={{
                    borderRadius: 15,
                    ...styles.dayCell,
                    backgroundColor: moment(day).isSame(date)
                      ? 'white'
                      : '#f3f9f8',
                    
                  }}
                  onPress={() => onDayClick(day)}>
                  <Text
                    style={{
                      color:
                        moment(day).month() === value.month()
                          ? 'black'
                          : '#DCDFE5',
                    }}>
                    {moment(day).format('D').toString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        <Text style={styles.remindersOn}>Reminders on {dateToText(date)}</Text>
        <View style={{ flexDirection: 'row' }}>
          <TextInput
            defaultValue={txt}
            onChangeText={setTxt}
            style={styles.textInput}
            placeholder="Type reminder here"
          />
          <TouchableOpacity onPress={onAdd} style={styles.add}>
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
                  v.completed
                    ? styles.completedReminder
                    : styles.defaultReminder
                }>
                {v.reminderTxt}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

//if date = today's date
//if today contains reminders
//if all remindesr are completed
//display dark green check
//if not all reminders are completed
//display red dot

//if date > today's date,
//if that day contains reminders
//if all those reminders are completed
//display light green check
//if not all reminders are completed
//display red dot

//if date < today's date,
//if that day contains reminders
//if all those reminders are completed
//display light green check
//if not all reminders are completed
//display red X

const cellStyle = {
  ...tw` flex-row`,
  margin: 0,
  backgroundColor: '#f3f9f8',
  color: '#8b9592',
};
const styles = StyleSheet.create({
  dayCell: {
    width: 0,
    flex: 1,
    height: 50,
    ...tw`justify-center items-center p-4`,
    backgroundColor: '#f3f9f8',
  },
  weekCell: {
    width: 0,
    flex: 1,
    height: 50,
    ...tw` justify-center items-center`,
    backgroundColor: '#f3f9f8',
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
  textInput: {
    flex: 1,
    borderBottomWidth: 1,
    backgroundColor: '#ECF0EF',
    height: 40,
    borderRadius: 10,
    padding:10,
    marginLeft:10 ,
    marginBottom: 10,
  },
  container: {
    padding: 5,
    margin: 2,
    marginBottom:20,
    backgroundColor: '#f3f9f8',
  },
  remindersOn: {
    backgroundColor: '#f3f9f8',
    fontSize: 20,
    padding: 10,
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
    fontSize: 16,
  },
});
