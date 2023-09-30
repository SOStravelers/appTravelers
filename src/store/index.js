import { create } from "zustand";

export const useStore = create((set) => {
  const service =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("service") ?? "{}").service
      : {};
  return {
    user: {},
    loggedIn: false,
    service: service,
    setUser: (user) => set({ user: { ...user } }),
    setLoggedIn: (loggedIn) => set({ loggedIn: loggedIn }),
    setService: (service) =>
      set((state) => {
        const data = { service: { ...state.service, ...service } };
        localStorage.setItem("service", JSON.stringify(data));
        return data;
      }),
    resetService: () => set({ service: {} }),
  };
});
