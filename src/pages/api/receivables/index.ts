import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

type Data = {
  contents: any;
  headers:string[]
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.headers.apikey !== process.env.NEXT_PUBLIC_SPREADSHEET_ID) {
    console.log(req.headers.apikey)
    console.log(process.env.NEXT_PUBLIC_SPREADSHEET_ID)
    return res.status(403)
  }
  const id = process.env.NEXT_PUBLIC_SPREADSHEET_ID;
  const sheetName = "keiri";
  const apikey = process.env.NEXT_PUBLIC_SPREADSHEET_API;
  const response = await axios(
    `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${sheetName}?key=${apikey}`
  );
  const data = await response.data
  const headers = await data.values?.shift();
  const contents = await data.values?.map((lists: any) => {
    let obj: any = {};
    headers.forEach((header: string, index: number) => {
      obj[header] = lists[index];
    });
    return obj;
  }); 
  
  return res.status(200).json({ contents,headers });
}
