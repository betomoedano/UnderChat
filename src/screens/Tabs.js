import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "./HomeScreen"
import DashboardScreen from "./DashboardScreen"
import AddContactScreen from "./AddContactScreen";
import { View, Image, Text,StyleSheet, Dimensions, Alert, Button } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackActions } from "@react-navigation/core";
import tw from "tailwind-react-native-classnames";
import ChatRoomScreen from "./ChatRoomScreen";
import ContactTitle from "../components/ContactTitle";
import ContactInfo from "../screens/ContactInfo"



const width = Dimensions.get("window").width;

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

const getTabBarVisibility = (route) => {
    const routeName = route.state
    ? route.state.routes[route.state.index].name
    : "";
    if(routeName === "ChatRoomScreen") {
        return false;
    } 
    return true;
}

function HomeStackScreen({ navigation }) {
    // let tabBarVisible = true;

    // let routeName = navigation.state.routes[navigation.state.index].routeName;

    // if ( routeName == 'ProductDetails' ) {
    //     tabBarVisible = false
    // }
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} 
        options={({ navigation }) => ({
            headerShown:true,
            title:"Underchat",
            headerStyle: {
                // backgroundColor: '#f5f6f6',
                blurEffect: "light",
            },
            // headerBackTitle: 'Back',
            headerTintColor: '#000',
            headerLargeTitle: true,
            headerTranslucent: Platform.OS === 'ios',
            headerHideShadow: true,
            headerTitleStyle: {},
            headerBlurEffect:"light",
            // headerTitleAlign: 'center',
            // headerSearchBarOptions:true,
            tabBarIcon: ({ focused }) => <MaterialCommunityIcons name="home" size={28} color={focused ? '#4BA8E2' : 'gray'}/>,
            headerRight: () => (
                <Ionicons style={tw.style("pr-5")} name="add" size={30} color='#4BA8E2' onPress={() => navigation.navigate('Contact')}/>
            ),
            })}/>
        <HomeStack.Group screenOptions={{ presentation: 'modal' }}>
            <HomeStack.Screen 
                name="Contact" 
                component={AddContactScreen} 
                options={{
                    title: "New Conversation"
                }}/>
        </HomeStack.Group>
            <HomeStack.Screen
                    name="ChatRoomScreen"
                    component={ChatRoomScreen}
                    options={({ route })  => ({
                        title: route.params.contactName,
                        headerBackTitle:"",
                        headerTitleStyle: {
                            fontWeight:"bold"
                        },
                        headerTitle: () => <ContactTitle username={route.params.contactName} contactEmail={route.params.contactEmail} contactStatus={route.params.contactStatus}/>
                        
                      })}
                      
                />
            <HomeStack.Screen
                name="About"
                component={ContactInfo}
                options={({ route })  => ({
                    headerTitleStyle: {
                        fontWeight:"bold"
                    },  
                    presentation:"formSheet"                 
                    })}
                    
            />

    </HomeStack.Navigator>
  );
}


function Tabs() {
    return (
        <Tab.Navigator 
            initialRouteName="HomeScreen"
        screenOptions={({ route }) => ({
            tabBarStyle:{width:width},
            tabBarActiveTintColor: '#4BA8E2',
            tabBarInactiveTintColor: 'gray',
          })}
        >
            <Tab.Screen 
                name="home" 
                component={HomeStackScreen}
                options={({ navigation }) => ({
                    headerShown:false,
                    headerStyle: {

                    },
                    title:"Chats",
                    tabBarIcon: ({ focused }) => <Ionicons name="chatbubbles" size={28} color={focused ? '#4BA8E2' : 'gray'}/>,
                    headerRight: () => (
                        <Ionicons style={tw.style("pr-5")} name="ios-person-add-sharp" size={28} color='#4BA8E2' onPress={() => navigation.navigate('Contact')}/>
                    ),
                  })}
            />
            <Tab.Screen 
                name="Chat" 
                component={DashboardScreen}
                options={(route) => ({
                    title:"Profile",
                    headerRight: () => (
                        <Button title='Edit'/>
                    ),
                    tabBarIcon:({focused}) => (
                        <Ionicons name="person" size={26} color={focused ? '#4BA8E2' : 'gray'} />
                    ),
                })}
            />
        </Tab.Navigator>
    );
}



export default Tabs;

