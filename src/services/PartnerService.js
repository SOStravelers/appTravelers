import axios from "axios";
import { useStore } from "../store/index";
import Cookies from "js-cookie";

export default class PartnerService {
  static resource = "partners";
  static resourceAuth = "partnersAuth";

  static get baseUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${PartnerService.resource}`;
  }

  static get authUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${PartnerService.resourceAuth}`;
  }

  static getHeaders() {
    let access_token = Cookies.get("auth.access_token");
    return {
      Authorization: access_token ? access_token : {},
    };
  }
  static get authUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${PartnerService.resourceAuth}`;
  }

  static async getPublicKey() {
    return axios.get(`${this.baseUrl}/getkey/`, {});
  }
  static async sentIdClient(id, partner) {
    const body = { clientId: id, partner: partner };
    return axios.post(`${this.baseUrl}/infoClient`, body);
  }
}
