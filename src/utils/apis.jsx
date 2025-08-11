function SetLocalStorage(env) {
  console.warn("env", env);

  const apis = new Map();
  apis.set("local", "http://localhost:9000/server/");
  apis.set("localMac", "http://192.168.0.3:9000/server");
  apis.set("dev", "https://apidev.sostvl.com/server/");
  apis.set("development", "https://apidev.sostvl.com/server/");
  apis.set("test", "https://apitest.sostvl.com/server/");
  apis.set("production", "https://api.sostvl.com/server/");
  const fronts = new Map();
  fronts.set("local", "http://localhost:3000/server/");
  fronts.set("dev", "https://dev.sostvl.com/server/");
  fronts.set("test", "https://test.sostvl.com/server/");
  fronts.set("development", "https://dev.sostvl.com/server/");
  fronts.set("production", "https://sostvl.com/server/");
  const api = apis.get(env.trim());

  const front = fronts.get(env.trim());
  return { api, front };
}

export default SetLocalStorage;
