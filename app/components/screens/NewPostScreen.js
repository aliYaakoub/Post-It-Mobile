import React, { useState } from 'react'
import { Alert, Image, StyleSheet, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';

import Screen from '../GeneralComponents/Screen'
import AppText from '../GeneralComponents/AppText';
import defaultStyles from '../../config/defaultStyles';
import { useAuth } from '../../contexts/AuthContext';
import AppButton from '../GeneralComponents/AppButton';
import ImagePickerBtn from '../AppComponents/ImagePickerBtn';
import ProgressBar from '../AppComponents/ProgressBar';
import AppTextInput from '../GeneralComponents/AppTextInput';

const NewPostScreen = () => {

    const { currentUser, postContent } = useAuth()
    const navigation = useNavigation()

    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null)
    const [extension, setExtension] = useState('');
    const [content, setContent] = useState('')

    async function handleUpload(){
        if(image){
            const response = await fetch(image.uri)
            const blob = await response.blob();
            setFile(blob);
        }
        else {
            if(content === ''){
                return Alert.alert('you can\'t upload an empty post')
            }
            else if (content.length > 300){
                return Alert.alert('post is too large to upload')
            }
            try{
                await postContent(currentUser.email.split('@')[0], content)
                Alert.alert('post uploaded successfully')
                setContent('');
            }
            catch(err){
                Alert.alert('can\'t post');
                // console.error(err);
            }
        }
    }

    return (
        <>
            {currentUser ? 
                <Screen style={styles.screen}>
                    {image ?
                        <View>
                            <AppText style={{textAlign: 'center', color: 'white'}}>Image Preview:</AppText>
                            <Image source={{ uri: image.uri }} style={{ width: 200, height: 150, marginVertical: 20 }} />
                        </View>
                        :
                        <AppText style={{marginVertical: 15, fontSize: 20, color: 'white'}}>What do you want to say ?</AppText>
                    }
                    <AppTextInput
                        name='content'
                        style={{minHeight: 50, maxHeight: 150, color: 'black'}}
                        value={content}
                        onChangeText={(value)=>setContent(value)}
                        placeholder={'Post Content'}
                        multiline
                    />
                    {file && extension && <ProgressBar
                        path={'posts'}
                        file={file}
                        extension={extension}
                        setFile={setFile}
                        setImage={setImage}
                        content={content}
                        setContent={setContent}
                        username={currentUser.email.split('@')[0]}
                        type={file.type}
                    />}
                    <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between'}}>
                        <ImagePickerBtn 
                            image={image} 
                            disabled={file}
                            setImage={setImage} 
                            setExtension={setExtension} 
                            title={image ? 'Change file' : 'Pick a file'} 
                            style={{backgroundColor: defaultStyles.colors.primary}} 
                        />
                        {image && <AppButton
                            title='cancel'
                            disabled={file}
                            onPress={()=>setImage(null)}
                            style={{backgroundColor: defaultStyles.colors.danger, width: '48%'}}
                            textStyle={{color: defaultStyles.colors.text.primary}}
                        />}
                    </View>
                    <AppButton
                        title='Upload Post' 
                        disabled={file}
                        onPress={()=>handleUpload()}
                        style={{backgroundColor: defaultStyles.colors.primary}}
                        textStyle={{color: defaultStyles.colors.text.primary}}
                    />
                </Screen>
                : 
                <Screen style={styles.screen}>
                    <AppText style={styles.text}>You have to log in before posting</AppText>
                    <AppButton 
                        title={'login'} 
                        onPress={()=>navigation.navigate('loginscreen')} 
                        style={styles.loginBtn} 
                        textStyle={{color: defaultStyles.colors.text.primary, fontSize: 22}} 
                    />
                </Screen>
            }
        </>
    )
}

export default NewPostScreen

const styles = StyleSheet.create({
    screen: {
        backgroundColor: defaultStyles.colors.secondary,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    text: {
        fontSize: 25
    },
    loginBtn: {
        backgroundColor: defaultStyles.colors.primary,
        width: '50%',
        marginVertical: 50
    }
})