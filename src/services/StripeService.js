import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default class StripeService {
  static apiUrl = API_URL;
  static resource = "payments/stripe";
  static baseUrl = `${this.apiUrl}${this.resource}`;
  static baseUrlLocal = `http://localhost:4000/${this.resource}`;

  static async createPaymentIntent(params) {
    return axios.post(`${this.baseUrlLocal}/payment-intents`, params);
  }
}
