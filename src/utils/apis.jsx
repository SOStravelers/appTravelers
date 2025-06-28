function SetLocalStorage(env) {
  console.warn("env", env);

  const apis = new Map();
  apis.set("local", "http://localhost:9000/");
  apis.set("localMac", "http://192.168.0.3:9000/");
  apis.set("dev", "https://apidev.sostvl.com/");
  apis.set("development", "https://apidev.sostvl.com/");
  apis.set("test", "https://apitest.sostvl.com/");
  apis.set("production", "https://api.sostvl.com/");
  const fronts = new Map();
  fronts.set("local", "http://localhost:3000/");
  fronts.set("dev", "https://dev.sostvl.com/");
  fronts.set("test", "https://test.sostvl.com/");
  fronts.set("development", "https://dev.sostvl.com/");
  fronts.set("production", "https://sostvl.com/");
  const api = apis.get(env.trim());

  const front = fronts.get(env.trim());
  return { api, front };
}

export default SetLocalStorage;
