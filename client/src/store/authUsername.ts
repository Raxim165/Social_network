import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Username {
  username: string;
  setUsername2: (username: string) => void;
}

export const useUsername = create<Username>()(
  persist(set => ({
    username: "",
    setUsername2: (username) => set({ username }),
  }),
  { name: "username" }
))