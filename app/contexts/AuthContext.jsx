import React, { useContext, useState, useEffect } from 'react'
import { auth } from '../firebase/config';
import { 
    createUserWithEmailAndPassword, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail, 
    updatePassword, 
    updateEmail 
} from '@firebase/auth';
import { collection, addDoc, deleteDoc, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from '@firebase/firestore';
import { projectFireStore, projectStorage } from '../firebase/config';
import { Timestamp } from '@firebase/firestore';
import { ref, deleteObject } from '@firebase/storage';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({children}) {

    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true);

    async function signup(email, password){
        return createUserWithEmailAndPassword(auth, email, password);
    }

    async function login(email, password){
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout(){
        return auth.signOut();
    }

    function resetPassword(email){
        return sendPasswordResetEmail(auth, email)
    }

    function updateEmailFunc(email){
        return updateEmail(currentUser, email);
    }

    function updatePasswordFunc(password){
        return updatePassword(currentUser, password)
    }

    function postContent(username, content){
        const collectionRef = collection(projectFireStore, 'posts');
        return addDoc(collectionRef, {username: username, content: content, timeStamp: Timestamp.now(), likes: [], comments: []})
    }

    async function deletePost(id, fileName){
        try{
            if(fileName){
                const imageRef = ref(projectStorage, `posts/${fileName}`);
                await deleteObject(imageRef)
            }
            await deleteDoc(doc(projectFireStore,'posts',id));
        }
        catch(err){
            return 'could not delete post';
        }
    }

    function uploadComment(username, content, postId){
        // const collectionRef = collection(projectFireStore, 'comments');
        // return addDoc(collectionRef, {username, content, postId, timeStamp: Timestamp.now()})

        const postRef = doc(projectFireStore, 'posts', postId);
        return updateDoc(postRef, {
            comments: arrayUnion({
                username, 
                content, 
                postId, 
                timeStamp: Timestamp.now()
            })
        })
    }

    function deleteComment(id){
        return deleteDoc(doc(projectFireStore,'comments',id));
    }

    async function likePost(username, postId){

        const collectionRef = doc(projectFireStore, 'posts', postId);
        const docSnap = await getDoc(collectionRef);

        if(docSnap.exists()){
            if(docSnap.data().likes.includes(username)){
                return updateDoc(collectionRef, {
                    likes: arrayRemove(username)
                })
            }
        }

        return updateDoc(collectionRef, {
            likes: arrayUnion(username)
        })
    }

    useEffect(()=>{
        const unsub = onAuthStateChanged(auth, (user)=>{
            setCurrentUser(user);
            setLoading(false);
        })

        return unsub;
    }, [])

    const value = {
        currentUser: loading ? null : currentUser,
        signup,
        login,
        logout,
        resetPassword,
        updateEmailFunc,
        updatePasswordFunc,
        postContent,
        deletePost,
        uploadComment,
        deleteComment,
        likePost,
    }

    return (
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider>
    )
}
