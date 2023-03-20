import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../../firebase/server";
type Data = {
  contents: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id } = req.query;
  const snapshot = await db
    .collection("alcoholCheckData")
    .where("date", "==", id)
    .get();
  const contents = snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  res.status(200).json({ contents });
}
