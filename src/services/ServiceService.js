import axios from "axios";
import { useStore } from "../store/index";
import Cookies from "js-cookie";

export default class ServiceService {
  static resource = "services";
  static get baseUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${ServiceService.resource}`;
  }
  static getHeaders() {
    let access_token = Cookies.get("auth.access_token");
    return {
      Authorization: access_token ? access_token : {},
    };
  }

  static async listByUser(id) {
    return axios.get(`${this.baseUrl}/byuser/${id}`, {
      headers: this.getHeaders(),
    });
  }

  static async list(id) {
    return axios.get(`${this.baseUrl}/get/all?${id}`);
  }

  static async getServicesById(id) {
    return axios.get(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  static async listServices() {
    return axios.get(`${this.baseUrl}/all/andsubservices`, {
      headers: this.getHeaders(),
    });
  }

  //Actualizar estado activo de un servicio
  static async changeStatus(id, val) {
    return axios.put(`${this.baseUrl}/changeStatus/one/${id}`, {
      isActive: val,
    });
  }
}
