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

  // USER BOOKINGS

  static async getBookingsByMonth(date) {
    return axios.get(
      `${this.baseUrl}/client/month?date=${date}&page=1&limit=10`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  static async getBookingsByDay(date) {
    return axios.get(
      `${this.baseUrl}/client/day?date=${date}&page=1&limit=10`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  static async getAllBookingsByClient() {
    return axios.get(`${this.baseUrl}/clients/allclients`, {
      headers: this.getHeaders(),
    });
  }

  // WORKER BOOKINGS

  static async getBookingsByList(date) {
    console.log("...getBookingsByList");
    return axios.get(
      `${this.baseUrl}/worker/listdays?date=${date}&page=1&limit=3`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  static async getAllBookings() {
    console.log("...getAllBookings");
    return axios.get(`${this.baseUrl}/allbusiness?page=1&limit=10`, {
      headers: this.getHeaders(),
    });
  }

  static async getBookingsByDate() {
    console.log("...getBookingsByDate");
    return axios.get(`${this.baseUrl}/time`, {
      headers: this.getHeaders(),
    });
  }
}
