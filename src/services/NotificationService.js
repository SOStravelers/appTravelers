import axios from "axios";
import { useStore } from "../store/index";
import Cookies from "js-cookie";

export default class NotificationService {
  static resource = "notifications";

  static get baseUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${NotificationService.resource}`;
  }

  static getHeaders() {
    let access_token = Cookies.get("auth.access_token");
    return {
      Authorization: access_token ? access_token : {},
    };
  }
  static get authUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${NotificationService.resourceAuth}`;
  }

  static async getPublicKey() {
    return axios.get(`${this.baseUrl}/getkey/`, {});
  }
  static async createSub(params) {
    return axios.post(`${this.baseUrl}/createSub`, params, {});
  }

  static async getAll(page, limit) {
    return axios.get(`${this.baseUrl}/getAll/?page=${page}&limit=${limit}`, {
      headers: this.getHeaders(),
    });
  }
  static async setIsRead(id) {
    return axios.put(
      `${this.baseUrl}/setIsRead/${id}`,
      {},
      {
        headers: this.getHeaders(),
      }
    );
  }
  static async checkNotification() {
    return axios.get(`${this.baseUrl}/checkNotifications`, {
      headers: this.getHeaders(),
    });
  }
}
