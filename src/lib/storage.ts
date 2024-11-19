import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db } from './firebase';
import { useAuthStore } from '../store/authStore';

export async function uploadModel(file: File, type: 'model' | 'thumbnail') {
  const user = useAuthStore.getState().user;
  if (!user) throw new Error('User must be authenticated');

  const timestamp = Date.now();
  const path = `${user.uid}/${type}/${timestamp}_${file.name}`;
  const storageRef = ref(storage, path);
  
  const snapshot = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);
  
  return { url, path };
}

export async function saveModelToFirestore(data: {
  name: string;
  modelUrl: string;
  modelPath: string;
  thumbnailUrl?: string;
  thumbnailPath?: string;
}) {
  const user = useAuthStore.getState().user;
  if (!user) throw new Error('User must be authenticated');

  return addDoc(collection(db, 'models'), {
    ...data,
    userId: user.uid,
    createdAt: new Date(),
  });
}