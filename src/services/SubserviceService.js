import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default class SubserviceService {
  static apiUrl = API_URL;
  static resource = "subservices";
  static baseUrl = `${this.apiUrl}${this.resource}`;

  static async list(params = {}) {
    let query = "";
    Object.keys(params).forEach((key) => {
      query += `${key}=${params[key]}&`;
    });
    return axios.get(`${this.baseUrl}/byService?${query}`);
  }
}
