import axios from "axios";
import { useStore } from "../store/index";
import Cookies from "js-cookie";
export default class SubserviceService {
  static resource = "subservices";
  static get baseUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${SubserviceService.resource}`;
  }

  static getHeaders() {
    let access_token = Cookies.get("auth.access_token");
    return {
      Authorization: access_token ? access_token : {},
    };
  }

  //Crear subservicio con toda la data
  static async post(id, data) {
    return axios.post(`${this.baseUrl}/allData/${id}`, data, {
      headers: this.getHeaders(),
    });
  }
  //actualizar un subservicio con toda la data
  static async updateById(id, data) {
    console.log("updating data subservice");
    return axios.put(`${this.baseUrl}/allData/${id}`, data, {
      headers: this.getHeaders(),
    });
  }
  //actualizar informacion de las fotos y videos
  static async updateGallery(id, formData) {
    return axios.post(`${this.baseUrl}/assets/${id}`, formData, {
      headers: {
        ...this.getHeaders(), // ← Authorization
        "Content-Type": "multipart/form-data", // ← multipart
      },
    });
  }
  //Obtener todos los subservicios con paginate
  static async getAll(data) {
    console.log("getAll subservices");
    console.log("filtro actuales", useStore.getState().filters);
    const page = data.page;
    const limit = data.limit;
    console.log("se viene", data);
    return axios.get(
      `${this.baseUrl}/getAll/paginate?page=${page}&limit=${limit}`
    );
  }
  //Obtener subservicios que contengan videos
  static async getWithVideos() {
    return axios.get(`${this.baseUrl}/get/withVideos`);
  }
  //Obtener recomendados
  static async getRecommended() {
    return axios.get(`${this.baseUrl}/get/recommended`);
  }
  //Obtener subservicio por id
  static async getById(id) {
    return axios.get(`${this.baseUrl}/byId/${id}`);
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
}
