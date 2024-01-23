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
    return axios.post(`${this.baseUrl}`, params, {
      headers: this.getHeaders(),
    });
  }
  static async createWorkerBooking(params) {
    console.log("agendando");
    return axios.post(`${this.baseUrl}/worker/create`, params, {
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
      `${this.baseUrl}/worker/listdays?date=${date}&page=1&limit=4`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  static async getBookingsByListClient(date) {
    return axios.get(
      `${this.baseUrl}/client/listdays?date=${date}&page=1&limit=4`,
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
      `${this.baseUrl}/worker/month?date=${date}&page=1&limit=10`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  static async getBookingsByDayWorker(date) {
    return axios.get(
      `${this.baseUrl}/worker/day?date=${date}&page=1&limit=10`,
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
  static async getWeekUser(date) {
    console.log("...getWeekUser");
    return axios.get(`${this.baseUrl}/client/week?date=${date}`, {
      headers: this.getHeaders(),
    });
  }
  static async getWeekWorker(date) {
    console.log("...getWeekWorker");
    return axios.get(`${this.baseUrl}/worker/week?date=${date}`, {
      headers: this.getHeaders(),
    });
  }
}
