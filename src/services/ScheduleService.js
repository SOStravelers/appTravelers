import axios from "axios";
import { useStore } from "../store/index";
import Cookies from "js-cookie";

export default class ScheduleService {
  static resource = "schedules";
  static get baseUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${ScheduleService.resource}`;
  }

  static getHeaders() {
    let access_token = Cookies.get("auth.access_token");
    return {
      Authorization: access_token ? access_token : {},
    };
  }

  static async save(params) {
    return axios.post(`${this.baseUrl}/addWorker`, params, {
      headers: this.getHeaders(),
    });
  }
  static async getScheduleUser() {
    return axios.get(`${this.baseUrl}/get`, {
      headers: this.getHeaders(),
    });
  }
  static async getScheduleHostel(hostelId, serviceId, subserviceId, worker) {
    return axios.get(
      `${this.baseUrl}/get/bysubservice/?businessId=${hostelId}&serviceId=${serviceId}&subserviceId=${subserviceId}&workerId=${worker}`
    );
  }
}
