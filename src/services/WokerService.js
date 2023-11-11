import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default class WorkerService {
  static apiUrl = API_URL;
  static resource = "users";
  static baseUrl = `${this.apiUrl}${this.resource}`;

  static async list() {
    let query = "isActive=true&page=1&type=worker";
    return axios.get(`${this.baseUrl}/all?${query}`);
  }

  static async get(id) {
    return axios.get(`${this.baseUrl}/${id}`);
  }
}
