import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, View, Image, Text } from 'react-native'

import defaultStyles from '../../config/defaultStyles'
import AppText from '../GeneralComponents/AppText'
import Screen from '../GeneralComponents/Screen'
import AppButton from '../GeneralComponents/AppButton'
import { useAuth } from '../../contexts/AuthContext'
import ImagePickerBtn from '../AppComponents/ImagePickerBtn'
import ProgressBar from '../AppComponents/ProgressBar'
import GetProfilePic from '../GetProfilePic'
import useFirestoreBySearch from '../../hooks/useFireStoreBySearch'

const UserSettingsScreen = () => {

    const { logout, currentUser } = useAuth()
    const { docs } = useFirestoreBySearch('profile-pictures', currentUser.email.split('@')[0]);

    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null)
    const [extension, setExtension] = useState('');
    const [profilePic, setProfilePic] = useState('');

    async function handleUpload(){
        const response = await fetch(image.uri)
        const blob = await response.blob();
        setFile(blob);
    }

    useEffect(() => {
        setProfilePic(()=>{
            if(docs.length > 0){
                return docs.sort((a,b)=> a.timeStamp - b.timeStamp).slice(-1)[0].attachment.file
            }
            return '';
        })
    }, [docs])

    return (
        <ScrollView style={{backgroundColor: defaultStyles.colors.secondary}}>
            {profilePic ? 
                <Image style={{width: '100%', height: 350}} source={{uri: profilePic}} /> 
                : 
                <View style={{backgroundColor: 'black', height: 350, justifyContent: 'center', alignItems: 'center'}}>
                    <AppText style={{color: 'white'}}>You dont have a profile picture</AppText>
                </View>
            }
            <Screen style={styles.screen}>
                <Text style={styles.username}>{currentUser.email.split('@')[0]}</Text>
                {image && <View>
                    <AppText style={{textAlign: 'center', color: 'white'}}>Image Preview:</AppText>
                    <Image source={{ uri: image.uri }} style={{ width: 150, height: 150, marginVertical: 20 }} />
                </View>}
                {file && extension && <ProgressBar
                    path={'profile-pictures'}
                    file={file}
                    extension={extension}
                    setFile={setFile}
                    setImage={setImage}
                    username={currentUser.email.split('@')[0]}
                    type={file.type}
                    userId={currentUser.uid}
                />}
                <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between'}}>
                    <ImagePickerBtn
                        title={image ? 'Change Picture' : 'Pick a profile picture'}
                        image={image}
                        disabled={file}
                        setExtension={setExtension}
                        setImage={setImage}
                        aspect={[4, 4]}
                        pickerType='Images'
                        style={{backgroundColor: defaultStyles.colors.primary}}
                    />
                    {image && <AppButton
                        title='cancel'
                        disabled={file}
                        onPress={()=>setImage(null)}
                        style={[ styles.logoutBtn, {width: '48%'}]}
                        textStyle={{color: defaultStyles.colors.text.primary}}
                    />}
                </View>
                {image && <AppButton
                    title='Upload Picture'
                    disabled={file}
                    onPress={()=>handleUpload()}
                    style={{backgroundColor: defaultStyles.colors.primary}}
                    textStyle={{color: defaultStyles.colors.text.primary}}
                />}
                <AppButton
                    title={'logout'}
                    onPress={()=>logout()}
                    style={styles.logoutBtn}
                    textStyle={{color: defaultStyles.colors.text.primary}}
                />
            </Screen>
        </ScrollView>
    )
}

export default UserSettingsScreen

const styles = StyleSheet.create({
    screen: {
        backgroundColor: defaultStyles.colors.secondary,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        transform: [
            {
                translateY: -35
            }
        ], 
        paddingBottom: 50,
    },
    logoutBtn: {
        backgroundColor: defaultStyles.colors.danger,
        borderRadius: 15
    },
    username: {
        position: 'absolute',
        fontSize: 25,
        top: -25,
        // color: 'black'
        color: 'white',
        backgroundColor: 'black',
        padding: 5,
        borderRadius: 15
    }
})
