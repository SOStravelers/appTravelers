import axios from "axios";
import { useStore } from "../store/index";

export default class WorkerService {
  static resource = "users";
  static resourceAuth = "auth";
  static get baseUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${WorkerService.resource}`;
  }
  static get authUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${WorkerService.resourceAuth}`;
  }
  static getHeaders() {
    return {
      Authorization: localStorage.getItem("auth.access_token")
        ? localStorage.getItem("auth.access_token")
        : {},
    };
  }

  static async list() {
    let query = "isActive=true&page=1&type=worker";
    return axios.get(`${this.authUrl}/all?${query}`);
  }

  static async get(id) {
    return axios.get(`${this.authUrl}/user/${id}`);
  }
  static async getWorker(id) {
    return axios.get(`${this.authUrl}/user/worker/${id}`);
  }

  static async setWorker() {
    return axios.get(`${this.baseUrl}/setworker`, {
      headers: this.getHeaders(),
    });
  }
}
