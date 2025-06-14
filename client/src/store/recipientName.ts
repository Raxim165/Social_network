import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Name {
  recipientName: string;
  setRecipientName: (name: string) => void;
}

export const useRecipientName = create<Name>()(
  persist(set => ({
    recipientName: "",
    setRecipientName: (name) => set({ recipientName: name }),
  }),
  { name: "recipientName" }
))