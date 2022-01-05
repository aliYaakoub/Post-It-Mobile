import {useState, useEffect} from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { projectFireStore } from '../firebase/config';
import { useAuth } from './../contexts/AuthContext';

const useFirestoreBySearch = (col, user) =>{
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth()

    useEffect(()=>{
        let q;
        if(user === 'AuthUser' && currentUser){
            q = query(collection(projectFireStore, col), where("username", "==", currentUser.id));
        }
        else{
            q = query(collection(projectFireStore, col), where("username", "==", user));
        }
        const unsub = onSnapshot(q, (snap)=>{
                let documents = [];
                snap.forEach(doc => {
                    documents.push({...doc.data(), id: doc.id})
                });
                setDocs(documents);
                setLoading(false)
            })
        return () => unsub();
    }, [col, user])

    return { docs, loading };
}

export default useFirestoreBySearch;