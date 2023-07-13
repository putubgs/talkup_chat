"use client";
import "./globals.css";
import { Poppins } from "next/font/google";
import Navigation from "@/components/navigation";
import { usePathname } from "next/navigation";
import { NextAuthProvider } from "./providers";

const poppins = Poppins({ subsets: ["latin"], weight: "400" });

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  const isLoginPage = usePathname() === "/login";
  const isRegisterPage = usePathname() === "/register";

  return (
    <html lang="en">
      <title>TalkUp Mental Health Chat</title>
      <body className={poppins.className}>
        <NextAuthProvider session={session}>
          {isLoginPage || isRegisterPage ? (
            children
          ) : (
            <>
              <Navigation>{children}</Navigation>
            </>
          )}
        </NextAuthProvider>
      </body>
    </html>
  );
}
