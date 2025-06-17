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
  static async getSubserviceByWorker(data, onlySubservice = false) {
    return axios.get(
      `${this.baseUrl}/data/byWorker/?user=${data.user}&subservice=${data.subservice}&onlySubservice=${onlySubservice}`
    );
  }
  static async getAll(data) {
    const page = data.page;
    const limit = data.limit;
    console.log("se viene", data);
    return axios.get(
      `${this.baseUrl}/getAll/paginate?page=${page}&limit=${limit}`
    );
  }
  static async getById(id) {
    return axios.get(`${this.baseUrl}/byId/${id}`);
  }
  static async getWithVideos() {
    return axios.get(`${this.baseUrl}/get/withVideos`);
  }
  static async getRecommended() {
    return axios.get(`${this.baseUrl}/get/recommended`);
  }
}
