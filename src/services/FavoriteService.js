import axios from "axios";
import { useStore } from "../store/index";

export default class FavoriteService {
  static resource = "favorites";
  static get baseUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${FavoriteService.resource}`;
  }
  static getHeaders() {
    return {
      Authorization: localStorage.getItem("auth.access_token")
        ? localStorage.getItem("auth.access_token")
        : {},
    };
  }

  static async addFavorite(id) {
    return axios.get(`${this.baseUrl}/add/${id}`, {
      headers: this.getHeaders(),
    });
  }

  static async deleteFavorite(id) {
    return axios.get(`${this.baseUrl}/delete/${id}`, {
      headers: this.getHeaders(),
    });
  }

  static async listFavorites() {
    return axios.get(`${this.baseUrl}/getAll`, {
      headers: this.getHeaders(),
    });
  }
}
