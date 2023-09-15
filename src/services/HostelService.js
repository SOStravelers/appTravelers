import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default class HostelService {
  static apiUrl = API_URL;
  static resource = "users";
  static baseUrl = `${this.apiUrl}${this.resource}`;

  static async list() {
    let query = "isActive=true&page=1&type=business";
    return axios.get(`${this.baseUrl}/all?${query}`);
  }

  static async get(id) {
    return axios.get(`${this.baseUrl}/${id}`);
  }
}
