import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default class PayPalService {
  static apiUrl = API_URL;
  static resource = "payments";
  static baseUrl = `${this.apiUrl}${this.resource}`;
  static baseUrlLocal = `http://localhost:4000/${this.resource}`

  static async createOrder(payload) {
    const body = {
      product: {
        description: payload.description,
        cost: payload.cost,
      }
    };
  
    const config = {
      headers: {
        'Content-Type': 'application/json', // Especifica que estás enviando JSON
      },
    };
  
    try {
      const response = await axios.post(
        `${this.baseUrlLocal}/newOrder`,
        body,
        config
      );
      return response.data; // Si estás esperando una respuesta JSON del servidor
    } catch (error) {
      // Manejar errores aquí
      console.error('Error al crear la orden:', error);
      throw error;
    }
  }
  
  
  
  
  
  





  static async onApprove(payload) {
    console.log("va para la api",payload)
    const body = {
      orderID: payload.orderID,
    };
    const config = {
      headers: {
        'Content-Type': 'application/json', // Especifica que estás enviando JSON
      },
    };
    return axios.post(`${this.baseUrlLocal}/approvedOrder`, body,config)   
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.error(error);
    });
  }
    
}
