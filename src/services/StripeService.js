import axios from "axios";
import { useStore } from "../store/index";
import Cookies from "js-cookie";
let access_token = Cookies.get("auth.access_token");
export default class StripeService {
  static resource = "payments/stripe";
  static get baseUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${StripeService.resource}`;
  }

  static getHeaders() {
    return {
      Authorization: access_token ? access_token : {},
    };
  }

  // Método existente para crear el PaymentIntent
  static async createPaymentIntent(params, auth = false) {
    console.log("wena", access_token);
    if (access_token) {
      return axios.post(`${this.baseUrl}/payment-intents`, params, {
        headers: this.getHeaders(),
      });
    } else {
      return axios.post(`${this.baseUrl}/noAuth/payment-intents`, params, {
        headers: this.getHeaders(),
      });
    }
  }

  // Método existente para crear el PaymentIntent
  static async chargeSavedCard(params, auth = false) {
    console.log("wena", access_token);
    if (access_token) {
      return axios.post(`${this.baseUrl}/paymentIntent/client`, params, {
        headers: this.getHeaders(),
      });
    } else {
      return axios.post(`${this.baseUrl}/paymentIntent/client`, params, {
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

  // Create payment link
  static async createCheckoutLink(params) {
    return axios.post(`${this.baseUrl}/create-checkout-link`, params, {
      headers: this.getHeaders(),
    });
  }

  // Create payment link
  static async chargeBooking(id) {
    return axios.get(`${this.baseUrl}/chargeBooking/${id}`);
  }
}
