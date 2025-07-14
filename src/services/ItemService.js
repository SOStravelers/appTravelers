import axios from "axios";
import { useStore } from "../store/index";
import Cookies from "js-cookie";

export default class ItemService {
  static resource = "items";
  static get baseUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${ItemService.resource}`;
  }
  static getHeaders() {
    let access_token = Cookies.get("auth.access_token");
    return {
      Authorization: access_token ? access_token : {},
    };
  }

  static async getItemsBySubservice(id, date) {
    try {
      if (!id) throw new Error("missing id");
      const params = new URLSearchParams();
      params.append("id", id);
      if (date) params.append("date", date);
      console.log("params", params.toString());
      const url = `${this.baseUrl}/get/byService/${id}?${params.toString()}`;
      return axios.get(url, {
        headers: this.getHeaders(),
      });
    } catch (error) {
      throw error;
    }
  }
}
