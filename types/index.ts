import { Timestamp } from "firebase/firestore";

export type Request = {
  id: string;
  title: string;
  startDay: string;
  startTime: string;
  endEnd: string;
  endTime: string;
  applicant: string;
  person: string;
  moreless: string;
  member: string[];
  level: string;
  content: string;
  display: boolean;
  deleteAt: boolean;
  editAt: boolean;
  sendAt: any;
  recruitment: boolean;
  author: string;
  endDay: string;
};
export type RequestInputs = {
  title: string;
  startDay: string;
  startTime: string;
  endDay: string;
  endTime: string;
  applicant: string;
  person: string;
  moreless: string;
  level: string;
  content: string;
};

export type User = {
  id: string;
  uid: string;
  name: string;
  rank: number;
  email: string;
  isoSalesStaff: boolean;
  isoBoss: boolean;
  isoManager: boolean;
  isoOffice: boolean;
  isoTopManegment: boolean;
  alcoholChecker: boolean;
};

export type Sale = {
  id: string;
  currentUser: string;
  currentExpect: number;
  currentAchieve: number;
  currentTarget: number;
  updatedAt: any;
  rank: number;
};

export type MakerWeb = {
  id: string;
  name: string;
  url: string;
  userId: string;
  password: string;
  code: string;
};

export type AlcoholCheckList = {
  id: string;
  member: string[];
};

export type AlcoholCheckData = {
  id: string;
  uid: string;
  alcoholCheck1: number;
  alcoholCheck2: number;
  date: string;
  createdAt: any;
};

export type ProgressData = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  contents: ProgressContent[];
};

export type ProgressContent = {
  title: string;
  result: boolean;
};

export type CuttingReport = {
  id: string;
  staff: string;
  processNumber: string;
  cuttingDate: string;
  itemName: string;
  itemType: string;
  client: string;
  totalQuantity: number;
  comment: string;
  products: { category: string; productId: string; quantity: number }[];
  serialNumber: number;
  username: string;
};

export type Claim = {
  id: string;
  author: string;
  customer: string;
  occurrenceDate: string;
  occurrenceSelect: number;
  occurrenceContent: string;
  receptionDate: string;
  receptionNum: string;
  receptionist: string;
  amendmentSelect: number;
  amendmentContent: string;
  counterplanSelect: number;
  counterplanContent: string;
  causeDepartmentSelect: number;
  completionDate: string;
  stampStaff: string;
  stampCounterplan: string;
  stampBoss: string;
  stampManager: string;
  stampTm: string;
  stampOffice: string;
  status: number;
  operator: string;
  message: string;
  createdAt: any;
  deletedAt: any;
  imageUrl1: string;
  imageUrl2: string;
  imageUrl3: string;
  imagePath1: string;
  imagePath2: string;
  imagePath3: string;
};

export type CategoryData = {
  id: string;
  name: string;
  title: string;
};

export type NewsData = {
  id: string;
  message: string;
};

export type LinkData = {
  id: string;
  title: string;
  category: {
    name: string;
  };
  link: string;
  bold: boolean;
};

export type Product = {
  id: string;
  productType: number;
  staff: string;
  supplierId: string;
  supplierName: string;
  grayFabricId: string;
  productNumber: string;
  productNum: string;
  productName: string;
  colorNum: string;
  colorName: string;
  price: number;
  materialName: string;
  materials: any;
  fabricWidth: number;
  fabricWeight: number;
  fabricLength: number;
  features: string[];
  noteProduct: string;
  noteFabric: string;
  noteEtc: string;
  interfacing: boolean;
  lining: boolean;
  wip: number;
  externalStock: number;
  arrivingQuantity: number;
  tokushimaStock: number;
  locations: string[];
  createUser: string;
  updateUser: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CuttingProduct = {
  category: string;
  productId: string;
  quantity: number;
};

export type CustomerInformation = {
  id: string;
  customer: string;
  prefecture:string;
  title: string;
  emotion: "good" | "normal" | "bad";
  content: string;
  link: string;
  author:string;
  authorRef:string;
  createdAt: any;
};
