import { useQueryClient, useMutation } from '@tanstack/react-query';
import { collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Request } from '../../../types';

export const useMutateRequests = () => {
  const queryClient = useQueryClient();

// リクエストを表示
const getStopedRequests = async (count:number) => {
    const collectionRef = collection(db, "requestList");
    const q = query(
      collectionRef,
      orderBy("createdAt", "desc"),
      where("display", "==", false),
      limit(count)
    );
    const snapshot = await getDocs(q)
    let data: Request[] = snapshot.docs.map((doc) => (
      { ...doc.data(), id: doc.id, } as Request
    ))
    return data
  };        
  const readStopedRequestsMutation = useMutation({
    mutationFn: getStopedRequests,
    onSuccess: (data) => {
     queryClient.setQueryData(['requests'], data);
    }
  })

    //リクエストを表示・非表示
  const isDisplayRequestToggle = async ( obj :{uid:string,display:boolean}) => {
    let display = obj.display ? true : false;
    const docRef = doc(db, "requestList", obj.uid);
    await updateDoc(docRef, {
      display: !display,
    });
    const docSnap = await getDoc(docRef)
    const data = { ...docSnap.data(), id: docSnap.id } as Request
    return data
  };

  const updateDisplayMutation = useMutation({
    mutationFn: isDisplayRequestToggle,
      onSuccess: (data) => {
        const previousPosts = queryClient.getQueryData<Request[]>(['requests'])
        if (previousPosts) {
          const result = previousPosts.filter((prev) => (
            prev.id !== data.id && prev
          ))
          queryClient.setQueryData<Request[]>(['requests'], [...result])
        }
    }
  })

  //募集を再開・停止
  const isRecruitmentToggle = async (obj: { uid: string, recruitment: boolean; }) => {
    let recruitment = obj.recruitment ? true : false;
    const docRef = doc(db, "requestList", obj.uid);
    await updateDoc(docRef, {
      recruitment: !recruitment,
    });
    const docSnap = await getDoc(docRef)
    const data = { ...docSnap.data(), id: docSnap.id } as Request
    return data
  };

    const updateRecruitmentMutation = useMutation({
    mutationFn: isRecruitmentToggle,
      onSuccess: (data) => {
        const previousPosts = queryClient.getQueryData<Request[]>(['requests'])
        if (previousPosts) {
          const result = previousPosts.map((prev) => (
            prev.id === data.id ? data : prev
          ))
          queryClient.setQueryData<Request[]>(['requests'], [...result])
        }
    }
    })
  
  //募集を削除
    const deleteRequest = async (id: string) => {
    const result = window.confirm("削除してよろしいでしょうか？");
    if (!result) return;
      try {
        const docRef = doc(db, "requestList", `${id}`);
        await deleteDoc(docRef);
        const docSnap = await getDoc(docRef);
        const data = { ...docSnap.data(), id: docSnap.id } as Request;
        return data;
      } catch (err) {
      console.log(err);
      }
    };

    const deleteRequestMutation = useMutation({
    mutationFn: deleteRequest,
      onSuccess: (data) => {
        const previousPosts = queryClient.getQueryData<Request[]>(['requests'])
        if (previousPosts) {
          const result = previousPosts.filter((prev) => (
            prev.id !== data?.id && prev
          ))
          console.log('result',result)
          queryClient.setQueryData<Request[]>(['requests'], [...result])
        }
    }
  })

  return {
    readStopedRequestsMutation,
    updateDisplayMutation,
    updateRecruitmentMutation,
    deleteRequestMutation
  };
}
