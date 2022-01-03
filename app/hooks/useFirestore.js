import {useState, useEffect} from 'react'
import { projectFireStore } from '../firebase/config'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

const useFirestore = (col, order) =>{
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const q = query(collection(projectFireStore, col), orderBy('timeStamp', order));
        const unsub = onSnapshot(q, (snap)=>{
                let documents = [];
                snap.forEach(doc => {
                    documents.push({...doc.data(), id: doc.id})
                });
                setDocs(documents);
                setLoading(false)
            })
        return () => unsub();
    }, [col, order])

    return { docs, loading };
}

export default useFirestore;