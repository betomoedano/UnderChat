import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, ActivityIndicator, Platform, Keyboard} from 'react-native';
import { useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/core';
import { API, graphqlOperation, } from 'aws-amplify'
import * as queries from "../graphql/queries"
import ChatMessageComponent from '../components/ChatMessageComponent';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import { onCreateMessage } from "../graphql/subscriptions"
import TextInputComponent from '../components/TextInputComponent';
import * as Haptics from 'expo-haptics';


export default function ChatRoomScreen(props) {

  const user = useSelector((state) => state.user)
  const route = useRoute();
  const [messages, setMessages] = useState([]);
  const [nextToken, setNextToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  //console.log(route.params)

  useEffect(() => {
    fetchMessages();
  },[])

  function getNextToken(item) {
    return [item.nextToken]
}

  const fetchMessagesNextToken = async () => {
    if(nextToken === null){
      setIsLoading(false)
      return
    }
    else if(nextToken) {
      setIsLoading(true)
      impactAsync('medium')
        try {
          const messagesData = await API.graphql(
            graphqlOperation(
              queries.messagesByChatRoom, {
                chatRoomID: route.params.id,
                sortDirection: "DESC",
                limit:15,
                nextToken: nextToken,
              }
            )
          )
          console.log("FETCH NEXT TOKEN")
          setNextToken(messagesData.data.messagesByChatRoom.nextToken.toString())
          setMessages(messages.concat(messagesData.data.messagesByChatRoom.items))
          //console.log(messages);
          setIsLoading(false)
    }catch(e){console.log(e), setIsLoading(false)}
    }else {
      console.log('NO NEXT TOKEN')
      setIsLoading(false)

    }
  }

  const fetchMessages = async () => {
    try {
      const messagesData = await API.graphql(
        graphqlOperation(
          queries.messagesByChatRoom, {
            chatRoomID: route.params.id,
            sortDirection: "DESC",
            limit:15,
          }
        )
      )
      if(messagesData.data.messagesByChatRoom.nextToken) {
        setNextToken(messagesData.data.messagesByChatRoom.nextToken.toString())
      }
      console.log("FETCH MESSAGES")
      setMessages(messagesData.data.messagesByChatRoom.items);
      //console.log(messagesData.data.messagesByChatRoom);
    } catch (e){console.log(e)}

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

  function impactAsync(style) {
    switch (style) {
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      default:
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
    }
  }

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={95}
    style={{flex:1}}
  >
      <View style={{height:'100%', alignItems:"center", backgroundColor:"#f2f2f7"}}>
        {isLoading ? <ActivityIndicator size="small" /> : <Text></Text>}
        <FlatList 
          data={messages}
          renderItem={({item}) => <ChatMessageComponent message = {item}/>}
          style={{marginBottom:50, width:"100%"}}
          inverted
          onEndReached={() => {
            fetchMessagesNextToken()
          }}
          onEndReachedThreshold={0}
        />
        <View style={{position:"absolute", bottom:4}}>
          <TextInputComponent chatRoomID={route.params.id} expoToken={route.params.expoPushToken} contactName={route.params.contactName}/>
        </View>
        <StatusBar style="auto" />
      </View>
    </KeyboardAvoidingView>
  );
}


