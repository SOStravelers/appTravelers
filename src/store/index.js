import { create } from "zustand";

export const useStore = create((set) => {
  return {
    user: null,
    loggedIn: false,
    setUser: (user) => set({ user: user }),
    setLoggedIn: (loggedIn) => set({ loggedIn: loggedIn }),
  };
});
