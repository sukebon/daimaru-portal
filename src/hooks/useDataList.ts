import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuthStore } from "../../store/useAuthStore";
import { Claim, Request, User } from "../../types";
import { useClaimStore } from "../../store/useClaimStore";
import { useUtils } from "./useUtils";
import { useRequestStore } from "../../store/useRequestStore";

export const useDataList = () => {
  const setUsers = useAuthStore((state) => state.setUsers);
  const setFullUsers = useAuthStore((state) => state.setFullUsers);
  const setClaims = useClaimStore((state) => state.setClaims);
  const setRequests = useRequestStore((state) => state.setRequests);
  const { getYearMonth } = useUtils();

  const getUsers = async () => {
    const usersCollectionRef = collection(db, "authority");
    const q = query(usersCollectionRef, orderBy("rank", "asc"));
    onSnapshot(q, (querySnapshot) => {
      setUsers(
        querySnapshot.docs
          .map(
            (doc) =>
              ({
                ...doc.data(),
                id: doc.id,
              } as User)
          )
          .filter((doc) => doc.rank !== 1000)
      );
    });
  };

  const getFullUsers = async () => {
    const usersCollectionRef = collection(db, "authority");
    const q = query(usersCollectionRef, orderBy("rank", "asc"));
    onSnapshot(q, (querySnapshot) => {
      setFullUsers(
        querySnapshot.docs.map(
          (doc) =>
            ({
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

  const getRequests = async () => {
    const requestsRef = collection(db, "requestList");
    const q = query(
      requestsRef,
      orderBy("createdAt", "desc"),
      where("display", "==", true)
    );
    onSnapshot(q, (querySnapshot) => {
      setRequests(
        querySnapshot.docs.map(
          (doc) =>
            ({
              ...doc.data(),
              id: doc.id,
            } as Request)
        )
      );
    });
  };

  const createPaymentConfirm = async () => {
    const { year, monthStr } = getYearMonth();
    const docSnap = await getDoc(
      doc(db, "paymentConfirms", `${year}_${monthStr}`)
    );
    if (!docSnap.exists()) {
      try {
        await setDoc(doc(db, "paymentConfirms", `${year}_${monthStr}`), {
          checkList: arrayUnion(),
          checkListRef: arrayUnion(),
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return {
    getUsers,
    getFullUsers,
    getClaims,
    getRequests,
    createPaymentConfirm,
  };
};
