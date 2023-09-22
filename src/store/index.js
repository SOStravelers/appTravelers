import { create } from "zustand";

export const useStore = create((set) => {
  return {
    user: {},
    loggedIn: false,
    service: {},
    setUser: (user) => set({ user: { ...user } }),
    setLoggedIn: (loggedIn) => set({ loggedIn: loggedIn }),
    setService: (service) =>
      set((state) => ({ service: { ...state.service, ...service } })),
    resetService: () => set({ service: {} }),
  };
});
