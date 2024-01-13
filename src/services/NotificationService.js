import axios from "axios";
import { useStore } from "../store/index";
import Cookies from "js-cookie";

export default class NotificationService {
  static resource = "notification";
  static resourceAuth = "notificationAuth";

  static get baseUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${NotificationService.resource}`;
  }

  static get authUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${NotificationService.resourceAuth}`;
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

  static async getAll(page, limit) {
    return axios.get(`${this.authUrl}/getAll/?page=${page}&limit=${limit}`, {
      headers: this.getHeaders(),
    });
  }
  static async setIsRead(id) {
    return axios.put(
      `${this.authUrl}/setIsRead/${id}`,
      {},
      {
        headers: this.getHeaders(),
      }
    );
  }
  static async checkNotification() {
    return axios.get(`${this.authUrl}/checkNotifications`, {
      headers: this.getHeaders(),
    });
  }
}
