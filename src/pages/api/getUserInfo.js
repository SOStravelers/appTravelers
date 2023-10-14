import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  console.log("entrando");
  const session = await getSession({ req });

  if (session) {
    const userInfo = session.user;
    res.status(200).json(userInfo);
  } else {
    res.status(401).json({ message: "No autorizado" });
  }
}
