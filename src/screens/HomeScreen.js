import React, {useEffect, useState} from "react";
import { useDispatch } from "react-redux"
import { useSelector } from 'react-redux';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Text, Button, View, FlatList, ActivityIndicator, Alert, StatusBar, StyleSheet, Platform} from "react-native"
import { login, logout, setExpoToken } from "../redux/slices/userSlice"
import { Auth } from "aws-amplify";
import { API, graphqlOperation, } from 'aws-amplify'
import { createUser } from "../graphql/mutations"
import * as queries from "../graphql/queries"
import { onCreateChatRoomUser } from "../graphql/subscriptions"
import ChatListItem from "../components/ChatListItem";
import tw from "tailwind-react-native-classnames"
import { queryGetUser } from "../graphql/queryGetUser"
import { ScrollView } from "react-native-gesture-handler";



export default function HomeScreen ({ navigation }) {

    const userLoginInfo = {
        id: "",
        name: "",
        username: "",
        email: "",
        expoToken: "",
    }

    const user = useSelector((state) => state.user)
    const [chatRooms, setChatRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        getCurrentUserInfo();
        saveCurrentUserToDatabase();
        fetchChatRooms();
      }, [])

    useEffect(() => {
      const subscription = API.graphql(graphqlOperation(onCreateChatRoomUser, {userID: user.id}))
      .subscribe({
        next: (event) => {
          //setChatRooms([...chatRooms, event.value.data.onCreateChatRoomUser]);
          fetchChatRooms();
          console.log("Subscritpion", event.value.data.onCreateChatRoomUser)
        }
      });
      return () => {
        subscription.unsubscribe();
      };
    },[])

    const getCurrentUserInfo =  async () => {
        try {
          const userInfo = await Auth.currentAuthenticatedUser({bypassCache: true});
          userLoginInfo.id = userInfo.attributes.sub;
          userLoginInfo.username = userInfo.username;
          userLoginInfo.email = userInfo.attributes.email;
          dispatch(login(userLoginInfo));
          //console.log(userLoginInfo);
        }catch( e ) { console.log(e) }
      }

    async function saveCurrentUserToDatabase() {
        const userInfo = await Auth.currentAuthenticatedUser({bypassCache: true});
        if (userInfo)
        {
          try {
              const userID = await API.graphql(graphqlOperation(queries.getUser, {id:userInfo.attributes.sub}));
              if(userID.data.getUser) {
                console.log("user already registrated in database!");
                //console.log(userID);
                return;
              } else {
                const newUser = {
                    id: userInfo.attributes.sub,
                    username: userInfo.username,
                    email: userInfo.attributes.email,
                    expoToken: user.expoToken,
                    status: "Hey there! I am using Underchat... 🚀 🎸"
                }
                await API.graphql(graphqlOperation(createUser, { input: newUser }))
                console.log("user saved correctly")
              }
          }catch (e) {console.log(e, "error fetching users")}
        }
      }
    
    const fetchChatRooms = async () => {
      try {
        setIsLoading(true)
        setRefreshing(true)
        const userInfo = await Auth.currentAuthenticatedUser({bypassCache: true});
        const userID = userInfo.attributes.sub;
        const chatRoomsData = await API.graphql(graphqlOperation(queryGetUser, {id:userID}));
        
        if(chatRoomsData) {
          //console.log(chatRoomsData)
          //console.log(chatRoomsData.data.getUser.chatRoomUser.items);
          setChatRooms(chatRoomsData.data.getUser.chatRoomUser.items);
          //console.log(chatRooms.items);
        } else {
          Alert.alert("no data")
        }
      }catch(e) { console.log("something went wrong", e)}
      setIsLoading(false)
      setRefreshing(false)
    }

    async function sendPushNotification(expoPushToken) {
        const message = {
          to: "ExponentPushToken[eVoP8IN6n9Ubd0mTReLg9S]",
          sound: 'default',
          title: 'New messagge',
          body: 'Underchat is amazing!',
          data: { someData: 'goes here' },
        };
      
        await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        });
      }

    return (
      <View style={{backgroundColor:"#fff"}}>
          {
            chatRooms.length >= 1 ?
                <FlatList
                data={chatRooms}
                renderItem={({item}) => <ChatListItem chatRoom={item.chatRoom}/>}
                keyExtractor={(item) => item.id}
                refreshing={refreshing}
                onRefresh={() => fetchChatRooms()}
                style={{height:"100%"}}
                />  
             : <View style={styles.container}>
                  <Text style={{fontSize:18, color:"gray"}}>You don have any chats yet</Text>
                  {
                  isLoading ? <ActivityIndicator/>
                  : <Button title="load chats" onPress={() => fetchChatRooms()}/>
                  }
               </View>
          }        
      <StatusBar style="auto" />
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
      height:"100%",
      alignItems:"center",
      justifyContent:"center",
      color:"gray"
  },

});
