import React, {useState} from "react";
import {SafeAreaView, ScrollView, Text,Dimensions, TextInput,StyleSheet, View, TouchableOpacity,TouchableWithoutFeedback, Alert,KeyboardAvoidingView, Keyboard, Image, Button, TouchableOpacityBase} from "react-native";
import tw from 'tailwind-react-native-classnames';
import {  validateEmail } from "../Validations/validation";
import { Auth } from "aws-amplify";
import { FormStyles } from "../Styles/FormStyles";

const windowWidth= Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function ForgotPassword(props) {
    const [state, setState] = useState({
        code: "",
        email: "",
        password: "",
    });
  
    const [isSendingCode, setIsSendingCode] = useState(false);

    const [error, setErrors] = useState({});

    async function onSubmit() {
        const errorEmail = validateEmail(state.email);
        if(errorEmail) {
            setErrors({email: errorEmail});
        }
        else {
            try {
                let username = state.email;
                await Auth.forgotPassword(username)
                setIsSendingCode(true);
            } catch (error) {
                Alert.alert("Looks like the email does not exist! 😬");
            }
        }
    }
    async function handleConfirmClick() { 
          
        try {
            const username = state.email
            const code = state.code
            const password = state.password
            //console.log(username, code, password)
            await Auth.forgotPasswordSubmit(username, code, password);
            Alert.alert("Your new password has been changed! 🤫 " + password);
            props.onStateChange("signIn", {});
        } catch (error) {
            setErrors(error.message);
        }
      }
    

    if(props.authState === "forgotPassword"){
        if(!isSendingCode) {
            return(
                <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={-170} >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={{height:windowHeight, paddingTop:windowHeight/10, width:windowWidth - 30}}>
                <ScrollView style={{paddingTop:windowHeight/4}}>
                <Text style={tw.style("font-bold pb-7",{ fontSize: 34})}>Forgot Password?</Text>
                <Text style={tw.style("font-semibold text-gray-500 pb-12",{ fontSize: 17})}>Don't worry, enter your email and we'll send you a code to reset your password</Text>
                <View style={{marginBottom:.5, height:60,}}>
                    <TextInput
                        style={{height:45, borderBottomWidth:1, borderBottomColor:"gray"}}
                        onChangeText={(text) => setState({...state, email: text.toLocaleLowerCase()})}
                        value={state.email}
                        placeholder="email"
                        keyboardType="email-address"
                        placeholderTextColor="gray"
                    />
                    <Text style={FormStyles.error}>{error.email}</Text>
                </View>
                <TouchableOpacity
                    style={FormStyles.button}
                    onPress={() => onSubmit()}>
                    <Text style={tw.style("text-gray-100 text-lg py-2 text-center font-semibold")}>Send</Text>
                </TouchableOpacity>
                <View style={FormStyles.links}>
                    <TouchableOpacity
                        onPress={() => props.onStateChange("signIn", {})}
                        accessibilityLabel="back to ">
                        <Text style={{fontSize: 16, color:"#007AFF"}}>Back to Sign In</Text>
                    </TouchableOpacity>
                </View>
                </ScrollView>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
            );
        } else return(
            <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={-170} >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={{height:windowHeight, paddingTop:windowHeight/10, width:windowWidth - 30}}>
            <ScrollView style={{paddingTop:windowHeight/4}}>
            <Text style={tw.style("font-bold pb-7",{ fontSize: 34})}>Reset Password</Text>
            <View style={{marginBottom:.5, height:60,}}>
                <TextInput
                    style={{height:45, borderBottomWidth:1, borderBottomColor:"gray"}}
                    onChangeText={(text) => setState({...state, code: text})}
                    value={state.code}
                    placeholder="confirmation code"
                    keyboardType="numeric"
                    placeholderTextColor="gray"
                />
            </View>
            <View style={{marginBottom:.5, height:60,}}>
                <TextInput
                    style={{height:45, borderBottomWidth:1, borderBottomColor:"gray"}}
                    onChangeText={(text) => setState({...state, password: text})}
                    value={state.password}
                    placeholder="new password"
                    keyboardType="default"
                    secureTextEntry={true}
                    placeholderTextColor="gray"
                />
                <Text style={FormStyles.error}>{error.password}</Text>
            </View>
            <TouchableOpacity
                style={FormStyles.button}
                onPress={() => handleConfirmClick()}>
                <Text style={tw.style("text-gray-200 text-lg py-2 text-center font-semibold")}>Confirm</Text>
            </TouchableOpacity>
            <View style={FormStyles.links}>
                <TouchableOpacity
                    onPress={() => props.onStateChange("signIn", {})}
                    accessibilityLabel="back to ">
                    <Text style={{fontSize: 16, color:"#007AFF"}}>Back to Sign In</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        );

    }

    else return <></>
}
