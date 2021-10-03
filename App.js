import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image, Button } from "react-native";
import Constants from "expo-constants";
import tw from "tailwind-react-native-classnames";
import { Surface, Appbar, Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import Welcome from "./pages/welcome";
import Home from "./pages/home";
import Calendar from "./pages/calendar";
import Login from "./pages/login";
import Setup from "./pages/setup";
import Patient from "./pages/setup/patient";
import Family from "./pages/setup/family";
import Tools from "./pages/tools";
import Invite from "./pages/invite";
import MainTab from "./pages/main-tab";
import AppContext from "./utils/app-context";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();

const NavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "white",
  },
};

export default function App() {
  const [name, setName] = useState(10);
  const [user, setUser] = useState(undefined);
  const [userData, setUserData] = useState(undefined);

  const [index] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("patient-name").then((v) => {
      if (v) setName(v);
      else setName("Guest");
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("@seenWelcome").then((v) => {
      if (v === "true") {
        // console.log("yup");
        setLoading(false);
        setShowWelcome(false);
      } else {
        // console.log("nope");
        setLoading(false);
        setShowWelcome(true);
      }
    });
  }, []);

  function noMoreWelcomePage() {
    AsyncStorage.setItem("@seenWelcome", true);
  }

  if (loading)
    return (
      <Surface style={tw`flex-1 justify-center items-center`}>
        <Text>Loading...</Text>
        <Button title="loading toggle" onPress={() => setLoading((p) => !p)} />
      </Surface>
    );

  return (
    <AppContext.Provider
      value={{ name, setName, user, setUser, userData, setUserData }}
    >
      <NavigationContainer theme={NavTheme}>
        <PaperProvider
          settings={{
            icon: (props) => <Ionicons {...props} />,
          }}
        >
          <View
            style={{
              ...tw`flex-1 bg-white`,
              paddingTop: Constants.statusBarHeight,
            }}
          >
            <Stack.Navigator
              initialRouteName={showWelcome ? "login" : "Home"}
              screenOptions={{
                headerMode: "float"
              }}
            >
              <Stack.Screen
                name="Welcome"
                component={Welcome}
                initialParams={{}}
              />
              <Stack.Screen name="login" component={Login} />
              <Stack.Screen name="patient-setup" component={Patient} />
              <Stack.Screen name="setup" component={Setup} />
              <Stack.Screen name="family-setup" component={Family} />
              <Stack.Screen
                name="main-tab"
                component={MainTab}
                options={{
                  headerShown: false,
                }}
              />

              {/*
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="calendar" component={Calendar} />
              
              <Stack.Screen name="patient-setup" component={Patient} />
              <Stack.Screen name="family-setup" component={Family} />
              <Stack.Screen name="tools" component={Tools} />
              <Stack.Screen name="invite" component={Invite} />
              */}
            </Stack.Navigator>
          </View>
        </PaperProvider>
      </NavigationContainer>
    </AppContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
