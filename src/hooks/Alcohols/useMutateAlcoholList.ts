import { useQueryClient, useMutation } from '@tanstack/react-query';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebase';
import { AlcoholCheckList } from '../../../types';

export const useMutateAlcoholList = () => {
  const queryClient = useQueryClient();
  
   const getAlcoholCheckList = async(count:number) => {
    const collectionRef = collection(db, 'alcoholCheckList')
    const q = query(collectionRef, orderBy("id", "desc"), limit(count));
    const snapshot = await getDocs(q)
    const data: AlcoholCheckList[] = snapshot.docs.map((doc) => (
      { ...doc.data(), id:doc.id } as AlcoholCheckList
    ))
    return data
  }

  const readAlcoholCheckListMutate = useMutation({
    mutationFn: getAlcoholCheckList,
    onSuccess: (data) => {
        queryClient.setQueryData(['alcoholCheckList'], data);
    }
  })
  return {
    readAlcoholCheckListMutate
  };
}
