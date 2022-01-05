import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, Image, Modal, FlatList, TouchableWithoutFeedback, TextInput, Alert, TouchableHighlight, Button, TouchableOpacity } from 'react-native'
import { AntDesign, Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'
import { Video } from 'expo-av';
import moment from 'moment'

import { useAuth } from '../../contexts/AuthContext'
import AppText from '../GeneralComponents/AppText'
import Comment from './Comment'
import ListItemsSeperator from '../GeneralComponents/ListItemsSeperator'
import AppButton from '../GeneralComponents/AppButton';
import defaultStyles from '../../config/defaultStyles'

const PostCard = ({post, setFeaturedPost, setVideoPlaying, videoPlaying}) => {

    const { currentUser, likePost, uploadComment, deletePost, getUserData } = useAuth();

    const [errMsg, setErrMsg] = useState('')
    const [showComments, setShowComments] = useState(false);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false)
    const [comments, setComments] = useState([])
    const videoRef = useRef(null);
    const [status, setStatus] = useState({});
    const [commentsLoading, setCommentsLoading] = useState(true)
    const [user, setUser] = useState('')

    const navigation = useNavigation();

    useEffect(()=>{
        if(videoRef.current){
            if(videoPlaying !== post.id){
                videoRef.current.pauseAsync();
            }
        }
        console.log(status);
    }, [videoPlaying, status])

    async function handleLike(){
        setErrMsg('')
        if(currentUser){
            try{
                await likePost(currentUser.id, post.id);
            }
            catch(err){
                // console.error(err);
                setErrMsg('can\'t like post')
            }
        }
        else{
            setErrMsg('you need to be signed in to like a post.');
            setTimeout(()=>{
                setErrMsg('')
            },3000)
        }
    }

    function handleDelete(){
        if(post.attachment){
            deletePost(post.id, post.attachment.fileName)
        }
        else{
            deletePost(post.id, false)
        }
    }

    async function handlePostComment(){
        if(!currentUser){
            setShowComments(false)
            return navigation.navigate('loginscreen')
        }
        else if(comment === ''){
            return Alert.alert('you can\'t post an empty comment');
        }
        else if(comment.length > 200){
            return Alert.alert('comment is too large to post');
        }
        try{
            setLoading(true);
            await uploadComment(currentUser.id, comment, post.id)
            setComment('')
        }
        catch(err){
            console.error(err);
            Alert.alert('could not upload comment')
        }
        setLoading(false)
    }

    function handlePlay(){
        status.isPlaying ? videoRef.current.pauseAsync() : videoRef.current.playAsync()
        setVideoPlaying(post.id)
    }

    function handleReplay(){
        videoRef.current.replayAsync()
        setVideoPlaying(post.id)
    }

    function handleAttachment(){
        if(post.attachment){
            if(post.attachment.attachmentType === 'image'){
                return (
                    <View style={{width: '100%', height: 250, backgroundColor: 'black', borderRadius: 5}}>
                        <TouchableHighlight style={{borderRadius: 5, position: 'relative'}} onPress={()=>setFeaturedPost(post)}>
                                <Image style={[styles.image, {zIndex: 20}]} source={{uri: post.attachment.file, width: 300, height: 250}} />
                        </TouchableHighlight>
                        <View style={{zIndex: -1, position: 'absolute', width: '100%', height: '100%', left: 0, top: 0, alignItems: 'center', justifyContent: 'center'}}>
                            <AppText style={{color: 'white'}}>Loading Image</AppText>
                        </View>
                    </View>
                )
            }
            else if(post.attachment.attachmentType === 'audio'){
                return(
                    <AppText style={{textAlign: 'center', paddingVertical: 10}} >Audio unavailable</AppText>
                )
            }
            else if(post.attachment.attachmentType === 'video'){
                return (
                    <>
                        <View style={{backgroundColor: 'black', borderRadius: 5, position: 'relative'}}>
                            <TouchableWithoutFeedback onPress={() => handlePlay()}>
                                <View >
                                    <Video
                                        ref={videoRef}
                                        style={styles.video}
                                        source={{
                                            uri: post.attachment.file
                                        }}
                                        // useNativeControls
                                        resizeMode="contain"
                                        // isLooping
                                        onPlaybackStatusUpdate={status => setStatus(() => status)}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                            {status.durationMillis === status.positionMillis &&
                                <TouchableWithoutFeedback onPress={() => handleReplay()}>
                                    <View style={styles.replayView}>
                                        <Ionicons name="reload" size={30} color="white" />
                                    </View>
                                </TouchableWithoutFeedback>
                            }
                            {!status.isPlaying && status.durationMillis !== status.positionMillis &&
                                <View style={styles.playView}>
                                    <Ionicons name="play" size={30} color="white" onPress={() => handlePlay()} />
                                </View>
                            }
                            <View style={{width: '100%', height: 5, position: 'relative'}} >
                                <View
                                    style={{
                                        width: `${(status.positionMillis * 100)/status.durationMillis}%`,
                                        height: '100%',
                                        backgroundColor: 'red',
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        zIndex: 10
                                    }}
                                />
                                <View
                                    style={{
                                        width: `${(status.playableDurationMillis * 100)/status.durationMillis}%`,
                                        height: '100%',
                                        backgroundColor: 'gray',
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0
                                    }}
                                />
                            </View>
                        </View>
                        {!status.isLoaded && <AppText style={{textAlign: 'center', fontSize: 20}}>video is loading ...</AppText>}
                    </>
                )
            }
        }
        else{
            return null;
        }
    }

    useEffect(()=>{
        setComments(post.comments.sort((a,b) => a.timeStamp - b.timeStamp ))
        setCommentsLoading(false)
    }, [post.comments])

    useEffect(() => {
        const getUser = async () => {
            const userToGet = await getUserData(post.posterId);
            setUser(userToGet.data());
        }
        getUser();
    }, [getUserData, post.posterId])

    return (
        <View style={styles.postContainer}>
            {
                currentUser &&
                (currentUser.id === post.posterId &&
                <MaterialIcons 
                    name="delete" 
                    size={30} 
                    color="red" 
                    style={{position: 'absolute', top: 20, right: 20, zIndex: 50}} 
                    onPress={()=>handleDelete()}
                />)
            }
            <TouchableOpacity onPress={() => navigation.navigate('selecteduserscreen', {username: post.posterId})}>
                <View style={styles.header}>
                    {user && user.attachment ?
                        <View style={styles.container}>
                            <Image style={{width: 50, height: 50}} source={{uri: user.attachment.file}} />
                        </View>
                    : null}
                    <View style={{paddingHorizontal: 15}}>
                        <Text style={{fontSize: 20, color: '#000', fontWeight: '600'}}>{user && user.username}</Text>
                        {/* <Text style={{color: '#666'}}>{moment(post.timeStamp.toDate()).format('DD, MMM YYYY')}</Text> */}
                        {/* <Text style={{color: '#666'}}>{moment(post.timeStamp.toDate()).startOf('day').fromNow()}</Text> */}
                        {/* <Text style={{color: '#666'}}>{moment(post.timeStamp.toDate()).startOf('hour').fromNow()}</Text> */}
                        <Text style={{color: '#666'}}>{moment(post.timeStamp.toDate()).startOf('minute').fromNow()}</Text>
                        {/* <Text style={{color: '#666'}}>{moment('December 30, 2021 12:00 AM').startOf('minute').fromNow()}</Text> */}
                    </View>
                </View>
            </TouchableOpacity>
            {post.content !== '' && 
                <View>
                    <AppText style={styles.postContent}>{post.content}</AppText>
                </View>
            }
            {handleAttachment()}
            <View style={styles.likesAndComments}>
                <View style={styles.like}>
                    {currentUser && post.likes.includes(currentUser.id) ? 
                        <AntDesign name="like1" size={28} onPress={()=>handleLike()} color="black" />
                        :
                        <AntDesign name="like2" size={28} onPress={()=>handleLike()} color="black" />
                    }
                    <AppText style={{paddingHorizontal: 15}} >{post.likes.length}</AppText>
                </View>
                <View style={styles.like}>
                    <FontAwesome name="comments" size={28} color="black" onPress={()=>setShowComments(!showComments)} />
                    <AppText style={{paddingHorizontal: 15}} >{post.comments.length}</AppText>
                </View>
            </View>
            {errMsg ? 
                <Text style={{color: 'red', fontSize: 20, textAlign: 'center'}}>{errMsg}</Text>
                :
                null
            }
            <Modal
                visible={showComments}
                animationType='slide'
                onRequestClose={() => {
                    setShowComments(!showComments);
                }}
            >
                <View style={{position: 'relative', flex: 1}}>
                    <TouchableWithoutFeedback onPress={()=>setShowComments(!showComments)}>
                        <Ionicons style={styles.exitIcon}  name="exit" size={30} color="black" />
                    </TouchableWithoutFeedback>
                    {commentsLoading ?
                        <View style={styles.commentsInfo}>
                            <AppText style={{textAlign: 'center', paddingVertical: 30}}>loading comments</AppText>
                        </View>
                        :
                        comments.length === 0 ?
                            <View style={styles.commentsInfo}>
                                <AppText style={{textAlign: 'center', paddingVertical: 30}}>Be the first to leave a comment</AppText>
                            </View>
                            :
                            <FlatList
                                style={{marginTop: 20}}
                                // data={comments.sort((a,b)=>( b.timeStamp - a.timestamp ))}
                                data={comments}
                                keyExtractor={(item)=>item.id}
                                ItemSeparatorComponent={ListItemsSeperator}
                                renderItem={({item})=>(
                                    <Comment data={item} post={post}/>
                                )}
                            />
                    }
                </View>
                <View style={styles.commentfield}>
                    <TextInput 
                        placeholder='Comment...' 
                        style={styles.comment}
                        value={comment}
                        onChangeText={(value)=>setComment(value)}
                    />
                    <AppButton 
                        disabled={loading}
                        title='post' 
                        onPress={()=>handlePostComment()} 
                        style={{marginVertical: 0, borderRadius: 15, width: '25%', backgroundColor: defaultStyles.colors.secondary}} 
                        textStyle={{color: 'white'}}
                    />
                </View>
            </Modal>
        </View>
    )
}

