export const starLevel = (level) => {
  if (level === "1") return "★";
  if (level === "2") return "★★";
  if (level === "3") return "★★★";
  if (level) return level;
};

export const dayOfWeek = (d) => {
  let date = new Date(d);
  let number = date.getDay();
  return ["日", "月", "火", "水", "木", "金", "土"][number];
};
