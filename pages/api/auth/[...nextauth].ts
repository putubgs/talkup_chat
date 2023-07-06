import NextAuth from "next-auth";
import { User as NextAuthUser, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/user";
import { connectMongoDB } from "@/lib/MongoConnect";
import { hashPassword, comparePassword } from "@/lib/hashHelper";

interface CustomUser extends NextAuthUser {
  username: string;
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"username" | "password", string> | undefined,
        req: any
      ) {
        if (!credentials) {
          throw new Error("Missing credentials");
        }

        await connectMongoDB();

        const user = await User.findOne({ username: credentials.username });
        if (!user) {
          throw new Error("No user found");
        }

        const isValid = await comparePassword(
          credentials.password,
          user.password
        );
        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        token.id = user.id;
        token.username = (user as CustomUser).username;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = { ...(token as JWT & CustomUser) };
      return session;
    },
  },
});
