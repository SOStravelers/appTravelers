export const fullName = (data) => {
  if (!data) return "";
  const { first, last } = data;
  return first + " " + (last ?? "");
};
