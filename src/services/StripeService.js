import axios from "axios";
import { useStore } from "../store/index";
export default class StripeService {
  static resource = "payments/stripe";
  static get baseUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${StripeService.resource}`;
  }

  static async createPaymentIntent(params) {
    return axios.post(`${this.baseUrl}/payment-intents`, params);
  }
}
