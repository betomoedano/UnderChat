import 'react-native-gesture-handler';
import React,{useState, useEffect, useRef, Component} from 'react';
import { StyleSheet, LogBox, Text } from 'react-native';

import awsconfig from "./src/aws-exports"
import Amplify from '@aws-amplify/core';
import { Authenticator, ConfirmSignIn, VerifyContact } from "aws-amplify-react-native"

import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import { Provider, useDispatch } from "react-redux"
import { store } from "./src/redux/store"
import { login, setExpoToken } from "./src/redux/slices/userSlice"

import { NavigationContainer } from '@react-navigation/native';
import Tabs from "./src/screens/Tabs"

import SignUp from "./src/LoginScreens/SignUp"
import SignIn from "./src/LoginScreens/SignIn"
import ConfirmSignUp from "./src/LoginScreens/ConfirmSignUp"
import ForgotPassword from "./src/LoginScreens/ForgotPassword"

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true,
  },
});

LogBox.ignoreAllLogs(['Warning: ...'])

LogBox.ignoreLogs(['Setting a timer']);

function Home(props) {
  if(props.authState === "signedIn")
  return (
    <NavigationContainer>
    <Tabs/>
  </NavigationContainer>
  );
  else return <></>
}

export default function AppWrapper () {
  
  return (
    <Provider store={store}> 
      <App /> 
    </Provider>
  )
}

 function App() {

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const userLoginInfo = {
    id: "",
    name: "",
    username: "",
    email: "",
    expoToken: "",
}

  const dispatch = useDispatch();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);





  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      dispatch(setExpoToken(token));
      console.log(token);
    } else {
      // alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }

    return (
        <Authenticator 
          usernameAttributes="username" 
          hideDefault={true} 
          // onStateChange={(authState) => console.log("authState ...", authState)}
          >
            <Home/>
            <SignUp/>
            <SignIn/>
            <ConfirmSignUp/>
            <ConfirmSignIn/>
            <ForgotPassword/>
            <VerifyContact/>
        </Authenticator>
    );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});



