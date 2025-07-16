import axios from "axios";
import { useStore } from "../store/index";
import Cookies from "js-cookie";

export default class StripeService {
  static resource = "payments/stripe";
  static get baseUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${StripeService.resource}`;
  }

  static getHeaders() {
    let access_token = Cookies.get("auth.access_token");
    return {
      Authorization: access_token ? access_token : {},
    };
  }

  // Método existente para crear el PaymentIntent
  static async createPaymentIntent(params, auth = false) {
    if (auth) {
      return axios.post(`${this.baseUrl}/payment-intents`, params, {
        headers: this.getHeaders(),
      });
    } else {
      return axios.post(`${this.baseUrl}/payment-intents`, params, {
        headers: this.getHeaders(),
      });
    }
  }

  // Nuevo método para manejar las transferencias
  static async handleTransfers(data, auth = false) {
    if (auth) {
      return axios.post(`${this.baseUrl}/transfer-payments`, data, {
        headers: this.getHeaders(),
      });
    } else {
      return axios.post(
        `${this.baseUrl}/transfer-payments`,
        { paymentIntentId },
        {
          headers: this.getHeaders(),
        }
      );
    }
  }
}
