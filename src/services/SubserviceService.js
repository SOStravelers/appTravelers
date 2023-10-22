import axios from "axios";
import { API_URL, FRONT_URL } from "../utils/apis";

export default class SubserviceService {
  static resource = "subservices";
  static baseUrl = `${API_URL}${this.resource}`;

  static async list(params = {}) {
    let query = "";
    Object.keys(params).forEach((key) => {
      query += `${key}=${params[key]}&`;
    });
    return axios.get(`${this.baseUrl}/byService?${query}`);
  }
}
