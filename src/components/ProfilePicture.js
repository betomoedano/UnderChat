import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions,Image, Platform, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import tw from 'tailwind-react-native-classnames';
import { API, graphqlOperation, } from 'aws-amplify'
import { updateUser } from '../graphql/mutations';
import { UPLOAD_PRESET, CLOUD_NAME } from "@env";
import CacheImage from './CacheImage';


const ProfilePicture = (props) => {

    const [image, setImage] = useState(null);

    useEffect(() => {
        (async () => {
          if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            }
          }
        })();
      }, []);

    const updatePictureInDB = async (NewImageUri) => {
        const response = await API.graphql({query: updateUser, variables: {input: {id: props.userID, imageUri: NewImageUri}}})
        //console.log("photo updated correctly", response.data)
        }
    
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: .1,
          base64: true,
        });
    
        //console.log(result);
        let base64Img = `data:image/jpg;base64,${result.base64}`;
        let apiUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload/`;
        let data = {
            "file": base64Img,
            "upload_preset": UPLOAD_PRESET,
                  }
    
        if (!result.cancelled) {
          setImage(result.uri);
          try {
            const response = await axios.post(apiUrl, data);
            //console.log(response.data.public_id);
            //console.log(response.data.url);
            await updatePictureInDB(response.data.url);
        } catch (e) {console.log(e);}
        }
      };

    return (
        <View>
            <Text style={tw.style('text-gray-500 ml-7 mb-1 mt-5')}>INFO</Text>
            <View style={styles.containerProfilePicture}>
                {props.imageUrl ?
                <View style={{alignItems:"center"}}>  
                <CacheImage uri = {props.imageUrl}/>        
                {/* <Image                           
                    style={{
                        resizeMode:"cover",
                            width: 150,
                            height: 150,
                            borderRadius:100,
                        }}
                        source={{
                        uri: image ? image : props.imageUrl 
                        }} 
                    />   */}
                    <Text style={tw.style('text-3xl font-bold text-gray-700 ')}>{props.username}</Text>
                    <Text style={tw.style('text-xl font-bold text-gray-500 ')}>{props.email}</Text>
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
                    <Text style={tw.style('text-3xl font-bold text-gray-700 ')}>{props.username}</Text>
                    <Text style={tw.style('text-xl font-bold text-gray-500 ')}>{props.email}</Text>
                </View>
                }
                <Button title="Upload Picture" onPress={pickImage} />
            </View>
        </View>
    )
  }

  export default ProfilePicture;


  const windowWidth= Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  containerProfilePicture: {
    width: windowWidth - 20,
    marginHorizontal:10,
    padding:10,
    backgroundColor: '#fff',
    marginBottom:30,
    borderRadius:20,
  },
});
