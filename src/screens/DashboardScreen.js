import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button, Image, Dimensions, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { Auth } from "aws-amplify";
import tw from 'tailwind-react-native-classnames';


export default function DashboardScreen(props) {

  const user = useSelector((state) => state.user)

  const ProfilePicture = () => {
    return (
      <View>
      <Text style={tw.style('text-gray-500 ml-7 mb-1 mt-5')}>INFO</Text>
      <View style={styles.containerProfilePicture}>
        {user.imageUrl ?
        <View style={{alignItems:"center"}}>          
          <Image                           
            style={{
                  resizeMode:"cover",
                    width: 150,
                    height: 150,
                    borderRadius:100,
                }}
                source={{
                  uri: user.imageUrl
                }} 
            />  
            <Text style={tw.style('text-3xl font-bold text-gray-700 ')}>{user.username}</Text>
            <Text style={tw.style('text-xl font-bold text-gray-500 ')}>{user.email}</Text>
        </View>
            :
            <View style={{alignItems:"center"}}>          
            <Image                           
              style={{
                    resizeMode:"cover",
                      width: 150,
                      height: 150,
                      borderRadius:100,
                  }}
                  source={require('../../assets/I/Human/person.crop.circle.fill.png')} 
              />  
              <Text style={tw.style('text-3xl font-bold text-gray-700 ')}>{user.username}</Text>
              <Text style={tw.style('text-xl font-bold text-gray-500 ')}>{user.email}</Text>
          </View>
        }
      </View>
      </View>
    )
  }

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

  return (
    <ScrollView style={{backgroundColor:"#F2F2F7"}} >
      <ProfilePicture/>
      <Status currentStatus="Hey there! I am using Underchat... 🚀 🎸"/>
      <StatusBar style="auto" />
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
