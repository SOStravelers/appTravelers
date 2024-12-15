import axios from "axios";
import { useStore } from "../store/index";

export default class SubserviceService {
  static resource = "subservices";
  static get baseUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${SubserviceService.resource}`;
  }

  static async list(params = {}) {
    let query = "";
    Object.keys(params).forEach((key) => {
      query += `${key}=${params[key]}&`;
    });
    return axios.get(`${this.baseUrl}/byService?${query}`);
  }
  static async getPrice(data) {
    return axios.get(
      `${this.baseUrl}/prices/business/?user=${data.user}&subservice=${data.subservice}`
    );
  }
  static async getSubserviceByWorker(data) {
    return axios.get(
      `${this.baseUrl}/data/byWorker/?user=${data.user}&subservice=${data.subservice}`
    );
  }
}
