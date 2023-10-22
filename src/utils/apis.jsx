function SetLocalStorage(env) {
  console.warn("env", env);
  const apis = new Map();
  apis.set("local", "http://localhost:4000/");
  apis.set("dev", "https://www.apidev.sostvl.com/");
  apis.set("development", "https://www.apidev.sostvl.com/");
  const fronts = new Map();
  fronts.set("local", "http://localhost:3000/");
  fronts.set("dev", "https://dev.sostvl.com/");
  fronts.set("development", "https://dev.sostvl.com/");
  fronts.set("extra", "https://app-travelers.vercel.app/");
  const api = apis.get(env.trim());
  const front = fronts.get(env.trim());
  return { api, front };
}

export default SetLocalStorage;
