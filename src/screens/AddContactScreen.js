import React, { useState }  from "react"
import { SafeAreaView, Text, View, ActivityIndicator, Image, ScrollView, TextInput, TouchableOpacity, Alert} from "react-native";
import tw from "tailwind-react-native-classnames"
import { FormStyles } from "../Styles/FormStyles";
import {API, graphqlOperation} from "aws-amplify"
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations"
import { useSelector } from 'react-redux';
import { useNavigation } from "@react-navigation/core";
import HomeScreen from "./HomeScreen";




const AddContactScreen = (props) => {

    const user = useSelector((state) => state.user)

    const [inputUsername, setInputUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isAlreadyFriend, setIsAlreadyFriend] = useState(false);
    const navigation = useNavigation();


    function getContactUsername(item) {
        return [item.username];
      }
    function getContactID(item) {
        return [item.id]
    }

    const getListOfFriends = async () => {
        try {
            const friends = await API.graphql(graphqlOperation(queries.friendsByUserID, {userID: user.id}))
            console.log(friends.data.friendsByUserID.items)
        }catch (e) {console.log(e)}
    }

    const getContactInfo = async (username) => {
        try {
            setIsLoading(true);
            getListOfFriends();
            const contactInfo = await API.graphql({query: queries.listUsers, variables: {filter:{username:{eq:username}}}});
            if (contactInfo.data.listUsers.items.map(getContactUsername).toString() == user.username) {
                Alert.alert("That's your username 🤔");
                setIsLoading(false);
                return;
            } else if (contactInfo.data.listUsers.items.map(getContactUsername).toString()) {  
                // if Contact exist we create a new chat room!
                const newChatRoomData = await API.graphql({query: mutations.createChatRoom, variables: {input: {lastMessageID: "zz753fca-e8c3-473b-8e85-b14196e84e16"}}});
                console.log(newChatRoomData);
                const newChatRoom = newChatRoomData.data.createChatRoom;
                const contactID = contactInfo.data.listUsers.items.map(getContactID).toString();
                // here we add the contact user to the new chatroom
                await API.graphql({query: mutations.createChatRoomUser, variables: {input: {
                    userID: contactID,
                    chatRoomID: newChatRoom.id
                }}})
                // here we add ourself to the same new chatroom
                await API.graphql({query: mutations.createChatRoomUser, variables: {input: {
                    userID: user.id,
                    chatRoomID: newChatRoom.id
                }}})        
                //console.log(contactInfo.data.listUsers.items.map(getContactUsername).toString())
                Alert.alert("Perfect!", `You can now start chatting with ${inputUsername}`,[{text: "Let's go", onPress: () => {navigation.navigate("Home")}}]);
            } else {
                Alert.alert("We could not found that username. 🤯");
            }
            setIsLoading(false);
        } catch(e) { console.log(e), setIsLoading(false); }
    }

    return (
        <ScrollView style={tw.style("bg-white")}>
        <SafeAreaView style={tw.style("mx-4 mt-10")}>
            <Text style={tw.style("font-bold pb-10", { fontSize: 28})}>New Conversation</Text>
            <View >
                <TextInput
                    style={{height:45, borderWidth:1, borderColor:"#cacaca", borderRadius:10, padding:10, paddingTop:15}}
                    onChangeText={(text) => setInputUsername(text.toLowerCase().trim())}
                    value={inputUsername}
                    placeholder="Username"
                    placeholderTextColor="gray"
                    keyboardType="default"
                    multiline={false}
                    maxLength={100}
                />
            </View>
            <TouchableOpacity
                onPress={() => getContactInfo(inputUsername)}
                style={FormStyles.button}
                >
                {isLoading ?  <ActivityIndicator color="#fafafa"/> :<Text style={tw.style("text-gray-100 text-lg py-2 text-center font-semibold")}>Done</Text>}
            </TouchableOpacity>
        </SafeAreaView>
        </ScrollView>
    );
}

export default AddContactScreen 