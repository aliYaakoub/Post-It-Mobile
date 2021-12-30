import { useState, useEffect } from 'react';
import { projectStorage, projectFireStore } from '../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { collection, addDoc, Timestamp, setDoc, getDoc, doc } from '@firebase/firestore';
import { Alert } from 'react-native';

const useStorage = (file, extension, path, username, content, type, userId) =>{
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [url, setUrl] = useState(null);

    const randomArray = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    function getRandomNum(num){
        let result = '';
        for(let i=0; i<num; i++){
            result += randomArray[Math.floor(Math.random()*(randomArray.length - 1))];
        }
        return result;
    }

    useEffect(()=>{
        let fileName = getRandomNum(10);
        // refrences
        const spaceRef = ref(projectStorage, `${path}/${fileName}.${extension}`);
        const uploadTask = uploadBytesResumable(spaceRef, file);
        const collectionRef = collection(projectFireStore, `${path}`);

        uploadTask.on(
            'state_changed', 
            (snap)=>{
            let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
            setProgress(percentage);
        }, 
        (err)=>{
            setError(err);
        }, 
        async ()=>{
            const url = await getDownloadURL(uploadTask.snapshot.ref)
            if(path === 'posts'){
                await addDoc(collectionRef, {
                    username: username, 
                    timeStamp: Timestamp.now(), 
                    content: content, 
                    attachment: {
                        file: url, 
                        attachmentType: type.split('/')[0], 
                        fileName: `${fileName}.${extension}`
                    },
                    likes: [],
                    comments: []
                });
            }
            else if(path === 'profile-pictures') {
                // try{
                //     await addDoc(collectionRef, {
                //         username: username, 
                //         attachment: {
                //             file: url, 
                //             fileName: `${fileName}.${extension}`
                //         },
                //         timeStamp: Timestamp.now()
                //     });
                // }
                // catch(err){
                //     Alert.alert('Could not upload')
                // }
                try{
                    const doesExist = doc(projectFireStore, 'profile-pictures', userId)
                    const elem = await getDoc(doesExist);
                    if(elem.exists()){
                        const imageRef = ref(projectStorage, `profile-pictures/${elem.data().attachment.fileName}`);
                        await deleteObject(imageRef)
                    }
                    await setDoc(doc(projectFireStore, 'profile-pictures', userId), {
                        username: username, 
                        attachment: {
                            file: url, 
                            fileName: `${fileName}.${extension}`
                        },
                        timeStamp: Timestamp.now()
                    })
                }
                catch(err){
                    Alert.alert('Could not upload')
                    console.error(err.message);
                }
            }
            setUrl(url);
        });
    },[file, path, username, content, type])

    return { progress, error, url };

}

export default useStorage;