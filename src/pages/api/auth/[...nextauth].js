// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

export default NextAuth({
  providers: [
    // GoogleProvider({
    //   clientId:
    //     "85474741679-0a1g2k2caj8d59iomohvo2ag6rqr9vlg.apps.googleusercontent.com",
    //   clientSecret: "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",
    //   scope: [
    //     "https://www.googleapis.com/auth/userinfo.profile",
    //     "https://www.googleapis.com/auth/userinfo.email",
    //   ],
    // }),
    FacebookProvider({
      clientId: "707776344534781",
      clientSecret: "f1c9b9607d40ea9a3b67a3d2f3d01385",
    }),
  ],
});
