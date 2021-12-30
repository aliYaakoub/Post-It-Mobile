import moment from 'moment'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';

import AppText from '../GeneralComponents/AppText'
import GetProfilePic from '../GetProfilePic'
import { useAuth } from '../../contexts/AuthContext';

const Comment = ({data: post}) => {

    const { currentUser, deleteComment } = useAuth()

    return (
        <View style={{position: 'relative'}}>
            {
                currentUser &&
                (currentUser.email.split('@')[0] === post.username &&
                <MaterialIcons 
                    name="delete" 
                    size={30} 
                    color="red" 
                    style={{position: 'absolute', top: 15, right: 5, zIndex: 50}} 
                    onPress={()=>deleteComment(post.id)}
                />)
            }
            <View style={styles.username}>
                <GetProfilePic username={post.username} width={45} />
                <View style={{paddingHorizontal: 10}}>
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>{post.username}</Text>
                    {/* <Text>{moment(post.timeStamp.toDate()).format('DD, MMM YYYY, h:mm:ss')}</Text> */}
                    <Text>{moment(post.timeStamp.toDate()).startOf('minute').fromNow()}</Text>
                </View>
            </View>
            <AppText style={{padding: 10}}>{post.content}</AppText>
        </View>
    )
}

export default Comment

const styles = StyleSheet.create({
    username: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    }
})
