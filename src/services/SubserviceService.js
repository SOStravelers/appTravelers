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
  static async post(data) {
    return axios.post(`${this.baseUrl}/`, data, {
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

  //actualizar un subservicio con toda la data
  static async updateProductData(data) {
    console.log("updating product data subservice");
    return axios.put(`${this.baseUrl}/productData/${data._id}`, data, {
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
  static async getAll({ page, limit }) {
    const { loggedIn } = useStore.getState();
    console.log("el loguead", loggedIn);
    const filters = useStore.getState().filters || {};
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);

    Object.entries(filters).forEach(([key, value]) => {
      /* ---- saltar nulos, vacíos y precio = 0 ---- */
      if (
        value == null || // null / undefined
        value === "" || // string vacío
        ((key === "minPrice" || key === "maxPrice") && Number(value) === 0)
      ) {
        return;
      }

      /* arrays → ?tag=a&tag=b */
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.append(key, value);
      }
    });
    const endpoint = loggedIn ? "getAll/user/paginate" : "getAll/paginate";
    return axios.get(`${this.baseUrl}/${endpoint}?${params.toString()}`, {
      headers: this.getHeaders(),
    });
  }
  //Obtener subservicios que contengan videos
  static async getWithVideos() {
    return axios.get(`${this.baseUrl}/get/withVideos`);
  }
  //Obtener recomendados
  static async getRecommended(id) {
    return axios.get(`${this.baseUrl}/get/recommended?subservice=${id}`);
  }
  //Obtener subservicio por id
  static async getById(id) {
    return axios.get(`${this.baseUrl}/byId/${id}`);
  }
  //Obtener todos los subservicio agrupados en servicios
  static async getByService(id) {
    return axios.get(`${this.baseUrl}/byService/${id}`);
  }

  //Obtener todos los subservicio agrupados en servicios
  static async getAllByService() {
    return axios.get(`${this.baseUrl}/all/byService`);
  }
  //Actualizar estado activo de un sub-servicio
  static async changeStatus(id, val) {
    return axios.put(`${this.baseUrl}/changeStatus/one/${id}`, {
      isActive: val,
    });
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

  static async getItemsBySubservice(id, date) {
    try {
      if (!id) throw new Error("missing id");
      const params = new URLSearchParams();
      params.append("id", id);
      if (date) params.append("date", date);
      console.log("params", params.toString());
      const url = `${this.baseUrl}/getProducts?${params.toString()}`;
      return axios.get(url, {
        headers: this.getHeaders(),
      });
    } catch (error) {
      throw error;
    }
  }
}
