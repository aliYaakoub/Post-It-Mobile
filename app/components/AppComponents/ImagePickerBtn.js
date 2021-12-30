import React, { useEffect } from 'react'
import { StyleSheet, Alert, View, Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker';

import defaultStyles from '../../config/defaultStyles';
import AppButton from '../GeneralComponents/AppButton';

const ImagePickerBtn = ({disabled, style, title, setImage, setExtension, image, aspect=null, pickerType = 'All'}) => {


    useEffect(() => {
        (async () => {
          if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Sorry, we need camera roll permissions to make this work!');
            }
          }
        })();
    }, []);

    const pickImage = async () => {
        try{
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions[pickerType],
            allowsEditing: true,
            aspect: aspect ,
            quality: 1,
          });
          
          if (!result.cancelled) {
            setImage(result);
            setExtension(result.uri.split('.').pop())
          }
        }
        catch(err){
          console.error(err);
        }
    };

    return (
        <View style={[{ alignItems: 'center', justifyContent: 'center' }, image ? {width: '48%'} : {width: '100%'}]}>
            <AppButton
                title={title}
                disabled={disabled}
                onPress={()=>pickImage()}
                style={[{backgroundColor: defaultStyles.colors.secondary}, style]}
                textStyle={{color: defaultStyles.colors.text.primary}}
            />
        </View>
    )
}

export default ImagePickerBtn

const styles = StyleSheet.create({
})
