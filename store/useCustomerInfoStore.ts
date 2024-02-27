import { create } from "zustand";
import { CustomerInfoData } from "../types";

type State = {
  customerInfoData: CustomerInfoData[];
  setCustomerInfoData: (customerInfoData: CustomerInfoData[]) => void;
  filterCustomerInfoData: CustomerInfoData[];
  setFilterCustomerInfoData: (customerInfoData: CustomerInfoData[]) => void;
};

export const useCustomerStore = create<State>((set) => ({
  customerInfoData: [],
  setCustomerInfoData: (customerInfoData) => set({ customerInfoData }),
  filterCustomerInfoData: [],
  setFilterCustomerInfoData: (filterCustomerInfoData) =>
    set({ filterCustomerInfoData }),
}));
