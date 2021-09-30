import React, {useEffect, useState} from 'react'
import {SafeAreaView, 
        ActivityIndicator, 
        Dimensions, 
        Keyboard,
        Text, 
        TextInput ,
        Button,
        Share, 
        StyleSheet, 
        View, 
        KeyboardAvoidingView, 
        TouchableWithoutFeedback,
        TouchableOpacity, 
        RefreshControl, 
        Alert, 
        Image, 
        ScrollView} from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createMessage, updateChatRoom } from '../graphql/mutations';
import { useDispatch, useSelector } from "react-redux"
import { API, graphqlOperation, } from 'aws-amplify'
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';




const windowWidth= Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

function TextInputComponent(props) {

    const [messageBody, setMessageBody] = useState("");
    const currentUserInfo = useSelector((state) => state.user)
    const { chatRoomID } = props;
    //console.log(props)


    const updateChatRoomLastMessage = async (messageId) => {
      try {
        await API.graphql(
          graphqlOperation(
            updateChatRoom, {
              input: {
                id: chatRoomID,
                lastMessageID: messageId,
              }
            }
          )
        );
      } catch (e) {
        console.log(e);
      }
    }

    const handleSubmit = async () => {
        //console.log(messageBody)
        if(messageBody === ""){
            return
        }else{
            setMessageBody('');
            const  input = {
                content: messageBody.trim(),
                userID: currentUserInfo.id,
                chatRoomID: chatRoomID
            };
            try {
                const newMessageData = await API.graphql(graphqlOperation(createMessage, { input }))
                await updateChatRoomLastMessage(newMessageData.data.createMessage.id)
                impactAsync('light')
                await sendPushNotification(props.expoToken)
                console.log("message sent with push and saved!")
            } catch (error) {
                console.log("error ", error);
            }
        }
      }

    async function sendPushNotification(expoPushToken) {
        const message = {
          to: props.expoToken,
          sound: 'default',
          title: currentUserInfo.username,
          body: messageBody,
          data: { someData: 'goes here' },
        };
        console.log(props.expoToken)
      
        await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
          categoryIdentifier: "replyMessage",
        });
      }

Notifications.setNotificationCategoryAsync("replyMessage", [
    {
      actionId: 'one',
      buttonTitle: 'Button One',
      isDestructive: true,
      isAuthenticationRequired: false,
    },
    {
      actionId: 'two',
      buttonTitle: 'Button Two',
      isDestructive: false,
      isAuthenticationRequired: true,
    },
    {
      actionId: 'three',
      buttonTitle: 'Three',
      textInput: { submitButtonTitle: 'Three', placeholder: 'Type Something' },
      isAuthenticationRequired: false,
    },
  ], {showTitle: true})

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
            <View style={styles.container}>
                <TextInput 
                    style={styles.containerTextInput}
                    placeholder="Hello, How are you?"
                    placeholderTextColor="gray"
                    scrollEnabled={true}
                    textAlign="left"
                    textAlignVertical="bottom"
                    onChangeText={text => setMessageBody(text)}
                    defaultValue={messageBody}
                    multiline
                />
                    
                <MaterialCommunityIcons 
                    name= "arrow-up-circle" 
                    size= { 40 } 
                    color= { messageBody ? "#2282A9" : "gray" } 
                    style= {{ paddingLeft:5 }}
                    onPress={handleSubmit}
                />                 
            </View>
    )
}

export default TextInputComponent


const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"baseline",  
    },
    containerTextInput: {
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 20,
        minHeight:40,
        maxHeight: "auto",
        width:windowWidth - 70,
        backgroundColor: '#fff',
        paddingHorizontal:15,
        paddingTop:8,
        fontSize:16,
        textAlignVertical:"auto"
    },
  });
  