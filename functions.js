export const starLevel = (level) => {
  if (level === "1") return "★";
  if (level === "2") return "★★";
  if (level === "3") return "★★★";
  if (level) return level;
};

//日付から曜日を取得
export const dayOfWeek = (d) => {
  if (d == "未定") return "";
  let date = new Date(d);
  let number = date.getDay();
  return `（${["日", "月", "火", "水", "木", "金", "土"][number]}）`;
};

//今日の日付を取得
export const todayDate = () => {
  const newDate = new Date();
  const year = newDate.getFullYear();
  let month = newDate.getMonth() + 1;
  month = ("0" + month).slice(-2);
  const date = newDate.getDate();
  return `${year}-${month}-${date}`;
};
