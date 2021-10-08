import React, {useState, useEffect} from 'react';
import { Image,  } from 'react-native';
import * as FileSystem from 'expo-file-system';
import shorthash from "shorthash";


export default function CacheImage(props) {

    const [source, setSource] =  useState(null)

    useEffect(() => {
        loadImageCache();
    }, [])

    const loadImageCache = async () => {
        try {
            const uri = props.uri;
            const name = shorthash.unique(uri);
            path = FileSystem.cacheDirectory + name;
            const image = await FileSystem.getInfoAsync(path);
            if (image.exists) {
                console.log("image from cache");
                setSource(image.uri);
                return;
            }
            console.log("downloading image to cache");
            const newImage = await FileSystem.downloadAsync(uri, path);
            setSource(newImage.uri);
        } catch (e) {console.log(e);}

    }

    return (
        <Image source={{uri: source}} 
            style={{
            resizeMode:"cover",
                width: 150,
                height: 150,
                borderRadius:100,
            }}/>
    )
}
