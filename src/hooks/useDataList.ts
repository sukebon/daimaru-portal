import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuthStore } from "../../store/useAuthStore";
import { Claim, User } from "../../types";
import { useClaimStore } from "../../store/useClaimStore";

export const useDataList = () => {
  const setUsers = useAuthStore((state) => state.setUsers);
  const setFullUsers = useAuthStore((state) => state.setFullUsers);
  const setClaims = useClaimStore((state) => state.setClaims);

  const getUsers = async () => {
    const usersCollectionRef = collection(db, "authority");
    const q = query(usersCollectionRef, orderBy("rank", "asc"));
    onSnapshot(q, (querySnapshot) => {
      setUsers(
        querySnapshot.docs.map(
          (doc) =>({
              ...doc.data(),
              id: doc.id,
            } as User)
        ).filter((doc) => (
          doc.rank !== 1000 
        ))
      );
    });
  };

  const getFullUsers = async () => {
    const usersCollectionRef = collection(db, "authority");
    const q = query(usersCollectionRef, orderBy("rank", "asc"));
    onSnapshot(q, (querySnapshot) => {
      setFullUsers(
        querySnapshot.docs.map(
          (doc) => ({
              ...doc.data(),
              id: doc.id,
            } as User)
        )
      );
    });
  };

  const getClaims = async () => {
    const claimsCollectionRef = collection(db, "claimList");
    const q = query(claimsCollectionRef, orderBy("receptionNum", "desc"));
    onSnapshot(q, (querySnapshot) => {
      setClaims(
        querySnapshot.docs.map(
          (doc) =>
            ({
              ...doc.data(),
              id: doc.id,
            } as Claim)
        )
      );
    });
  };

  return { getUsers, getFullUsers,getClaims };
};
