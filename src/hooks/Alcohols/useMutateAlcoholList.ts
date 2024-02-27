import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { AlcoholCheckList } from "../../../types";

export const useMutateAlcoholList = () => {
  const queryClient = useQueryClient();

  const getAlcoholCheckList = async ({
    count,
    dataEndAt,
    oldData,
  }: {
    count: number;
    dataEndAt: string;
    oldData: AlcoholCheckList[];
  }) => {
    const collectionRef = collection(db, "alcoholCheckList");
    const q = query(
      collectionRef,
      orderBy("id", "desc"),
      startAfter(dataEndAt),
      limit(count)
    );
    const snapshot = await getDocs(q);
    const data: AlcoholCheckList[] = snapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id } as AlcoholCheckList)
    );

    return [...oldData, ...data];
  };

  const readAlcoholCheckListMutate = useMutation({
    mutationFn: getAlcoholCheckList,
    onSuccess: (data) => {
      queryClient.setQueryData(["alcoholCheckList"], data);
    },
  });
  return {
    readAlcoholCheckListMutate,
  };
};
