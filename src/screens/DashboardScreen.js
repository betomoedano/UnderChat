import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button, Image, Dimensions, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { Auth } from "aws-amplify";
import tw from 'tailwind-react-native-classnames';
import ProfilePicture from "../../src/components/ProfilePicture"


export default function DashboardScreen(props) {

  const user = useSelector((state) => state.user)
  //console.log(user.friends)


  const Status = (props) => {
    return (
    <View>
      <Text style={tw.style('text-gray-500 ml-7 mb-1')}>STATUS</Text>
      <View style={styles.statusContainer}>
        <Text style={tw.style('text-gray-700 text-center')}>{props.currentStatus}</Text>
      </View>
    </View>
    )
  }
  const ListOfFriends = () => {
    return (
    <View>
      <Text style={tw.style('text-gray-500 ml-7 mb-1')}>FRIENDS</Text>
      <View style={styles.statusContainer}>
      {
        user.friends.map(friend => <Text key={friend} style={tw.style('text-gray-700 text-left')}> {friend} </Text>)
      }
      </View>
    </View>
    )
  }


  return (
    <ScrollView style={{backgroundColor:"#F2F2F7"}} >
      <ProfilePicture username={user.username} email={user.email} imageUrl={user.imageUrl} userID={user.id}/>
      <Status currentStatus="Hey there! I am using Underchat... 🚀 🎸"/>
      <StatusBar style="auto" />
      <ListOfFriends/>
      <Button 
          onPress={() => {Auth.signOut()}} 
          title="sign Out" 
          color="red"
          accessibilityLabel="back to Sign In">
      </Button>
    </ScrollView>
  );
}


const windowWidth= Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'flex-start',
  },
  containerProfilePicture: {
    width: windowWidth - 20,
    marginHorizontal:10,
    padding:10,
    backgroundColor: '#fff',
    marginBottom:30,
    borderRadius:20,
  },
  statusContainer: {
    width: windowWidth - 20,
    marginHorizontal:10,
    padding:20,
    backgroundColor: '#fff',
    marginBottom:30,
    borderRadius:20,
  }
});
