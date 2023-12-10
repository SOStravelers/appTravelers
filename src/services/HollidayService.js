import axios from "axios";
import { useStore } from "../store/index";
import Cookies from "js-cookie";

export default class HollidayService {
  static resource = "hollidays";
  static get baseUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${HollidayService.resource}`;
  }
  static getHeaders() {
    let access_token = Cookies.get("auth.access_token");
    return {
      Authorization: access_token ? access_token : {},
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
