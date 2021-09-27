import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as queries from "../graphql/queries"
import { API, graphqlOperation, } from 'aws-amplify'
import { useRoute } from '@react-navigation/core';


export default function ContactInfo(props) {
  const route = useRoute();

console.log(props)
  return (
    <View style={styles.container}>
      <Text>{route.params.username}</Text>
      <Text>{route.params.contactEmail}</Text>
      <Text>{route.params.contactStatus}</Text>
      <StatusBar style="auto"/>
      
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
