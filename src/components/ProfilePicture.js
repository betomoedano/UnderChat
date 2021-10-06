import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, Dimensions, Platform, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import tw from 'tailwind-react-native-classnames';


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

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.cancelled) {
          setImage(result.uri);
        }
      };

    return (
        <View>
            <Text style={tw.style('text-gray-500 ml-7 mb-1 mt-5')}>INFO</Text>
            <View style={styles.containerProfilePicture}>
                {props.imageUrl ?
                <View style={{alignItems:"center"}}>          
                <Image                           
                    style={{
                        resizeMode:"cover",
                            width: 150,
                            height: 150,
                            borderRadius:100,
                        }}
                        source={{
                        uri: image ? image : props.imageUrl 
                        }} 
                    />  
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
