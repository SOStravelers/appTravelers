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
    return axios.get(`${this.authUrl}/all?${query}`);
  }
  static async getByservice(service) {
    console.log(service);
    return axios.get(`${this.authUrl}/business/?service=${service}`);
  }
  static async get(id) {
    return axios.get(`${this.authUrl}/user/${id}`);
  }
  static async getBusiness(id) {
    return axios.get(`${this.authUrl}/user/business/${id}`);
  }
}
