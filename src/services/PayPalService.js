import axios from "axios";
import { useStore } from "../store/index";

export default class PayPalService {
  static resource = "payments";
  static get baseUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${PayPalService.resource}`;
  }

  static async createOrder(payload) {
    const body = {
      product: {
        description: payload.description,
        cost: payload.cost,
      },
    };

    const config = {
      headers: {
        "Content-Type": "application/json", // Especifica que estás enviando JSON
      },
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}/newOrder`,
        body,
        config
      );
      return response.data; // Si estás esperando una respuesta JSON del servidor
    } catch (error) {
      // Manejar errores aquí
      console.error("Error al crear la orden:", error);
      throw error;
    }
  }

  static async onApprove(payload) {
    console.log("va para la api", payload);
    const body = {
      orderID: payload.orderID,
    };
    const config = {
      headers: {
        "Content-Type": "application/json", // Especifica que estás enviando JSON
      },
    };
    return axios
      .post(`${this.baseUrlLocal}/approvedOrder`, body, config)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
