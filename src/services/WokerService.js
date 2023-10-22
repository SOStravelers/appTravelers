import axios from "axios";
import { useStore } from "../store/index";

export default class WorkerService {
  static resource = "users";
  static get baseUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${WorkerService.resource}`;
  }

  static async list() {
    let query = "isActive=true&page=1&type=worker";
    return axios.get(`${this.baseUrl}/all?${query}`);
  }

  static async get(id) {
    return axios.get(`${this.baseUrl}/${id}`);
  }
}
