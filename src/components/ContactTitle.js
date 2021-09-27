import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { Auth } from "aws-amplify";
import { useNavigation } from "@react-navigation/core";



export default function ContactTitle(props) {

    const navigation = useNavigation();
    const user = useSelector((state) => state.user)

  return (
      <TouchableOpacity>
        <Text onPress={() => navigation.navigate(
            "About", {
                username:props.username, 
                contactEmail:props.contactEmail, 
                contactStatus:props.contactStatus})} 
            style={{fontWeight:"bold", fontSize:18}}>{props.username}</Text>
      </TouchableOpacity>
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
