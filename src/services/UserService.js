import axios from "axios";
import { useStore } from "../store/index";

export default class UserService {
  static resource = "users";
  static get baseUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${UserService.resource}`;
  }

  static async register(name, email, password) {
    return axios.post(`${this.baseUrl}/register`, {
      name: name,
      email: email,
      password: password,
      accessTime: "15min",
      refreshTime: "30min",
    });
  }

  static async login(email, password) {
    console.log("login email");
    return axios.post(`${this.baseUrl}/loginEmail`, {
      email: email,
      password: password,
      accessTime: "15min",
      refreshTime: "30min",
    });
  }
  static async loginGoogle(name, email, image) {
    return axios.post(`${this.baseUrl}/loginGoogle`, {
      name: name,
      email: email,
      image: image,
    });
  }

  static async get(id) {
    console.log("isd", id);
    return axios.get(`${this.baseUrl}/${id}`);
  }

  static async updateUser(
    _id,
    isActive,
    isValidate,
    email,
    type,
    img,
    about,
    languaje,
    personalData,
    workerData,
    username
  ) {
    return axios.put(`${this.baseUrl}/usersAuth/${_id}`, {
      isActive: isActive,
      isValidate: isValidate,
      email: email,
      type: type,
      img: img,
      about: about,
      languaje: languaje,
      personalData: personalData,
      workerData: workerData,
      username: username,
    });
  }

  static getHeaders() {
    return {
      headers: {},
    };
  }
}
