import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleSpreadsheet } from "google-spreadsheet";

type Data = {
  contents: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.headers.apikey == "AIzaSyC48j9avM2wlmbB98icVQttTDG48H9NR_E") {
    const wb = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);
    await wb.useServiceAccountAuth({
      client_email: process.env.GOOGLE_CLIENT_EMAIL as string,
      private_key: process.env.GOOGLE_PRIVATE_KEY as string,
    });

    await wb.loadInfo();
    const ws = wb.sheetsById[0];
    const wsData = await ws.getRows();
    const contents = wsData
      .filter((data) => data.入金遅延 === "未回収")
      .map((data) => ({
        コード: data.コード,
        得意先名: data.得意先名,
        担当: data.担当,
        繰越残高: data.繰越残高,
        純売上額: data.純売上額,
        消費税等: data.消費税等,
        今回請求残高: data.今回請求残高,
        締日付: data.締日付,
        回収予定日: data.回収予定日,
        入金日付: data.入金日付,
        入金遅延: data.入金遅延,
      }));

    res.status(200).json({ contents });
  }
}
