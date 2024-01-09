import axios from "axios";
import { useStore } from "../store/index";
import Cookies from "js-cookie";

export default class ChatService {
  static chatresource = "api/chatrooms";
  static messageResource = "api/messages";
  static get baseChatUrl() {
    const apiChat = process.env.NEXT_PUBLIC_API_SOCKET_IO;
    return `${apiChat}${ChatService.chatresource}`;
  }

  static get baseMessageUrl() {
    const apiChat = process.env.NEXT_PUBLIC_API_SOCKET_IO;
    return `${apiChat}${ChatService.messageResource}`;
  }

  static getHeaders() {
    let access_token = Cookies.get("auth.access_token");
    return {
      Authorization: access_token ? access_token : {},
    };
  }

  static async createMessage(body) {
    return axios.post(`${this.baseMessageUrl}/create`, body, {
      headers: this.getHeaders(),
    });
  }

  static async createChatRoom(body) {
    return axios.post(`${this.baseChatUrl}/create`, body, {
      headers: this.getHeaders(),
    });
  }

  static async markAsRead(body) {
    return axios.put(`${this.baseChatUrl}/markAsRead`, body, {
      headers: this.getHeaders(),
    });
  }

  static async getMessages(body) {
    return axios.post(`${this.baseMessageUrl}/getAll`, body, {
      headers: this.getHeaders(),
    });
  }

  static async getChatRooms() {
    return axios.get(`${this.baseChatUrl}/getAll`, {
      headers: this.getHeaders(),
    });
  }
}
