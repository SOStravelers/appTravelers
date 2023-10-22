import axios from "axios";
import { useStore } from "../store/index";

export default class BookingService {
  static resource = "bookingAuth";

  static async create(params) {
    const urls = useStore.getState().urls;
    const baseUrl = `${urls.api}${this.resource}`;
    return axios.post(`${baseUrl}`, params, {
      headers: {
        Authorization: localStorage.getItem("auth.access_token"),
      },
    });
  }
}
