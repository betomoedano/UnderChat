import React, {useState} from "react";
import {SafeAreaView, ScrollView, Text,Dimensions, TextInput,StyleSheet, View, TouchableOpacity,TouchableWithoutFeedback, Alert,KeyboardAvoidingView, Keyboard, Image, Button, TouchableOpacityBase} from "react-native";
import tw from 'tailwind-react-native-classnames';
import { validateEmail} from "../Validations/validation";
import { Auth } from "aws-amplify";
import { FormStyles } from "../Styles/FormStyles";

const windowWidth= Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function SignUp(props) {
    const [state, setState] = useState({
        email:"",
        password:"",
    });

    const [error, setErrors] = useState({email: ""});

    async function onSubmit() {
        const {email: username, confirmationCode: code} = state;
        const errorEmail = validateEmail(state.email);
        // if(errorEmail) {
        //     setErrors({email: errorEmail});
        // }
        // else {
            try {
                const user = await Auth.confirmSignUp(username, code);
                props.onStateChange("signIn");
            } catch (error) {
                Alert.alert(error.message);
            }
        }
    // }

    if(props.authState === "confirmSignUp")
    return(
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={-170} >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{height:windowHeight, paddingTop:windowHeight/10, width:windowWidth - 30}}>
        <ScrollView style={{paddingTop:windowHeight/4}}>
            <Text style={tw.style("font-bold pb-7",{ fontSize: 34})}>Confirm Sign Up</Text>
            <View style={{marginBottom:.5, height:60,}}>
                <TextInput
                    style={{height:45, borderBottomWidth:1, borderBottomColor:"gray"}}
                    onChangeText={(text) => setState({...state, email: text.toLocaleLowerCase()})}
                    value={state.email}
                    placeholder="username"
                    keyboardType="default"
                    placeholderTextColor="gray"
                />
                <Text style={FormStyles.error}>{error.email}</Text>
            </View>
            <View style={{marginBottom:.5, height:60,}}>
                <TextInput
                    style={{height:45, borderBottomWidth:1, borderBottomColor:"gray"}}
                    onChangeText={(text) => setState({...state, confirmationCode: text})}
                    value={state.code2}
                    placeholder="confirmation code"
                    keyboardType="number-pad"
                    placeholderTextColor="gray"
                />
            </View>
            <TouchableOpacity
                style={FormStyles.button}
                onPress={() => onSubmit()}>
                <Text style={tw.style("text-gray-200 text-lg py-2 text-center font-semibold")}>Confirm</Text>
            </TouchableOpacity>
            <View style={FormStyles.links}>
                <TouchableOpacity
                    onPress={() => props.onStateChange("signIn", {})}
                    accessibilityLabel="back to Sign In">
                    <Text style={{fontSize: 16, color:"#007AFF"}}>back to SignIn</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => props.onStateChange("signUp", {})}
                    accessibilityLabel="back to ">
                    <Text style={{fontSize: 16, color:"#007AFF"}}>back to Sign Up</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
    else return <></>
}
