export const validationImg = async (imgUrl) => {
  try {
    if (!imgUrl.includes("undefined")) {
      const res = await fetch(imgUrl);
      if (res.ok) {
        return true;
      } else {
        return false;
      }
    } else {
      return;
    }
  } catch {
    return false;
  }
};
