import axios from "axios";
import { useStore } from "../store/index";
import Cookies from "js-cookie";

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
    let access_token = Cookies.get("auth.access_token");
    return {
      Authorization: access_token ? access_token : {},
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
    console.log(this.getHeaders());
    return axios.get(`${this.baseUrl}/setworker`, {
      headers: this.getHeaders(),
    });
  }
}
