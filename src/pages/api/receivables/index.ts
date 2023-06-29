import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { GoogleSpreadsheet } from "google-spreadsheet";

type Data = {
  contents: any;
  headers: string[];
};
(async () => {
  const spreadData = new GoogleSpreadsheet('1NWgIDuNcg2cSBCSlIS2sdfGye8gNPZx-uVeC0ENFm9U');
  await spreadData.useServiceAccountAuth({
    client_email:process.env.CLIENT_EMAIL as string,
    private_key:process.env.PRIVATE_KEY as string,
  })

  await spreadData.loadInfo()
//シフト情報を取得
const shiftSheet = spreadData.sheetsById[0];
const shiftRows = await shiftSheet.getRows();
  console.log(shiftRows)
})()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.headers.apikey !== process.env.NEXT_PUBLIC_SPREADSHEET_ID) {
    console.log(req.headers.apikey);
    console.log(process.env.NEXT_PUBLIC_SPREADSHEET_ID);
    return res.status(403);
  }
  const id = process.env.NEXT_PUBLIC_SPREADSHEET_ID;
  const sheetName = "keiri";
  const apikey = process.env.NEXT_PUBLIC_SPREADSHEET_API;
  const creds = process.env.APP_ENGINE_SERVICE_ACCOUNT_KEY;
  // const doc = new GoogleSpreadsheet(id, creds);
  // console.log(creds);
  const response = await axios(
    `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${sheetName}?key=${apikey}`
  );
  const data = await response.data;
  const headers = await data.values?.shift();
  const contents = await data.values?.map((lists: any) => {
    let obj: any = {};
    headers.forEach((header: string, index: number) => {
      obj[header] = lists[index];
    });
    return obj;
  });

  return res.status(200).json({ contents, headers });
}
