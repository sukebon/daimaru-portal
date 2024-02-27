import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAt,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { AlcoholCheckList } from "../../../types";
import { useQuery } from "@tanstack/react-query";

export const useQueryAlcoholList = (
  count: number = 30,
) => {
  const getAlcoholCheckList = async () => {
    const collectionRef = collection(db, "alcoholCheckList");
    const q = query(
      collectionRef,
      orderBy("id", "desc"),
      limit(count)
    );
    const snapshot = await getDocs(q);
    const data: AlcoholCheckList[] = snapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id } as AlcoholCheckList)
    );
    return data;
  };

  return useQuery({
    queryKey: ["alcoholCheckList"],
    queryFn: getAlcoholCheckList,
  });
};
