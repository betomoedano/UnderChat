import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button, Image, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/core';
import tw from "tailwind-react-native-classnames";


export default function ContactInfo(props) {
  const route = useRoute();

//console.log(props)
  return (
    <View style={{height:"100%", backgroundColor:"#fff"}}>  
      <StatusBar style="light" />    
      <View style={ styles.container}> 
        <Image                           
          style={{
                resizeMode:"cover",
                width: 320,
                height: 320,
                borderRadius: 200,
                marginBottom: 10,
                borderWidth: 5,
                borderColor: "#D6D5D5",  
              }}
              source={{
                uri: route.params.otherUserImageUrl
              }} 
        />        
      </View>
      <View style={styles.infoContainer}>
        <Text style={tw.style('text-gray-500 mb-1 text-xs')}>INFO</Text>
        <Text style={tw.style("text-3xl font-bold text-gray-800")}>{route.params.username}</Text>
        <Text style={tw.style("text-lg font-bold mb-5 text-gray-500")}>{route.params.contactEmail}</Text>
        <Text style={tw.style('text-gray-500 mb-1 text-xs')}>STATUS</Text>
        <View >
        <Text>{route.params.contactStatus}</Text>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  infoContainer: {
    margin:30,
  },
  container: {
    alignItems: 'center',
    justifyContent: "flex-start",
    marginTop:30,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 10,  
  },
  statusContainer: {
    borderWidth:.4,
    borderColor: "#00000070",
    padding: 10,
    borderRadius: 10
  }
});
