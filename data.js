export const Users = [
  {
    uid: 'EVKsigM546MbnakzkDmG0QHlfmn2',
    name: '中尾社長',
    rank: 1,
  },
  {
    uid: 'w0hJOiYYAhZL7jsVmrF0n2GKiZj2',
    name: '川井専務',
    rank: 2,
  },
  {
    uid: 'aL6VMNQObYaOzsWxriJqI4pBTjy1',
    name: '平野常務',
    rank: 3,
  },
  {
    uid: 'rTaadOHJYSNrg6jBUMCe6LE6CWC3',
    name: '丸田部長',
    rank: 4,
  },
  {
    uid: '6ren6lOJmMbX0mRWjdcpylmATTX2',
    name: '中元部長',
    rank: 5,
  },
  {
    uid: 'Gq2mclF2v1SxjYtdytgzMVsrVod2',
    name: '光延次長',
    rank: 6,
  },
  {
    uid: 'q1wpmLlQT8fUCbHyw1BkPuWkSoO2',
    name: '井上係長',
    rank: 7,
  },
  {
    uid: '9GNw16bAMWcA6tXo9pN03EuMkZh2',
    name: '後藤主任',
    rank: 7,
  },
  {
    uid: 'MBTOK9Jr0eRWVuoT2YXgZNMoBQH3',
    name: '向井課長',
    // isoPosition: 'office',
    rank: 8,
  },
  {
    uid: 'BWtKX1VivYUvQJTbmpIiEzR8tSH2',
    name: '池田係長',
    rank: 9,
  },
  {
    uid: 'dlTXruFsmcSouFsBZdBKslU2OOu1',
    name: '堀チーフ',
    rank: 10,
  },
  {
    uid: 'WtSJQRUeqJcsyhbOOcNuVV5LHwv2',
    name: '衣係長',
    rank: 11,
  },
  {
    uid: '9T736Nz4zpesmCam60iIgrnMATk2',
    name: '野田',
    rank: 12,
  },
  {
    uid: 'OGwbwQay9AYlw0yFfNY1Q9Qb9J72',
    name: '岩井店長',
    rank: 13,
  },
  {
    uid: 'bkiahjgZ3OamKB3TtvjWfXBVk7Z2',
    name: '志野チーフ',
    rank: 14,
  },
  {
    uid: '8ILxCIFNttM4fJoo1DSL1lIvSkZ2',
    name: '鳥岡',
    rank: 15,
  },
  {
    uid: 's5aeG6GygmfR5J8GSmTBZgWT7Qi2',
    name: '中村部長',
    rank: 16,
  },
  {
    uid: 'ey4IaQqA9WVcw40qvHuHKPhuvyS2',
    name: '鈴木主任',
    rank: 17,
  },
  {
    uid: '6syJfoqkcWPSy7cK6rfzrXGZ78F3',
    name: '村尾主任',
    rank: 18,
  },
  {
    uid: '8pHHV1Q2hsQS7ZioGIjAA9gfdDx1',
    name: '平島センター長',
    rank: 19,
  },
  {
    uid: 'd84HfLroQIOq2qGfrpNDMnQ9vLG2',
    name: '上野主任',
    rank: 20,
  },
  {
    uid: '05kJX9LULtatVfIEipD7L9odjWy1',
    name: '竹内主任',
    rank: 21,
  },
  {
    uid: 'xLTK7bziWoVbKE0MWS6nljd18493',
    name: '藤森工場長代理',
    rank: 23,
  },
  {
    uid: 'lnAOsBvzyQhsazCehfW6iVHiHWw1',
    name: '長瀬',
    rank: 24,
  },
];

export const Users1 = [
  {
    uid: 'Glkhk9WERWcEQWwdlfjD5a2jT6m1',
    name: '向井',
    rank: 1,
  },
  {
    uid: 'ZtwCyPgHphcb5wk99RiVkFOmZKX2',
    name: '中尾社長',
    rank: 1,
  },
  {
    uid: 'A8GsxnvgPoMufM3dR3jPjej2Fsp1',
    name: '中元部長',
    rank: 5,
  },
  {
    uid: 'K6reYnv6N3ZftKoBOeAGxjwSib73',
    name: '光延次長',
    rank: 6,
  },
  {
    uid: 'vyPgy2hcF2UmYmwJXbgnQZusWSs2',
    name: '池田係長',
    rank: 9,
  },
];

//管理者
export const Administrator = [
  'EVKsigM546MbnakzkDmG0QHlfmn2', //社長
  'MBTOK9Jr0eRWVuoT2YXgZNMoBQH3', //向井
  'Glkhk9WERWcEQWwdlfjD5a2jT6m1',
];

export const taskflow = [
  { id: 0, status: '未処理' },
  { id: 1, status: '受付' },
  { id: 2, status: '対策' },
  { id: 3, status: '内容確認中' },
  { id: 4, status: '上司承認中' },
  { id: 5, status: '管理者承認中' },
  { id: 6, status: 'ＴＭ承認中' },
  { id: 7, status: '完了' },
];

//クレーム報告書
export const claimSelectList1 = [
  {
    id: '1',
    headline: '製品起因',
    title: '製品不良',
  },
  {
    id: '2',
    headline: '製品起因',
    title: '納品書',
  },
  {
    id: '3',
    headline: '製品起因',
    title: '商品間違い',
  },
  {
    id: '4',
    headline: '製品起因',
    title: 'その他',
  },
  {
    id: '5',
    headline: '受発注',
    title: '住所等',
  },
  {
    id: '6',
    headline: '受発注',
    title: '未納品',
  },
  {
    id: '7',
    headline: '受発注',
    title: 'その他',
  },
  {
    id: '8',
    headline: 'その他',
    title: 'その他',
  },
];

export const claimSelectList2 = [
  {
    id: '1',
    title: '商品再手配',
  },
  {
    id: '2',
    title: '顧客への説明・交渉',
  },
  {
    id: '3',
    title: '伝票再発行',
  },
  {
    id: '4',
    title: 'その他',
  },
];

export const claimSelectList3 = [
  {
    id: '1',
    title: '修正処置のみ',
  },
  {
    id: '2',
    title: '書面提出',
  },
  {
    id: '3',
    title: '改善の機会',
  },
  {
    id: '4',
    title: '是正処置',
  },
];
