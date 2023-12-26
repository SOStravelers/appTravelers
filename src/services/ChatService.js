import axios from 'axios'
import { useStore } from '../store/index'
import Cookies from 'js-cookie'

export default class ChatService {
  static chatresource = 'chatrooms'
  static messageResource = 'messages'
  static userresource = 'users'
  static get baseChatUrl() {
    const { api } = useStore.getState().urls
    return `${api}${ChatService.chatresource}`
  }
  static get baseUserUrl() {
    const { api } = useStore.getState().urls
    return `${api}${ChatService.userresource}`
  }
  static get baseMessageUrl() {
    const { api } = useStore.getState().urls
    return `${api}${ChatService.messageResource}`
  }

  static getHeaders() {
    let access_token = Cookies.get('auth.access_token')
    return {
      Authorization: access_token ? access_token : {},
    }
  }

  static async createMessage(body) {
    return axios.post(`${this.baseMessageUrl}/create`, body, {
      headers: this.getHeaders(),
    })
  }

  static async createChatRoom(body) {
    return axios.post(`${this.baseChatUrl}/create`, body, {
      headers: this.getHeaders(),
    })
  }

  static async markAsRead(body) {
    return axios.post(`${this.baseChatUrl}/markAsRead`, body, {
      headers: this.getHeaders(),
    })
  }

  static async getMessages() {
    return axios.get(`${this.baseMessageUrl}/getAll`, {
      headers: this.getHeaders(),
    })
  }

  static async getChatRooms() {
    return axios.get(`${this.baseChatUrl}/getAll`, {
      headers: this.getHeaders(),
    })
  }

  static async getAllUsers() {
    return axios.get(`${this.baseUserUrl}/contacts`, {
      headers: this.getHeaders(),
    })
  }
}
