import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../firebase/server";
type Data = {
  alcoholCheckList: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const snapshot = await db.collection("alcoholCheckList").limit(10).get();
  const alcoholCheckList = snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  res.status(200).json({ alcoholCheckList });
}
