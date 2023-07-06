import { GoogleSpreadsheet } from "google-spreadsheet";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.headers.apikey == "AIzaSyC48j9avM2wlmbB98icVQttTDG48H9NR_E") {
    const wb = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);
    await wb.useServiceAccountAuth({
      client_email: process.env.GOOGLE_CLIENT_EMAIL as string,
      private_key: process.env.GOOGLE_PRIVATE_KEY as string,
    });

    await wb.loadInfo();
    const ws = wb.sheetsById[418851543];
    const wsData = await ws.getRows();
    const contents = wsData.map((data) => ({
      prefecture: data.prefecture,
    }));
    res.status(200).json({ contents });
  }
}
