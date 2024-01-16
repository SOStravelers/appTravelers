export const validationImg = async (imgUrl) => {
  try {
    const res = await fetch(imgUrl);
    if (res.ok) {
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
};
