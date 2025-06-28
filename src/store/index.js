// store.js
import { create } from "zustand";
import SetLocalStorage from "../utils/apis";

export const useStore = create((set) => {
  /* ------------------ estado base que ya tenías ------------------ */
  const service =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("service") ?? "{}").service
      : { multiple: true };

  const env = process.env.NEXT_PUBLIC_NODE_ENV || "dev";
  const urls = () => {
    if (typeof window === "undefined") return SetLocalStorage("dev");
    const stored = localStorage.getItem("apiUrl");
    return stored ? SetLocalStorage(stored) : SetLocalStorage(env);
  };

  return {
    /* ----- estado original ----- */
    user: {},
    language: "en",
    urls: urls(),
    loggedIn: false,
    service,
    isWorker: false,
    haveNotification: false,
    loginModal: false,
    register: false,
    socket: null,
    filters: { keyword: null, maxPrice: 0, minPrice: 0, service: null },
    servicesIndexList: [],
    lastPage: "",
    itemsVideo: [],
    itemsWithVideos: [],
    /* ----- NUEVO: para lista infinita y restaurar scroll ----- */
    listItems: [], // tarjetas ya cargadas
    listPage: 1,
    listHasNext: true,
    scrollY: 0, // ⭐ NUEVO: posición Y
    restoreScroll: false, // ⭐ NUEVO: bandera “toca restaurar”
    syncItems: [], // ⭐ NUEVO: caché de vídeos para SyncCarousel
    indexService: null,
    stickypoint: 0,

    /* ----- setters originales ----- */
    setService: (service) =>
      set((state) => {
        const data = { service: { ...state.service, ...service } };
        localStorage.setItem("service", JSON.stringify(data));
        return data;
      }),
    setRegister: (register) => set({ register }),
    setHaveNotification: (haveNotification) => set({ haveNotification }),
    setLoginModal: (loginModal) => set({ loginModal }),
    setUser: (user) => set({ user: { ...user } }),
    setLoggedIn: (loggedIn) => set({ loggedIn }),
    setWorker: (isWorker) => set({ isWorker }),
    setSocket: (socket) => set({ socket }),
    setLanguage: (language) => set({ language }),
    setFilters: (filters) => set({ filters }),
    setServicesIndexList: (servicesIndexList) => set({ servicesIndexList }),
    setItemsWithVideos: (itemsWithVideos) => set({ itemsWithVideos }),
    resetService: () => set({ service: {} }),
    setItemsVideo: (itemsVideo) => set({ itemsVideo }),
    /* ----- setters NUEVOS ----- */
    setListItems: (arr) => set({ listItems: arr }),
    appendListItems: (arr) =>
      set((s) => ({ listItems: [...s.listItems, ...arr] })),
    setListPage: (p) => set({ listPage: p }),
    setListHasNext: (v) => set({ listHasNext: v }),
    setScrollY: (y) => set({ scrollY: y }), // ⭐
    setRestoreScroll: (v) => set({ restoreScroll: v }), // ⭐
    setSyncItems: (arr) => set({ syncItems: arr }), // ⭐
    setLastPage: (lastPage) => set({ lastPage }),
    setItemsVideo: (itemsVideo) => set({ itemsVideo }),
    setIndexService: (indexService) => set({ indexService }),
    setStickypoint: (stickypoint) => set({ stickypoint }),
  };
});
