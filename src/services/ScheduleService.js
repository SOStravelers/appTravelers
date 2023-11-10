import axios from "axios";
import { useStore } from "../store/index";

export default class ScheduleService {
  static resource = "schedules";
  static get baseUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${ScheduleService.resource}`;
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
  static async getScheduleUser() {
    return axios.get(`${this.baseUrl}/get`, {
      headers: this.getHeaders(),
    });
  }
}
