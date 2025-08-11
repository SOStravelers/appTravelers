import axios from "axios";
import { useStore } from "../store/index";
import Cookies from "js-cookie";
export default class CategoryService {
  static resource = "categories";
  static get baseUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${CategoryService.resource}`;
  }
  static getHeaders() {
    let access_token = Cookies.get("auth.access_token");
    return {
      Authorization: access_token ? access_token : {},
    };
  }
  //Obtener todas las categorias y productos
  static async getCategoriesAndProducts() {
    return axios.get(`${this.baseUrl}/all/products/all`);
  }
}
