import React, {useState} from "react";
import {SafeAreaView, ScrollView, Text,Dimensions, TextInput, View, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard,TouchableOpacity, Alert} from "react-native";
import tw from 'tailwind-react-native-classnames';
import { validateEmail, validatePassword } from "../Validations/validation";
import { Auth } from "aws-amplify";
import { FormStyles } from "../Styles/FormStyles";
import { setName } from "../redux/slices/userSlice"
import { useDispatch } from "react-redux"


const windowWidth= Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function SignUp(props) {

    const dispatch = useDispatch();

    const [state, setState] = useState({
        username:"",
        email:"",
        password:"",
    });

    const [firstName, setFirstName] = useState("");

    const [error, setErrors] = useState({email: "", password:""});

    async function onSubmit() {
        // dispatch(setName(firstName));
        const errorEmail = validateEmail(state.email);
        const errorPassword = validatePassword(state.password);
        if(errorEmail || errorPassword) {
            setErrors({email: errorEmail, password: errorPassword});
        }
        else {
            try {
                const user = await Auth.signUp({
                    username: state.username,
                    password: state.password,
                    'attributes': {
                        email: state.email,
                      }
                });
                props.onStateChange("confirmSignUp", user)
            } catch (error) {
                Alert.alert(error.message);
            }
        }
    }

    if(props.authState === "signUp")
    return(
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={-170} >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={{height:windowHeight, width:windowWidth - 30}}>
                <ScrollView style={{paddingTop:windowHeight/4}}>
                    <Text style={tw.style("font-bold pb-7",{ fontSize: 34})}>Sign Up</Text>
                    <View style={{marginBottom:.5, height:60,}}>
                        <TextInput
                            style={{height:45, borderBottomWidth:1, borderBottomColor:"gray"}}
                            onChangeText={(text) => setState({...state, username: text.toLocaleLowerCase().trim()})}
                            value={state.username}
                            placeholder="username"
                            keyboardType="default"
                            placeholderTextColor="gray"
                        />
                    </View>
                    {/* <View style={{marginBottom:.5, height:60,}}>
                        <TextInput
                            style={{height:45, borderBottomWidth:1, borderBottomColor:"gray"}}
                            onChangeText={(text) => setFirstName( text.trim())}
                            value={firstName}
                            placeholder="name"
                            keyboardType="default"
                            placeholderTextColor="gray"
                        />
                    </View> */}
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
                    <View style={{marginBottom:.5, height:60,}}>
                        <TextInput
                            style={{height:45, borderBottomWidth:1, borderBottomColor:"gray"}}
                            onChangeText={(text) => setState({...state, password: text})}
                            value={state.password}
                            placeholder="password"
                            keyboardType="default"
                            secureTextEntry={true}
                            placeholderTextColor="gray"
                        />
                        <Text style={FormStyles.error}>{error.password}</Text>
                    </View>
                    <TouchableOpacity
                        style={FormStyles.button}
                        onPress={() => onSubmit()}>
                        <Text style={tw.style("text-gray-100 text-lg py-2 text-center font-semibold")}>Sign Up</Text>
                    </TouchableOpacity>
                    <View style={FormStyles.links}>
                        <TouchableOpacity
                            onPress={() => props.onStateChange("signIn", {})}
                            accessibilityLabel="back to Sign In">
                            <Text style={{fontSize: 16, color:"#007AFF"}}>back to SignIn</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => props.onStateChange("confirmSignUp", {})}
                            accessibilityLabel="back to ">
                            <Text style={{fontSize: 16, color:"#007AFF"}}>confirm code</Text>
                        </TouchableOpacity>
                    </View>
                    </ScrollView>
                </SafeAreaView>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
    else return <></>
}
