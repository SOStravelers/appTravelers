import axios from "axios";
import { useStore } from "../store/index";

export default class HostelService {
  static resource = "users";
  static resourceAuth = "auth";
  static get baseUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${HostelService.resource}`;
  }
  static get authUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${HostelService.resourceAuth}`;
  }

  static async list() {
    let query = "isActive=true&page=1&type=business";
    return axios.get(`${this.baseUrl}/all?${query}`);
  }
  static async get(id) {
    return axios.get(`${this.baseUrl}/${id}`);
  }
}