export default PostCard

const styles = StyleSheet.create({
    container: {
        borderRadius: 25,
        overflow: 'hidden',
        backgroundColor: 'black'
    },
    postContainer: {
        width: '100%',
        padding: 10,
        paddingHorizontal: 10,
        margin: 10,
        backgroundColor: defaultStyles.colors.light,
    },
    header: {
        borderBottomColor: defaultStyles.colors.secondary, 
        borderBottomWidth: 2, 
        padding: 10,
        paddingBottom: 15,
        flex: 1,
        alignItems: 'center', 
        flexDirection: 'row',
        marginBottom: 20
    },
    image: {
        width: '100%',
        borderRadius: 5,
    },
    video: {
        width: '100%',
        height: 250,
    },  
    postContent: {
        padding: 10,
        paddingHorizontal: 10,
        color: '#000',
        fontSize: 18
    },
    likesAndComments: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingVertical: 10,
        paddingTop: 15
    },
    like: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingHorizontal: 20
    },
    commentfield: {
        flexDirection: 'row',
        borderRadius: 15,
        backgroundColor: defaultStyles.colors.light,
        margin: 10
    },
    comment: {
        width: '75%',
        padding: 15,
        fontSize: 18,
        borderRadius: 15,
        backgroundColor: defaultStyles.colors.light
    },
    commentsInfo: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    exitIcon: {
        position: 'absolute', 
        top: 5, 
        right: 5, 
        zIndex: 50
    },
    replayView: {
        position:'absolute', 
        backgroundColor: '#00000066', 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: '100%', 
        height: '100%'
    },
    playView: {
        position:'absolute', 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: '100%', 
        height: '100%'
    }
})
