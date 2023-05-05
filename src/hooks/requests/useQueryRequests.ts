import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Request } from '../../../types';
import { useQuery } from '@tanstack/react-query';

export const useQueryRequests = (count:number = 10) => {

  const getStopedRequests = async () => {
    const collectionRef = collection(db, "requestList");
    const q = query(
      collectionRef,
      orderBy("createdAt", "desc"),
      where("display", "==", false),
      limit(count)
    );
    const snapshot = await getDocs(q)
    const data: Request[] = snapshot.docs.map((doc) => (
      { ...doc.data(), id: doc.id, } as Request
    ))
    return data
  };        
  
  return useQuery({
    queryKey: ['requests'],
    queryFn: getStopedRequests,
  });
};

