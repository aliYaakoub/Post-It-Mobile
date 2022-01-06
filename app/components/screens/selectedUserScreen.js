import React, { useState } from 'react'
import { StyleSheet, ScrollView, View, TouchableWithoutFeedback, Image, Modal, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

import defaultStyles from '../../config/defaultStyles'
import Screen from '../GeneralComponents/Screen'
import AppText from '../GeneralComponents/AppText'
import PostCard from '../AppComponents/PostCard'
import useFirestoreBySearch from './../../hooks/useFireStoreBySearch';

const selectedUserScreen = ({route}) => {

    const { docs, loading } = useFirestoreBySearch('posts', route.params.posterId)

    const [featuredPost, setFeaturedPost] = useState('')
    const [videoPlaying, setVideoPlaying] = useState('');

    return (
        <Screen style={styles.screen}>
            <ScrollView>
                {loading ?
                    <View style={[styles.container, {justifyContent: 'center'}]}>
                        <AppText style={styles.text}>loading</AppText>
                    </View>
                    :
                    docs.length === 0 ?
                        <AppText style={styles.text}>No posts to show</AppText>
                        :
                        <View style={styles.container}>
                            {docs &&docs.map(post => (
                                <PostCard
                                    key={post.id}
                                    setVideoPlaying={setVideoPlaying}
                                    videoPlaying={videoPlaying}
                                    setFeaturedPost={setFeaturedPost}
                                    post={post}
                                />
                            ))}
                        </View>
                }
            </ScrollView>
            <Modal
                visible={featuredPost === '' ? false : true}
                animationType='fade'
                onRequestClose={() => {
                    setFeaturedPost('');
                }}
            >
                {featuredPost &&
                    <>
                        <View style={{backgroundColor: 'black', flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10}}>
                            <TouchableWithoutFeedback onPress={()=>setFeaturedPost('')}>
                                <Ionicons style={styles.exitIcon}  name="exit" size={30} color="white" />
                            </TouchableWithoutFeedback>
                            <Image source={{uri: featuredPost.attachment.file}} style={{borderRadius: 5, width: '100%', height: '100%', resizeMode: "contain"}} />
                        </View>
                        <View style={{backgroundColor: '#00000099', paddingHorizontal: 15, paddingVertical: 25, position: 'absolute', right: 0, bottom: 0, width: '100%'}}>
                            <AppText style={{color: 'white', paddingBottom: 10}}>Posted By {featuredPost.username}</AppText>
                            <Text numberOfLines={5} ellipsizeMode='tail' style={{color: 'white'}}>{featuredPost.content}</Text>
                        </View>
                    </>
                }
            </Modal>
        </Screen>
    )
}

export default selectedUserScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: 70
    },
    screen: {
        backgroundColor: defaultStyles.colors.primary
        // backgroundColor: 'black'
    },
    text: {
        textAlign: 'center',
        paddingVertical: 20,
        fontSize: 22,
        color: 'white'
    },
    exitIcon: {
        position: 'absolute', 
        top: 5, 
        right: 5, 
        zIndex: 50
    }
})
