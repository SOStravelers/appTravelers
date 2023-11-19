// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENTID_GOOGLE,
      clientSecret: process.env.CLIENTSECRET_GOOGLE,
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
    }),
    FacebookProvider({
      clientId: "707776344534781",
      clientSecret: "f1c9b9607d40ea9a3b67a3d2f3d01385",
    }),
  ],
  cookies: {
    secure: true, // Ajusta según el entorno
    sameSite: "strict",
  },
});
