import axios from "axios";
import { useStore } from "../store/index";
import Cookies from "js-cookie";

export default class FavoriteService {
  static resource = "favorites";

  static get baseUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${FavoriteService.resource}`;
  }

  static getHeaders() {
    let access_token = Cookies.get("auth.access_token");
    return {
      Authorization: access_token ? access_token : {},
    };
  }

  static async addFavorite(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/add/${id}`, {
        headers: this.getHeaders(),
      });

      const { listItems, setListItems } = useStore.getState();

      const updated = listItems.map((item) =>
        item._id === id ? { ...item, isFavorite: true } : item
      );

      setListItems(updated);
      return response;
    } catch (err) {
      console.error("Error al agregar favorito:", err);
      throw err;
    }
  }

  static async removeFavorite(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/remove/${id}`, {
        headers: this.getHeaders(),
      });

      const { listItems, setListItems } = useStore.getState();

      const updated = listItems.map((item) =>
        item._id === id ? { ...item, isFavorite: false } : item
      );

      setListItems(updated);
      return response;
    } catch (err) {
      console.error("Error al quitar favorito:", err);
      throw err;
    }
  }

  static async listFavorites() {
    return axios.get(`${this.baseUrl}/getAll`, {
      headers: this.getHeaders(),
    });
  }

  static async isFavorite(id) {
    return axios.get(`${this.baseUrl}/isFavorite/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
