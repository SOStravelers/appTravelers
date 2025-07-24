export const buildQueryParams = (data) => {
  const params = new URLSearchParams();

  for (const key in data) {
    if (Array.isArray(data[key])) {
      data[key].forEach((val) => params.append(key, val));
    } else if (typeof data[key] === "object" && data[key] !== null) {
      params.append(key, JSON.stringify(data[key]));
    } else if (data[key] !== undefined && data[key] !== null) {
      params.append(key, data[key]);
    }
  }

  return params.toString();
};
