import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { CuttingReportType } from "../../../../types/CuttingReportType";
type Data = {
  content: CuttingReportType;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const id = req.query.id;
  const url = `https://daimaru-kijizaiko.vercel.app/api/products/${id}`;
  const content = await axios
    .get(url, {
      params: { API_KEY: "daimaru-kijizaiko" },
    })
    .then((res) => res.data);
  res.status(200).json({ content });
}
