import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Alert, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { Auth } from "aws-amplify";
import { useNavigation } from "@react-navigation/core";



export default function ContactTitle(props) {

    const navigation = useNavigation();
    const user = useSelector((state) => state.user)

  return (
      <TouchableOpacity  onPress={() => navigation.navigate( "About", 
          {
            username:props.username, 
            contactEmail:props.contactEmail, 
            contactStatus:props.contactStatus,
            otherUserImageUrl:props.otherUserImageUrl,
          })} >
        <View style={styles.container}>
        <Image                           
            style={{
                  resizeMode:"cover",
                  marginRight: 10,
                  width: 40,
                  height: 40,
                  borderRadius:100,
                }}
                source={{
                  uri: props.otherUserImageUrl
                }} 
          />
          <Text 

            style={{fontWeight:"bold", fontSize:18,}}>{props.username}
          </Text>

        </View>  
      </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection:"row",
    alignItems:"center",
    marginRight:40,
  },
});
