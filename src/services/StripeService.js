import axios from "axios";
import { useStore } from "../store/index";
import Cookies from "js-cookie";

export default class StripeService {
  static resource = "payments/stripe";
  static resourceAuth = "paymentsAuth/stripe";
  static get baseUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${StripeService.resource}`;
  }
  static get authUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${StripeService.resourceAuth}`;
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
      return axios.post(`${this.authUrl}/payment-intents`, params, {
        headers: this.getHeaders(),
      });
    } else {
      return axios.post(`${this.baseUrl}/payment-intents`, params, {
        headers: this.getHeaders(),
      });
    }
  }

  // Nuevo método para manejar las transferencias
  static async handleTransfers(paymentIntentId) {
    return axios.post(
      `${this.baseUrl}/transfer-payments`,
      { paymentIntentId },
      {
        headers: this.getHeaders(),
      }
    );
  }
}
