import axios from "axios";
import { API_URL, FRONT_URL } from "../utils/apis";
export default class StripeService {
  static resource = "payments/stripe";
  static baseUrl = `${API_URL}${this.resource}`;

  static async createPaymentIntent(params) {
    return axios.post(`${this.baseUrl}/payment-intents`, params);
  }
}
