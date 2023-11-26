import axios from "axios";
import { useStore } from "../store/index";

export default class StripeService {
  static resource = "payments/stripe";
  static get baseUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${StripeService.resource}`;
  }
  static getHeaders() {
    return {
      Authorization: localStorage.getItem("auth.access_token")
        ? localStorage.getItem("auth.access_token")
        : {},
    };
  }

  static async createPaymentIntent(params) {
    return axios.post(`${this.baseUrl}/payment-intents`, params, {
      headers: this.getHeaders(),
    });
  }
}
