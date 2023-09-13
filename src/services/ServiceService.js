import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default class ServiceService {
  static apiUrl = API_URL;
  static resource = "services/get";
  static baseUrl = `${this.apiUrl}${this.resource}`;

  static async list(params = {}) {
    let query = "";
    Object.keys(params).forEach((key) => {
      query += `${key}=${params[key]}&`;
    });
    return axios.get(`${this.baseUrl}/all?${query}`);
  }
}
