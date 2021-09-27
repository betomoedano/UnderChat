import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard} from 'react-native';
import { useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/core';
import { API, graphqlOperation, } from 'aws-amplify'
import * as queries from "../graphql/queries"
import ChatMessageComponent from '../components/ChatMessageComponent';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import { onCreateMessage } from "../graphql/subscriptions"
import TextInputComponent from '../components/TextInputComponent';


export default function ChatRoomScreen(props) {

  const user = useSelector((state) => state.user)
  const route = useRoute();
  const [messages, setMessages] = useState([]);
  //console.log(route.params)

  useEffect(() => {
    fetchMessages();
  },[])

  const fetchMessages = async () => {
    const messagesData = await API.graphql(
      graphqlOperation(
        queries.messagesByChatRoom, {
          chatRoomID: route.params.id,
          sortDirection: "DESC",
        }
      )
    )
    console.log("FETCH MESSAGES")
    setMessages(messagesData.data.messagesByChatRoom.items);
  }

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onCreateMessage)
    ).subscribe({
      next: (data) => {
        const newMessage = data.value.data.onCreateMessage;
        //console.log(newMessage, "NEW MESAGGE")
        fetchMessages();
        // setMessages([newMessage, ...messages]);
      }
    });

    return () => subscription.unsubscribe();
  }, [])

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={95}
    style={{flex:1}}
  >
      <View style={{height:'100%', alignItems:"center", backgroundColor:"#f2f2f7"}}>
        <FlatList 
          data={messages}
          renderItem={({item}) => <ChatMessageComponent message = {item}/>}
          style={{marginBottom:50, width:"100%"}}
          inverted
        />
        <View style={{position:"absolute", bottom:4}}>
          <TextInputComponent chatRoomID={route.params.id} expoToken={route.params.expoPushToken} contactName={route.params.contactName}/>
        </View>
        <StatusBar style="auto" />
      </View>
    </KeyboardAvoidingView>
  );
}


