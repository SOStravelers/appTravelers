const apis = new Map();
apis.set("local", "http://localhost:9000/");
apis.set("dev", "https://www.apidev.sostvl.com/");
const fronts = new Map();
fronts.set("local", "https://dev.sostvl.com/");
fronts.set("dev", "https://www.apidev.sostvl.com/");
let env = "";

if (localStorage && localStorage.getItem("apiUrl")) {
  env = localStorage.getItem("apiUrl");
} else {
  env = process.env.NODE_ENV;
}
console.warn("env -> ", env);
const api = apis.get(env.trim());
const front = apis.get(env.trim());

export default { api, front };
