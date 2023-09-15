import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default class UserService {
  static apiUrl = API_URL;
  static resource = "users";
  static baseUrl = `${this.apiUrl}${this.resource}`;

  static async register(name, email, password) {
    return axios.post(`${this.baseUrl}/register`, {
      name: name,
      email: email,
      password: password,
      accessTime: "15min",
      refreshTime: "30min",
    });
  }

  static async login(email, password) {
    return axios.post(`${this.baseUrl}/loginEmail`, {
      email: email,
      password: password,
      accessTime: "15min",
      refreshTime: "30min",
    });
  }

  static async get(id) {
    return axios.get(`${this.baseUrl}/${id}`);
  }

  static getHeaders() {
    return {
      headers: {},
    };
  }
}
