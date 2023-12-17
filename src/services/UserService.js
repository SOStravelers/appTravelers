import axios from "axios";
import { useStore } from "../store/index";
import Cookies from "js-cookie";

export default class UserService {
  static resource = "users";
  static resourceAuth = "auth";

  //----metal
  static resourceSupport = "support";
  static get suppUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${UserService.resourceSupport}`;
  }

  //----metal
  static get baseUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${UserService.resource}`;
  }
  static get authUrl() {
    const { api } = useStore.getState().urls;
    return `${api}${UserService.resourceAuth}`;
  }
  static getHeaders() {
    let access_token = Cookies.get("auth.access_token");
    return {
      Authorization: access_token ? access_token : {},
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
  static async updatePhotoGallery(file, number) {
    console.log("update photo gallery", this.getHeaders());
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(`${this.baseUrl}/profile/gallery/${number}`, formData, {
      headers: this.getHeaders(),
    });
  }
  static async updateGallery(data) {
    console.log("update array Gallery", this.getHeaders());
    const array = { array: data };
    console.log(array);
    return axios.put(`${this.baseUrl}/profile/updateGallery`, array, {
      headers: this.getHeaders(),
    });
  }
  static async sendCodeEmail(userId, type) {
    return axios.get(
      `${this.authUrl}/sendcode/template?id=${userId}&email=${type}`,
      {
        headers: this.getHeaders(),
      }
    );
  }
  static async verifyCodeEmail(userId, code) {
    let data = { code: Number(code) };
    return axios.post(`${this.authUrl}/verifycode/${userId}/`, data, {
      headers: this.getHeaders(),
    });
  }
  static async getUserByToken() {
    return axios.get(`${this.baseUrl}/findUserToken`, {
      headers: this.getHeaders(),
    });
  }
  static async getUserById(id) {
    return axios.get(`${this.authUrl}/user/${id}`, {
      headers: this.getHeaders(),
    });
  }

  static async verifyEmail(email) {
    return axios.post(`${this.authUrl}/verifyEmail`, { email: email });
  }

  static async findByEmail(email) {
    return axios.post(`${this.authUrl}/findemail`, { email: email });
  }

  // metal

  static async supportEmail(data) {
    return axios.post(`${this.suppUrl}/supportEmail`, data);
  }
}
