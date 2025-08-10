import axios from "axios";
import { useStore } from "../store/index";
import Cookies from "js-cookie";
let access_token = Cookies.get("auth.access_token");
import { buildQueryParams } from "@/helpers/apiHelpers";
export default class BookingService {
  static resource = "bookings";

  static get baseUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${BookingService.resource}`;
  }
  static getHeaders() {
    let access_token = Cookies.get("auth.access_token");
    return {
      Authorization: access_token ? access_token : {},
    };
  }

  static async create(params) {
    console.log("hay token", access_token);
    if (access_token) {
      return axios.post(`${this.baseUrl}/create`, params, {
        headers: this.getHeaders(),
      });
    } else {
      return axios.post(`${this.baseUrl}/noAuth/create`, params, {
        headers: this.getHeaders(),
      });
    }
  }

  static async getByToken(id) {
    return axios.get(`${this.baseUrl}/purchase/data/?token=${id}`, {
      headers: this.getHeaders(),
    });
  }

  static async getMyBooking(id) {
    console.log("la id", id);
    return axios.get(`${this.baseUrl}/mybooking/${id}`, {
      headers: this.getHeaders(),
    });
  }

  static async getBookingsByRange(data) {
    const queryString = buildQueryParams(data);
    return axios.get(`${this.baseUrl}/list/client?${queryString}`, {
      headers: this.getHeaders(),
    });
  }

  static async getNextBooking() {
    return axios.get(`${this.baseUrl}/next/client`, {
      headers: this.getHeaders(),
    });
  }

  static async getByRange(data) {
    const queryString = buildQueryParams(data);
    return axios.get(`${this.baseUrl}/list/admin-user?${queryString}`);
  }
  static async getHistory(params) {
    const queryString = buildQueryParams(params);
    return axios.get(`${this.baseUrl}/client/history?${queryString}`, {
      headers: this.getHeaders(),
    });
  }

  static async confirm(id) {
    return axios.put(`${this.baseUrl}/confirm/${id}`);
  }
  static async cancel(id) {
    return axios.put(`${this.baseUrl}/cancel/${id}`);
  }
  static async cancelByToken(token, id) {
    return axios.put(`${this.baseUrl}/cancel/id/${token}`, {});
  }

  ///-----------------------------
  ///-----------------------------
  ///-----------------------------
  ///-----------------------------
  ///-----------------------------
  ///-----------------------------
  ///-----------------------------
  ///-----------------------------
  static async getBookingsByDay(date) {
    return axios.get(
      `${this.baseUrl}/client/day?date=${date}&page=1&limit=100`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  static async getLastestBookings(date) {
    return axios.get(`${this.baseUrl}/client/lastdays?date=${date}`, {
      headers: this.getHeaders(),
    });
  }

  static async getAllBookingsByClient() {
    return axios.get(`${this.baseUrl}/clients/allbookings`, {
      headers: this.getHeaders(),
    });
  }

  static async totalNumberWeek(date) {
    return axios.get(`${this.baseUrl}/client/week?date=${date}`, {
      headers: this.getHeaders(),
    });
  }

  // WORKER BOOKINGS

  static async getBookingsByListWorker(date) {
    return axios.get(
      `${this.baseUrl}/worker/listdays?date=${date}&page=1&limit=100`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  static async getBookingsByListClient(date) {
    return axios.get(
      `${this.baseUrl}/client/listdays?date=${date}&page=1&limit=100`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  static async getAllBookingsByWorker(date) {
    return axios.get(`${this.baseUrl}/worker/allworkers`, {
      headers: this.getHeaders(),
    });
  }

  static async getBookingsByMonthWorker(date) {
    return axios.get(
      `${this.baseUrl}/worker/month?date=${date}&page=1&limit=100`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  static async getBookingsByDayWorker(date) {
    return axios.get(
      `${this.baseUrl}/worker/day?date=${date}&page=1&limit=100`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  static async getAllBookingsAvailable() {
    return axios.get(`${this.baseUrl}/worker/available`, {
      headers: this.getHeaders(),
    });
  }
  static async getBookingById(id) {
    return axios.get(`${this.baseUrl}/byId/${id}`, {
      headers: this.getHeaders(),
    });
  }
  static async setPhoneClientBooking(clientPhone, bookingId) {
    return axios.put(
      `${this.baseUrl}/set/phoneBooking`,
      { clientPhone, bookingId },
      {
        headers: this.getHeaders(),
      }
    );
  }
  static async confirmBookingWorker(id) {
    return axios.put(
      `${this.baseUrl}/confirmWorker/${id}`,
      {},
      {
        headers: this.getHeaders(),
      }
    );
  }
  static async confirmBookingWorkerExternal(id) {
    return axios.put(
      `${this.baseUrl}/confirmWorkerExternal/${id}`,
      {},
      {
        headers: this.getHeaders(),
      }
    );
  }
  static async completeBookingWorker(id) {
    return axios.put(
      `${this.baseUrl}/completeWorker/${id}`,
      {},
      {
        headers: this.getHeaders(),
      }
    );
  }
  static async completeBookingUser(id) {
    return axios.put(
      `${this.baseUrl}/completeUser/${id}`,
      {},
      {
        headers: this.getHeaders(),
      }
    );
  }
  static async cancelBookingWorker(id) {
    return axios.put(
      `${this.baseUrl}/cancelWorker/${id}`,
      {},
      {
        headers: this.getHeaders(),
      }
    );
  }
  static async cancelBookingUser(id) {
    return axios.put(
      `${this.baseUrl}/cancelUser/${id}`,
      {},
      {
        headers: this.getHeaders(),
      }
    );
  }
  static async getWeekUser(date, language) {
    console.log("...getWeekUser");
    return axios.get(
      `${this.baseUrl}/client/week?date=${date}&language=${language}`,
      {
        headers: this.getHeaders(),
      }
    );
  }
  static async getWeekWorker(date) {
    console.log("...getWeekWorker");
    return axios.get(`${this.baseUrl}/worker/week?date=${date}`, {
      headers: this.getHeaders(),
    });
  }
  static async createWorkerBooking(params) {
    console.log("agendando");
    return axios.post(`${this.baseUrl}/worker/create`, params, {
      headers: this.getHeaders(),
    });
  }
}
