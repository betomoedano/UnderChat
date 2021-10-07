import React, {useEffect, useState} from "react";
import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Text, Button, View, FlatList, ActivityIndicator, Alert, StyleSheet, Platform} from "react-native"
import { login, setFriends, setImageUrl} from "../redux/slices/userSlice";
import { Auth } from "aws-amplify";
import { API, graphqlOperation, } from 'aws-amplify'
import { createUser } from "../graphql/mutations";
import * as queries from "../graphql/queries";
import { onCreateChatRoomUser } from "../graphql/subscriptions";
import ChatListItem from "../components/ChatListItem";
import tw from "tailwind-react-native-classnames";
import { queryGetUser } from "../graphql/queryGetUser";
import { ScrollView } from "react-native-gesture-handler";
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';



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
          //console.log("Subscritpion", event.value.data.onCreateChatRoomUser)
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

      function getCatPhoto(item) {
        return [item.url];
      }

    async function saveCurrentUserToDatabase() {
        const userInfo = await Auth.currentAuthenticatedUser({bypassCache: true});
        if (userInfo)
        {
          try {
              const userID = await API.graphql(graphqlOperation(queries.getUser, {id:userInfo.attributes.sub}));
              if(userID.data.getUser) {
                console.log("user already registrated in database!");
                dispatch(setImageUrl(userID.data.getUser.imageUri));
                dispatch(setFriends(userID.data.getUser.friends));
                return;
              } else {
                try {
                  axios.defaults.headers.common['x-api-key'] = "fd993a21-5988-4c94-b9ea-c16653f02645" 
                  let response = await axios.get('https://api.thecatapi.com/v1/images/search', { params: { limit:1, size:"small" } });
                    console.log(response.data[0].url)
                    dispatch(setImageUrl(response.data[0].url));
                    // setRandomUrl(response.data.map(getCatPhoto)[0].toString());
                    // console.log('foto', response.data.map(getCatPhoto)[0].toString())
                const newUser = {
                    id: userInfo.attributes.sub,
                    username: userInfo.username,
                    email: userInfo.attributes.email,
                    expoToken: user.expoToken,
                    status: "Hey there! I am using Underchat... 🚀 🎸",
                    friends: [],
                    imageUri: response.data[0].url ? response.data[0].url : "",
                }
                await API.graphql(graphqlOperation(createUser, { input: newUser }))
                console.log("user saved correctly")
              }catch (e) {console.log(e)}
              }
          }catch (e) {console.log(e, "error fetching users")}
        }
      }
    
      function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    const fetchChatRooms = async () => {
      try {
        setIsLoading(true)
        setRefreshing(true)
        const userInfo = await Auth.currentAuthenticatedUser({bypassCache: true});
        const userID = userInfo.attributes.sub;
        const chatRoomsData = await API.graphql(graphqlOperation(queryGetUser, {id:userID}));
        // console.log(chatRoomsData);
        if(isEmpty(chatRoomsData)) {
          //console.log(chatRoomsData)
          //console.log(chatRoomsData.data.getUser.chatRoomUser.items);
          //console.log(chatRooms.items);
          Alert.alert("you don't have conversations!")
        } else {
          setChatRooms(chatRoomsData.data.getUser.chatRoomUser.items);
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
              <StatusBar style="auto" />
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
