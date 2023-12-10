import axios from "axios";
import { useStore } from "../store/index";
import Cookies from "js-cookie";

export default class BookingService {
  static resource = "bookingAuth";
  static get baseUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${BookingService.resource}`;
  }

  static async create(params) {
    console.log("...creando");
    console.log("this.get");
    return axios.post(`${this.baseUrl}`, params, {
      headers: this.getHeaders(),
    });
  }

  static getHeaders() {
    let access_token = Cookies.get("auth.access_token");
    return {
      Authorization: access_token ? access_token : {},
    };
  }
}
