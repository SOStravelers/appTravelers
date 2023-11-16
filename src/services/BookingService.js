import axios from "axios";
import { useStore } from "../store/index";

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
    return {
      Authorization: localStorage.getItem("auth.access_token")
        ? localStorage.getItem("auth.access_token")
        : {},
    };
  }
}
