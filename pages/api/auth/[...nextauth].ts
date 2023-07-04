import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/user";
import { connectMongoDB } from "@/lib/MongoConnect";
import { hashPassword, comparePassword } from "@/lib/hashHelper";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<"username" | "password", string> | undefined, req: any) {
        if (!credentials) {
          throw new Error("Missing credentials");
        }
      
        await connectMongoDB();
      
        const user = await User.findOne({ username: credentials.username });
        if (!user) {
          throw new Error("No user found");
        }
      
        const isValid = await comparePassword(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }
      
        return { id: user._id.toString(), username: user.username, email: user.email };
      }
    }),
  ],
});
