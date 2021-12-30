import React, { useEffect } from 'react'
import useStorage from '../../hooks/useStorage'
import { Alert, View } from 'react-native';
import defaultStyles from '../../config/defaultStyles';

const ProgressBar = ({file, setImage, extension, setFile, path, username, userId = false, setContent = false, content=false, type=false}) => {

    const { url, progress } = useStorage(file, extension, path, username, content, type, userId);
    console.log(progress, url);
    
    useEffect(()=>{
        if(url){
            setFile(null);
            if(path === 'posts'){
                Alert.alert('post uploaded successfully');
            }
            else{
                Alert.alert('picture uploaded');
            }
            setImage(null)
            if(setContent){
                setContent('')
            }
        }
    },[url, setFile])

    return (
        <View style={{width: '100%', paddingVertical: 15, borderRadius: 10}}>
            <View
                style={{width: `${progress}%`, height: 5, backgroundColor: defaultStyles.colors.text.secondary }}
            />
        </View>
    )
}

export default ProgressBar
