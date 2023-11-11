import axios from "axios";
import { useStore } from "../store/index";

export default class UserService {
  static resource = "users";
  static resourceAuth = "auth";
  static get baseUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${UserService.resource}`;
  }
  static get authUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${UserService.resourceAuth}`;
  }
  static getHeaders() {
    return {
      Authorization: localStorage.getItem("auth.access_token")
        ? localStorage.getItem("auth.access_token")
        : {},
    };
  }
  static async register(name, email, password) {
    return axios.post(`${this.authUrl}/register`, {
      name: name,
      email: email,
      password: password,
      accessTime: "15min",
      refreshTime: "30min",
    });
  }
  static async login(email, password) {
    console.log("login email");
    return axios.post(`${this.authUrl}/loginEmail`, {
      email: email,
      password: password,
      accessTime: "15min",
      refreshTime: "30min",
    });
  }
  static async loginGoogle(name, email, image) {
    return axios.post(`${this.authUrl}/loginGoogle`, {
      name: name,
      email: email,
      image: image,
    });
  }
  static async createPassword(password, id) {
    return axios.post(`${this.authUrl}/createpass/${id}`, {
      password: password,
    });
  }
  static async changePassword(currentPassword, newPassword) {
    return axios.post(
      `${this.baseUrl}/changepass`,
      {
        currentPassword: currentPassword,
        newPassword: newPassword,
      },
      {
        headers: this.getHeaders(),
      }
    );
  }
  static async inactiveMode(value) {
    let data = { isActive: value };
    console.log("la data", data);
    return axios.post(`${this.baseUrl}/inactivemode`, data, {
      headers: this.getHeaders(),
    });
  }
  static async get(id) {
    console.log("isd", id);
    return axios.get(`${this.authUrl}/user/${id}`);
  }
  static async updateUser(user) {
    console.log("el userr", user);
    return axios.put(
      `${this.baseUrl}/${user._id}`,
      {
        user,
      },
      {
        headers: this.getHeaders(),
      }
    );
  }
  static async changeProfileImg(file) {
    console.log("fotito", this.getHeaders());
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(`${this.baseUrl}/profile/photo`, formData, {
      headers: this.getHeaders(),
    });
  }
  static async updateGalley(file, number) {
    console.log("fotitos", this.getHeaders());
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(`${this.baseUrl}/profile/gallery/${number}`, formData, {
      headers: this.getHeaders(),
    });
  }
}
