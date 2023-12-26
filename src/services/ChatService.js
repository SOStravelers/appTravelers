import axios from "axios";
import { useStore } from "../store/index";
import Cookies from "js-cookie";

export default class ChatService {
  static resource = "favorites";
  static userresource = "users";
  static get baseUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${ChatService.resource}`;
  }
  static get baseUserUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${ChatService.userresource}`;
  }

  static getHeaders() {
    let access_token = Cookies.get("auth.access_token");
    return {
      Authorization: access_token ? access_token : {},
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

  static async getAllUsers() {
    return axios.get(`${this.baseUserUrl}/contacts`, {
      headers: this.getHeaders(),
    });
  }
}
