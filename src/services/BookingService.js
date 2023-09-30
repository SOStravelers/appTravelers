import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default class BookingService {
  static apiUrl = API_URL;
  static resource = "bookingAuth";
  static baseUrl = `${this.apiUrl}${this.resource}`;

  static async create(params) {
    return axios.post(`${this.baseUrl}`, params, {
      headers: {
        Authorization: localStorage.getItem("auth.access_token"),
      },
    });
  }
}
