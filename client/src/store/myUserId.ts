import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MyUserId {
  myUserId: string;
  setMyUserId: (myUserId: string) => void;
}

export const useMyUserId = create<MyUserId>()(
  persist(set => ({
    myUserId: "",
    setMyUserId: (myUserId) => set({ myUserId }),
  }),
  { name: "myUserId" }
))