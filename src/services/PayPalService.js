import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default class PayPalService {
  static apiUrl = API_URL;
  static resource = "payments";
  static baseUrl = `${this.apiUrl}${this.resource}`;
  static baseUrlLocal = `http://localhost:4000/${this.resource}`
  
  static async createOrder(payload) {
    console.log(this.baseUrlLocal)
    return axios.post(`${this.baseUrlLocal}/newOrder`, {
      body: JSON.stringify({
        product:{
            description: payload.description,
            cost: payload.cost,
          }
      }),
    })
    .then((response) => {
      response.data.id
    })
    .catch((error) => {
      console.error(error);
    });
  }
  static async onApprove(payload) {
    return axios.post(`${this.baseUrl}/approve`, {
      body: JSON.stringify({
        orderID: payload.orderID
      })
    })
    .then((response) => {
      response.data
    })
    .catch((error) => {
      console.error(error);
    });
  }
    
}
