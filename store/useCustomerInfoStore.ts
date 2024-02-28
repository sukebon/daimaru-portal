import { create } from "zustand";
import { CustomerInfoData } from "../types";

type State = {
  customerInfoData: CustomerInfoData[];
  setCustomerInfoData: (customerInfoData: CustomerInfoData[]) => void;
  filterCustomerInfoData: CustomerInfoData[];
  setFilterCustomerInfoData: (customerInfoData: CustomerInfoData[]) => void;
  filterKeyWord: {
    customer: string;
    staff: string;
    title: string;
    prefecture: string;
    emotion: string;
  };
  setFilterKeyWord: (filterKeyWord: {
    customer: string;
    staff: string;
    title: string;
    prefecture: string;
    emotion: string;
  }) => void;
};

export const useCustomerStore = create<State>((set) => ({
  customerInfoData: [],
  setCustomerInfoData: (customerInfoData) => set({ customerInfoData }),
  filterCustomerInfoData: [],
  setFilterCustomerInfoData: (filterCustomerInfoData) =>
    set({ filterCustomerInfoData }),
  filterKeyWord: {
    customer: "",
    staff: "",
    title: "",
    prefecture: "",
    emotion: "",
  },
  setFilterKeyWord: (filterKeyWord) => set({ filterKeyWord }),
}));
