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
}
