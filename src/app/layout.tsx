"use client";
import "./globals.css";
import { Poppins } from "next/font/google";
import Navigation from "@/components/navigation";
import { usePathname } from "next/navigation";

const poppins = Poppins({ subsets: ["latin"], weight: "400" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoginPage = usePathname() === "/login";
  const isRegisterPage = usePathname() === "/register";

  return (
    <html lang="en">
      <title>TalkUp Mental Health Chat</title>
      <body className={poppins.className}>
        {isLoginPage || isRegisterPage ? (
          children
        ) : (
          <>
            <Navigation>{children}</Navigation>
          </>
        )}
      </body>
    </html>
  );
}
