import { create } from "zustand";
import SetLocalStorage from "../utils/apis";
import getConfig from "next/config";

export const useStore = create((set) => {
  const service =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("service") ?? "{}").service
      : {};

  const env = process.env.ENVIRONMENT || "dev";

  const urls = () => {
    let final = null;
    if (typeof window != "undefined") {
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
    services: [],
    haveNotification: false,
    loginModal: false,
    register: false,
    socket: null,
    setRegister: (register) => set({ register: register }),
    setHaveNotification: (haveNotification) =>
      set({ haveNotification: haveNotification }),
    setLoginModal: (loginModal) => set({ loginModal: loginModal }),
    setUser: (user) => set({ user: { ...user } }),
    setLoggedIn: (loggedIn) => set({ loggedIn: loggedIn }),
    setServices: (services) => set({ services: services }),
    setWorker: (isWorker) => set({ isWorker: isWorker }),
    setSocket: (socket) => set({ socket: socket }),
    setService: (service) =>
      set((state) => {
        const data = { service: { ...state.service, ...service } };
        localStorage.setItem("service", JSON.stringify(data));
        return data;
      }),
    resetService: () => set({ service: {} }),
  };
});
