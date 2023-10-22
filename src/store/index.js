import { create } from "zustand";
import SetLocalStorage from "../utils/apis";

export const useStore = create((set) => {
  const service =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("service") ?? "{}").service
      : {};

  const urls = () => {
    console.log("perro");
    let final = null;
    let env = process.env.NODE_ENV;
    if (typeof window !== "undefined") {
      let storage = localStorage.getItem("apiUrl");
      storage
        ? (final = SetLocalStorage(storage))
        : (final = SetLocalStorage(env));
    } else {
      final = SetLocalStorage("dev");
    }
    return final;
  };

  const theUrls = urls();

  return {
    user: {},
    urls: theUrls,
    loggedIn: false,
    service: service,
    isWorker: false,
    setUser: (user) => set({ user: { ...user } }),
    setLoggedIn: (loggedIn) => set({ loggedIn: loggedIn }),
    setWorker: (isWorker) => set({ isWorker: isWorker }),
    setService: (service) =>
      set((state) => {
        const data = { service: { ...state.service, ...service } };
        localStorage.setItem("service", JSON.stringify(data));
        return data;
      }),
    resetService: () => set({ service: {} }),
  };
});
