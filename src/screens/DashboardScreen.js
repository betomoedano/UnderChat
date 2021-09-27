import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useSelector } from 'react-redux';
import { Auth } from "aws-amplify";



export default function DashboardScreen(props) {

  const user = useSelector((state) => state.user)

  return (
    <View style={styles.container}>
      <Text>Dashboard</Text>
      <Text>SUB: {user.id}</Text>
      <Text>First Name: {user.name}</Text>
      <Text>Expo Token: {user.expoToken}</Text>
      <Text>Username: {user.username}</Text>
      <Text>Emai: {user.email}</Text>
      <StatusBar style="auto" />
      <Button 
          onPress={() => {Auth.signOut()}} 
          title="sign Out" 
          color="red"
          accessibilityLabel="back to Sign In">
      </Button>
    </View>
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
