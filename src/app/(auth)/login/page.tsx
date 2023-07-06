"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import WhiteLogo from "@/components/icons/whiteLogo";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Toast } from "@/components/Toast";
import { useSession, signIn } from "next-auth/react";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorStatus, setError] = useState(false);
  const { data: session, status: loading } = useSession();
  const [buttonClass, setButtonClass] = useState(
    "bg-gray-400 text-gray-600 font-bold p-3 rounded-full w-full"
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });
      if (!result?.ok) {
        throw new Error("Invalid username or password");
      }
    } catch (error: any) {
      setToastMessage(error.message);
      setToastVisible(true);
      setError(true);
    }
  };

  useEffect(() => {
    if (username != "" && password != "") {
      setButtonClass(
        "bg-[#0D90FF] text-xl text-white font-bold p-3 rounded-full w-full"
      );
    } else {
      setButtonClass(
        "bg-gray-300 text-xl text-gray-400 font-bold p-3 rounded-full w-full"
      );
    }
  }, [username, password]);

  // redirect user if already logged in
  useEffect(() => {
    if (session) {
      window.location.href = "/"; // or wherever you want to redirect after login
    }
  }, [session]);
  return (
    <section className="flex justify-between">
      <Toast
        message={toastMessage}
        visible={toastVisible}
        error={errorStatus}
      />

      <div className="bg-white flex flex-col items-center justify-center h-screen flex-grow space-y-12">
        <div className="text-xl font-bold">Let&apos;s Create Account!</div>
        <form
          className="flex flex-col w-[500px] space-y-3"
          onSubmit={handleSubmit}
        >
          <div className="text-xl">Username:</div>
          <input
            className="border-2 border-[#656ED3] h-12 rounded-full p-4"
            value={username}
            onChange={handleInputChange}
            placeholder="Input your username"
          />
          <div className="text-xl">Password:</div>
          <div
            className={
              "border-2 border-[#656ED3] h-12 rounded-full p-4 relative w-full pr-12 items-center flex"
            }
          >
            <input
              type={showPassword ? "text" : "password"}
              className={`focus:outline-none w-full`}
              value={password}
              onChange={handlePasswordChange}
              placeholder="Input your password"
            />
            <div
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-2/4 cursor-pointer"
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </div>
          </div>

          <div className="pt-12">
            <button
              type="submit"
              className={buttonClass}
              disabled={
                buttonClass ===
                "bg-gray-400 text-gray-600 font-bold p-3 rounded-full w-full"
              }
            >
              Login
            </button>
          </div>
        </form>
      </div>
      <div className="bg-[#0D90FF] flex flex-col p-5 items-center h-screen justify-center w-[750px]">
        <WhiteLogo size={150} />
        <p className="text-[120px] text-white font-bold">TalkUp.</p>
      </div>
    </section>
  );
};

export default Login;
