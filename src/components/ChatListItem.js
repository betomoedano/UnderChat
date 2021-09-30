import React, { useState, useEffect }  from "react"
import { SafeAreaView, Text, View, Image, ScrollView, StyleSheet, Platform, TouchableOpacity, Alert, Dimensions} from "react-native";
import tw from "tailwind-react-native-classnames"
import { useDispatch, useSelector } from "react-redux"
import { useNavigation } from "@react-navigation/core";
import ChatRoomScreen from "../screens/ChatRoomScreen";
import { API, graphqlOperation, } from 'aws-amplify'
import { deleteChatRoom } from "../graphql/mutations"
import moment from "moment";
import { AntDesign } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';



const windowWidth= Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

function ChatListItem (props) {

    const { chatRoom } = props;
    const currentUserInfo = useSelector((state) => state.user)
    const user = chatRoom.chatRoomUsers.items[0].user;
    const [otherUser, setOtherUser] = useState(null)
    const navigation = useNavigation();
    //console.log("chat ROOOOM",chatRoom);

    //console.log("USERRRRR  ",user);
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


    useEffect(() => {
        const getOtherUser = async () => {
        //   const userInfo = await Auth.currentAuthenticatedUser();
          if (chatRoom.chatRoomUsers.items[0].user.id === currentUserInfo.id) {
            setOtherUser(chatRoom.chatRoomUsers.items[1].user);
          } else {
            setOtherUser(chatRoom.chatRoomUsers.items[0].user);
          }
        }
        getOtherUser();
        //console.log("other user", otherUser)
      }, [])

    if (!otherUser) {
        return null;
    }

    const onRemoveChatRoom = async () => {
      try {
        //await API.graphql(graphqlOperation(deleteChatRoom, {input: chatRoom.id}))
        Alert.alert("👷🏻‍♂️ 🛠  working on this 👷🏻‍♂️ 🛠")
      } catch (e) {console.log('error deleting chatroom', e)}
    }

    const onPressChat = () => {
      //console.log(chatRoom)
        navigation.navigate("ChatRoomScreen", {id: chatRoom.id, contactName: otherUser.username, expoPushToken: otherUser.expoToken, contactStatus: otherUser.status, contactEmail:otherUser.email});
    }
    return (
            <TouchableOpacity 
            style={{backgroundColor:"#fff"}}
              onPress={onPressChat} 
              onLongPress={()=> {impactAsync("medium") ,Alert.alert("Remove conversation","Are you sure you want to delete this conversation?",
                [
                  {
                    text: "Nope",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  { text: "Yes, I am sure",
                    onPress: () => {onRemoveChatRoom()},
                    style:"destructive"
                  }
                ]
              )
              }}>
                    <View style={{
                        flexDirection:"row", 
                        alignItems:"center",
                        borderBottomWidth:.4,
                        paddingVertical:10, 
                        marginLeft:10,
                        borderColor:"lightgray",                        
                        }}>
                  {otherUser.imageUri ?
                      <Image                           
                        style={{
                              resizeMode:"cover",
                                marginRight: 13,
                                width: 55,
                                height: 55,
                                borderRadius:100,
                            }}
                            source={{
                              uri: otherUser.imageUri
                            }} 
                        />  :
                        <Image                           
                        style={{
                              resizeMode:"cover",
                                marginRight: 13,
                                width: 55,
                                height: 55,
                                borderRadius:100,
                            }}
                            source={require('../../assets/I/Human/person.crop.circle.fill.png')}
                        /> 
                  }

                        <View style={{width:"80%"}}>
                            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                              <Text style={tw.style("text-lg font-semibold text-gray-800")}>{otherUser.username} </Text>    
                              <View style={{flexDirection:"row", alignItems:"center"}}>
                                <Text style={{color:"#929296", paddingRight:5}}>{chatRoom.lastMessage ? moment(chatRoom.lastMessage.updatedAt).format("LT") : ""}</Text> 
                                <AntDesign name="right" size={15} color="#929296" />
                              </View>
                            </View>
                            {/* <Text style={tw.style("text-sm font-semibold text-gray-800")}> {chatRoom.lastMessage.content}</Text>     */}
                            <Text
                              style={{color:"#929296"}}
                              numberOfLines={2}> 
                              {chatRoom.lastMessage ? `${chatRoom.lastMessage.content}` : ""}
                            </Text>
                        </View>
                    </View>  
            </TouchableOpacity>
    );
}

export default ChatListItem 

const styles = StyleSheet.create({

    postContainer: {
      marginHorizontal:10,
      padding:10,
      width:windowWidth * .95
    },
    postContainerLover: {
      backgroundColor:"#fafafa",
      borderWidth:1.8,
      borderColor:"#F8365F25",
      borderRadius:10,
      margin:10,
      padding:10,
      width:windowWidth * .95
    },
  })