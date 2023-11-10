import axios from "axios";
import { useStore } from "../store/index";

export default class HollidayService {
  static resource = "hollidays";
  static get baseUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${HollidayService.resource}`;
  }
  static getHeaders() {
    return {
      Authorization: localStorage.getItem("auth.access_token")
        ? localStorage.getItem("auth.access_token")
        : {},
    };
  }

  static async save(params) {
    return axios.post(`${this.baseUrl}/add`, params, {
      headers: this.getHeaders(),
    });
  }
  static async getHollidayUser() {
    return axios.get(`${this.baseUrl}/get`, {
      headers: this.getHeaders(),
    });
  }
}
