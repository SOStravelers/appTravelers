import axios from "axios";
import { useStore } from "../store/index";

export default class ServiceService {
  static resource = "services/get";

  static get baseUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${ServiceService.resource}`;
  }

  static async list(params = {}) {
    let query = "";
    console.log("base", this.baseUrl);
    Object.keys(params).forEach((key) => {
      query += `${key}=${params[key]}&`;
    });

    return axios.get(`${this.baseUrl}/all?${query}`);
  }
}
