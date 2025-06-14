import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecipientId {
  recipientId: string;
  setRecipientId: (recipientId: string) => void;
}

export const useRecipientId = create<RecipientId>()(
  persist(set => ({
    recipientId: "",
    setRecipientId: (recipientId) => set({ recipientId }),
  }),
  { name: "recipientId" }
))