import axios from "axios";
import { useStore } from "../store/index";

export default class ServiceService {
  static resource = "services";
  static get baseUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${ServiceService.resource}`;
  }
  static getHeaders() {
    return {
      Authorization: localStorage.getItem("auth.access_token")
        ? localStorage.getItem("auth.access_token")
        : {},
    };
  }

  static async listByUser(id) {
    return axios.get(`${this.baseUrl}/byuser/${id}`, {
      headers: this.getHeaders(),
    });
  }

  static async list(params = {}) {
    let query = "";
    Object.keys(params).forEach((key) => {
      query += `${key}=${params[key]}&`;
    });

    return axios.get(`${this.baseUrl}/get/all?${query}`);
  }

  static async listServices() {
    return axios.get(`${this.baseUrl}/all/andsubservices`, {
      headers: this.getHeaders(),
    });
  }
}
