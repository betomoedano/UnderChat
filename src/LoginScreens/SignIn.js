import React, {useState, useEffect} from "react";
import {
    SafeAreaView, 
    ScrollView, 
    ActivityIndicator, 
    Text,
    Dimensions, 
    TextInput,
    StyleSheet, 
    View, 
    TouchableOpacity,
    TouchableWithoutFeedback, 
    Alert,KeyboardAvoidingView, 
    Keyboard, 
    Image, 
    Platform,
    Button, 
    TouchableOpacityBase} from "react-native";
import tw from 'tailwind-react-native-classnames';
import { validateEmail, validatePassword } from "../Validations/validation";
import { Auth } from "aws-amplify";
import { FormStyles } from "../Styles/FormStyles";

const windowWidth= Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function SignIn(props) {
    const [state, setState] = useState({
        email:"",
        password:"",
    });
    const [error, setErrors] = useState({email: "", password:""});
    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit() {
        
        if(state.email === "") {
            alert("User field can not be empty");
        }
        else {
            try {
                setIsLoading(true);
                const user = await Auth.signIn({
                    username: state.email,
                    password: state.password
                });
                props.onStateChange("signIn", user)
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                Alert.alert(error.message);
            }
        }
    }
    if(props.authState === "signIn")
    return(
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "" : "height"} keyboardVerticalOffset={-150} >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={{height:windowHeight, width:windowWidth - 30}}>
                <ScrollView style={{paddingTop:windowHeight/6}}>
                    <View style={{flexDirection:"row", alignSelf:"center",  }}>
                        <Text style={tw.style("font-bold pb-12",{ fontSize: 41})}>Underchat</Text>
                    </View>
                    <Text style={tw.style("font-bold text-gray-500 pb-2",{ fontSize: 20})}>Sign In</Text>
                    <View style={{marginBottom:.5, height:60,}}>
                        <TextInput
                            style={{height:45, borderBottomWidth:1, borderBottomColor:"gray"}}
                            onChangeText={(text) => setState({...state, email: text.toLocaleLowerCase().trim()})}
                            value={state.email}
                            placeholder="username"
                            keyboardType="email-address"
                            placeholderTextColor="gray"
                        />
                        <Text style={FormStyles.error}>{error.email}</Text>
                    </View>
                    <View style={{marginBottom:.5, height:40,}}>
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
                        {isLoading ? <ActivityIndicator color="#fafafa"/> : <Text style={tw.style("text-gray-100 text-lg py-2 text-center font-semibold")}>Sign In</Text>}
                        
                    </TouchableOpacity>
                    <View style={FormStyles.links}>
                        <TouchableOpacity
                            onPress={() => props.onStateChange("forgotPassword", {})}
                            accessibilityLabel="forgot password">
                            <Text style={{fontSize: 16, color:"#007AFF"}}>Forgot Password</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => props.onStateChange("signUp", {})}
                            accessibilityLabel="back to ">
                            <Text style={{fontSize: 16, color:"#007AFF"}}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                    </ScrollView>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
    else return <></>
}
const styles = StyleSheet.create({
    container: {
      flex:1
    }
  });