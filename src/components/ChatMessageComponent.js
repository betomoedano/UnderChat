import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { useDispatch, useSelector } from "react-redux"
import tw from "tailwind-react-native-classnames"
import moment from 'moment';


const windowWidth= Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;


const ChatMessageComponent = (props) => {
    const { message } = props;
    const currentUserInfo = useSelector((state) => state.user)
    //console.log(message.user.id)

    function changeDate(dateMiliseconds){
        //let formatted_date = dateMiliseconds.slice(11,16);
        return(moment(dateMiliseconds).fromNow())
    }

    const isMyMessage = () => {
        return message.user.id === currentUserInfo.id;
    }
    return (
        <View style={{marginBottom:10}}>
            <View style={isMyMessage() ? styles.messageMe : styles.message}>
                <Text style={isMyMessage() ? {fontSize:16, color:"#000"} : {fontSize:16, color:"#fff", } }>{message.content}</Text>
                {/* <Text style={isMyMessage() ? tw.style("text-base text-gray-800 font-normal") : tw.style("text-base text-gray-100 font-normal")}>{message.user.username}</Text> */}
                {/* <Text style={isMyMessage() ? tw.style("text-xs text-gray-500") : tw.style("text-xs text-gray-200 text-right")}>{changeDate(message.createdAt)}</Text> */}
            </View>
            <View style={isMyMessage() ? styles.createdAt : styles.meCreatedAt}>
                <Text style={isMyMessage() ? {fontSize:12, color:"gray"} : {fontSize:12, color:"gray"}}>{changeDate(message.createdAt)}</Text>
            </View>

        </View>
        
    )
}

export default ChatMessageComponent

const styles = StyleSheet.create({
    message:{
        maxWidth: windowWidth * .8,
        alignSelf:"flex-start",
        borderRadius:12,
        paddingHorizontal:10,
        paddingVertical:5,
        backgroundColor:"#2282A9",
        marginHorizontal:5,
        borderBottomStartRadius:0,
        paddingVertical:10
      },
      messageMe:{
        maxWidth: windowWidth * .8,
        alignSelf:"flex-end",
        borderRadius:12,
        borderBottomEndRadius:0,
        paddingHorizontal:10,
        backgroundColor:"#fff",
        marginHorizontal:5,
        paddingVertical:10
      },
      meCreatedAt:{
        maxWidth: windowWidth * .8,
        alignSelf:"flex-start",
        paddingHorizontal:10,
        paddingVertical:2,
        marginHorizontal:5,
      },
      createdAt:{
        maxWidth: windowWidth * .8,
        alignSelf:"flex-end",
        marginVertical:5,
        paddingHorizontal:10,
        marginHorizontal:5
      },
  });
  