import React, { useState, useEffect } from 'react'
import { Image, StyleSheet, View } from 'react-native';
import useFirestoreBySearch from '../hooks/useFireStoreBySearch';

const GetProfilePic = ({username, width=50}) => {

    const { docs } = useFirestoreBySearch('profile-pictures', username);

    const [profilePic, setProfilePic] = useState('');
    
    useEffect(() => {
        setProfilePic(()=>{
            if(docs.length > 0){
                return docs.sort((a,b)=> a.timeStamp - b.timeStamp).slice(-1)[0].attachment.file
            }
            return '';
        })
    }, [docs])

    return (
        <View style={styles.container}>
            {profilePic ?
                <Image style={{width: width, height: width}} source={{uri: profilePic}} />
            : null}
        </View>
    )
}

export default GetProfilePic

const styles = StyleSheet.create({
    container: {
        borderRadius: 25,
        overflow: 'hidden'
    }
})