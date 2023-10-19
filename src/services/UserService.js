import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default class UserService {
  static apiUrl = API_URL;
  static resource = "users";
  static baseUrl = `${this.apiUrl}${this.resource}`;
  static baseUrlLocal = `http://localhost:4000/${this.resource}`;

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
    return axios.post(`${this.baseUrlLocal}/loginEmail`, {
      email: email,
      password: password,
      accessTime: "15min",
      refreshTime: "30min",
    });
  }
  static async loginGoogle(name, email, image) {
    console.log("casa", name, email, image);
    return axios.post(`${this.baseUrlLocal}/loginGoogle`, {
      name: name,
      email: email,
      image: image,
    });
  }

  static async get(id) {
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
