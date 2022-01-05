import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';

import AppText from '../GeneralComponents/AppText'
import { useAuth } from '../../contexts/AuthContext';

const Comment = ({data: comment, post}) => {

    const { currentUser, deleteComment, getUserData } = useAuth();

    const [user, setUser] = useState(null)

    useEffect(() => {
        const getUser = async () => {
            const userToGet = await getUserData(comment.posterId);
            setUser(userToGet.data());
        }
        getUser();
    }, [getUserData, comment.posterId])

    return (
        <View style={{position: 'relative'}}>
            {/* {
                currentUser &&
                (currentUser.id === comment.posterId &&
                <MaterialIcons 
                    name="delete" 
                    size={30} 
                    color="red" 
                    style={{position: 'absolute', top: 15, right: 5, zIndex: 50}} 
                    onPress={()=>deleteComment(post.id, comment.id)}
                />)
            } */}
            <View style={styles.username}>
                {user && user.attachment ?
                    <View style={styles.container}>
                        <Image style={{width: 45, height: 45}} source={{uri: user.attachment.file}} />
                    </View>
                : null}
                <View style={{paddingHorizontal: 10}}>
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>{user && user.username}</Text>
                    {/* <Text>{moment(post.timeStamp.toDate()).format('DD, MMM YYYY, h:mm:ss')}</Text> */}
                    <Text>{moment(comment.timeStamp.toDate()).startOf('minute').fromNow()}</Text>
                </View>
            </View>
            <AppText style={{padding: 10}}>{comment.content}</AppText>
        </View>
    )
}

export default Comment

const styles = StyleSheet.create({
    username: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    container: {
        borderRadius: 50,
        overflow: 'hidden'
    }
})
