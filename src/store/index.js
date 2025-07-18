// store.js
import { create } from "zustand";
import { devtools } from "zustand/middleware"; // <-- Importa el middleware aquí
import SetLocalStorage from "../utils/apis";

export const useStore = create(
  devtools(
    (set) => {
      // ------------------ estado base que ya tenías ------------------
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
        // ----- estado original -----
        user: {},
        language: "en",
        currency: "BRL",
        changeTheme: false,
        loadingCarrouselVideos: false,
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
        // ----- NUEVO: para lista infinita y restaurar scroll -----
        listItems: [], // tarjetas ya cargadas
        listPage: 1,
        listHasNext: true,
        scrollY: 0, // ⭐ NUEVO: posición Y
        restoreScroll: false, // ⭐ NUEVO: bandera “toca restaurar”
        syncItems: [], // ⭐ NUEVO: caché de vídeos para SyncCarousel
        indexService: null,
        stickypoint: 0,

        // ----- setters originales -----
        setService: (service) =>
          set(
            (state) => {
              const data = { service: { ...state.service, ...service } };
              localStorage.setItem("service", JSON.stringify(data));
              return data;
            },
            false, //--> borra todo el estado anterior
            "setService"
          ),
        setLoadingCarrouselVideos: (loadingCarrouselVideos) =>
          set({ loadingCarrouselVideos }, false, "setLoadingCarrouselVideos"),
        setRegister: (register) => set({ register }, false, "setRegister"),
        setHaveNotification: (haveNotification) =>
          set({ haveNotification }, false, "setHaveNotification"),
        setLoginModal: (loginModal) =>
          set({ loginModal }, false, "setLoginModal"),
        setUser: (user) => set({ user: { ...user } }, false, "setUser"),
        setLoggedIn: (loggedIn) => set({ loggedIn }, false, "setLoggedIn"),
        setWorker: (isWorker) => set({ isWorker }, false, "setWorker"),
        setSocket: (socket) => set({ socket }, false, "setSocket"),
        setLanguage: (language) => set({ language }, false, "setLanguage"),
        setCurrency: (currency) => set({ currency }, false, "setCurrency"),
        setChangeTheme: (changeTheme) =>
          set({ changeTheme }, false, "setChangeTheme"),

        setFilters: (filters) => set({ filters }, false, "setFilters"),
        setServicesIndexList: (servicesIndexList) =>
          set({ servicesIndexList }, false, "setServicesIndexList"),
        setItemsWithVideos: (itemsWithVideos) =>
          set({ itemsWithVideos }, false, "setItemsWithVideos"),
        resetService: () => set({ service: {} }, false, "resetService"),
        setItemsVideo: (itemsVideo) =>
          set({ itemsVideo }, false, "setItemsVideo"),
        // ----- setters NUEVOS -----
        setListItems: (arr) => set({ listItems: arr }, false, "setListItems"),
        appendListItems: (arr) =>
          set(
            (s) => ({ listItems: [...s.listItems, ...arr] }),
            false,
            "appendListItems"
          ),
        setListPage: (p) => set({ listPage: p }, false, "setListPage"),
        setListHasNext: (v) => set({ listHasNext: v }, false, "setListHasNext"),
        setScrollY: (y) => set({ scrollY: y }, false, "setScrollY"),
        setRestoreScroll: (v) =>
          set({ restoreScroll: v }, false, "setRestoreScroll"),
        setSyncItems: (arr) => set({ syncItems: arr }, false, "setSyncItems"),
        setLastPage: (lastPage) => set({ lastPage }, false, "setLastPage"),
        setIndexService: (indexService) =>
          set({ indexService }, false, "setIndexService"),
        setStickypoint: (stickypoint) =>
          set({ stickypoint }, false, "setStickypoint"),
      };
    },
    { name: "SOSStore" }
  ) // <-- El nombre aparecerá en Redux DevTools
);
