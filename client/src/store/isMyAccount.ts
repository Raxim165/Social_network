import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Account {
  isMyAccount: boolean;
  setIsmyAccount: (key: boolean) => void;
}

export const useIsMyAccount = create<Account>()(
  persist(set => ({
    isMyAccount: false,
    setIsmyAccount: (key) => set({ isMyAccount: key }),
  }),
  { name: "isMyAccount" }
))