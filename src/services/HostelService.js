import axios from "axios";
import { API_URL, FRONT_URL } from "../utils/apis";

export default class HostelService {
  static resource = "users";
  static baseUrl = `${API_URL}${this.resource}`;

  static async list() {
    let query = "isActive=true&page=1&type=business";
    return axios.get(`${this.baseUrl}/all?${query}`);
  }
  static async get(id) {
    return axios.get(`${this.baseUrl}/${id}`);
  }
}
