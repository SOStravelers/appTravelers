export const random = () => {
  const randomQueryParam = Math.round(Math.random() * 100000);
  return randomQueryParam.toString();
};
