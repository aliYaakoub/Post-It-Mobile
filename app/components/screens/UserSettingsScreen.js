import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, View, Image, Text, Alert } from 'react-native'

import defaultStyles from '../../config/defaultStyles'
import AppText from '../GeneralComponents/AppText'
import AppButton from '../GeneralComponents/AppButton'
import { useAuth } from '../../contexts/AuthContext'
import ImagePickerBtn from '../AppComponents/ImagePickerBtn'
import ProgressBar from '../AppComponents/ProgressBar'
import AppTextInput from '../GeneralComponents/AppTextInput'

const UserSettingsScreen = () => {

    const { logout, currentUser, changeUsername, setChanges } = useAuth()

    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null)
    const [extension, setExtension] = useState('');
    const [loading, setLoading] = useState(false);
    const [newUsername, setNewUsername] = useState('');

    async function handleUpload(){
        const response = await fetch(image.uri)
        const blob = await response.blob();
        setFile(blob);
    }

    async function handleUsernameChange(){
        if(newUsername === ''){
            return Alert.alert('Username can\'t be empty')
        }
        else if(newUsername.length > 20){
            return Alert.alert('Username is too long')
        }
        else if(newUsername.length < 5){
            return Alert.alert('Username is too short, must be at least 5 characters long')
        }
        setLoading(true);
        try{
            await changeUsername(currentUser.id, newUsername);
            setNewUsername('');
            setChanges(old => old + 1);
            Alert.alert('username changed successfully')
        }
        catch(err){
            Alert.alert('an error occured, please try again later')
        }
        setLoading(false);
    }

    return (
        <ScrollView style={{backgroundColor: defaultStyles.colors.secondary, flex: 1}}>
            {currentUser && currentUser.attachment ? 
                <View>
                    <Image style={{width: '100%', height: 350}} source={{uri: currentUser.attachment.file}} />
                </View>
                : 
                <View style={{backgroundColor: 'black', height: 350, justifyContent: 'center', alignItems: 'center'}}>
                    <AppText style={{color: 'white'}}>You dont have a profile picture</AppText>
                </View>
            }
            <View style={styles.screen}>
                <Text style={styles.username}>{currentUser.username}</Text>
                {/* <ScrollView>
                    <View style={styles.innerScreen}> */}
                        {image && <View>
                            {/* <AppText style={{textAlign: 'center', color: 'white'}}>Image Preview:</AppText> */}
                            <Image source={{ uri: image.uri }} style={{ width: 150, height: 150, marginVertical: 20 }} />
                        </View>}
                        {file && extension && <ProgressBar
                            path={'profile-pictures'}
                            file={file}
                            extension={extension}
                            setFile={setFile}
                            setImage={setImage}
                            posterId={currentUser.id}
                            type={file.type}
                            userId={currentUser.id}
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

                        <View style={styles.seperator}/>

                        <AppTextInput 
                            name={'newusername'}
                            icon={'account'}
                            autoCorrect={false}
                            autoCapitalize='none'
                            placeholder='new username'
                            value={newUsername}
                            onChangeText={(val) => setNewUsername(val)}
                        />
                        <AppButton
                                title='Change username'
                                disabled={loading}
                                onPress={handleUsernameChange}
                                style={{backgroundColor: defaultStyles.colors.primary}}
                                textStyle={{color: defaultStyles.colors.text.primary}}
                        />

                        <View style={styles.seperator}/>

                        <AppButton
                            title={'logout'}
                            onPress={()=>logout()}
                            style={styles.logoutBtn}
                            textStyle={{color: defaultStyles.colors.text.primary}}
                        />
                    </View>
                {/* </ScrollView>
            </View> */}
        </ScrollView>
    )
}

export default UserSettingsScreen

const styles = StyleSheet.create({
    screen: {
        backgroundColor: defaultStyles.colors.secondary,
        flex: 1,
        padding: 15,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        transform: [
            {
                translateY: -35
            }
        ], 
        paddingBottom: 50,
        alignItems: 'center',
    },
    logoutBtn: {
        backgroundColor: defaultStyles.colors.danger,
        borderRadius: 15
    },
    username: {
        // position: 'absolute',
        fontSize: 25,
        // top: -25,
        // color: 'black'
        color: 'white',
        // backgroundColor: 'black',
        padding: 10,
        borderRadius: 15,
        textAlign: 'center'
    },
    seperator: {
        height: 2,
        borderRadius: 25,
        width: '100%',
        backgroundColor: 'black',
        marginVertical: 25
    }
})
