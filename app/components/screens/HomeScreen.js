import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, View, TouchableWithoutFeedback, Text, Modal, Image } from 'react-native'
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

import defaultStyles from '../../config/defaultStyles';
import useFirestore from '../../hooks/useFirestore'
import Screen from '../GeneralComponents/Screen';
import PostCard from '../AppComponents/PostCard';
import AppText from '../GeneralComponents/AppText';
import { useAuth } from './../../contexts/AuthContext';

const HomeScreen = () => {

    const [order, setOrder] = useState('desc')
    const [featuredPost, setFeaturedPost] = useState('')
    const [videoPlaying, setVideoPlaying] = useState('');
    const [user, setUser] = useState(null);

    const { docs, loading } = useFirestore('posts', order);
    const { getUserData } = useAuth()

    function handleSorting(){
        if(order === 'desc'){
            setOrder('asc')
        }
        else{
            setOrder('desc')
        }
    }

    useEffect(() => {
        const getUser = async () => {
            const userToGet = await getUserData(featuredPost.posterId);
            setUser(userToGet.data());
        }
        getUser();
    }, [getUserData, featuredPost.posterId])

    return (
        <Screen style={styles.screen}>
            <View style={styles.sortingHeader}>
                <Text style={styles.SortingText}>Sort By : </Text>
                <TouchableWithoutFeedback onPress={()=>handleSorting()}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.SortingText}>Date</Text>
                        <MaterialIcons name={order === 'asc' ? 'keyboard-arrow-up' : "keyboard-arrow-down"} size={24} color="white" />
                    </View>
                </TouchableWithoutFeedback>
            </View>
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
                            <AppText style={{color: 'white', paddingBottom: 10}}>Posted By {user && user.username}</AppText>
                            <Text numberOfLines={5} ellipsizeMode='tail' style={{color: 'white'}}>{featuredPost.content}</Text>
                        </View>
                    </>
                }
            </Modal>
        </Screen>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: 70
    },
    screen: {
        backgroundColor: defaultStyles.colors.secondary
        // backgroundColor: 'black'
    },
    text: {
        textAlign: 'center',
        paddingVertical: 20,
        fontSize: 22,
        color: 'white'
    },
    SortingText: {
        textAlign: 'right',
        fontSize: 20,
        paddingRight: 10,
        color: 'white'
    },
    sortingHeader: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'flex-end', 
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    exitIcon: {
        position: 'absolute', 
        top: 5, 
        right: 5, 
        zIndex: 50
    }
})
