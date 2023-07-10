"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import WhiteLogo from "@/components/icons/whiteLogo";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Toast } from "@/components/Toast";
import axios from "axios";

const Register: React.FC = () => {
  const defaultValue = "Anonymous#";
  const points = 0;
  const rating = 0;
  const tier = 0;
  const [username, setUsername] = useState(defaultValue);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [buttonClass, setButtonClass] = useState(
    "bg-gray-400 text-gray-600 font-bold p-3 rounded-full w-full"
  );
  const [emailInputClass, setEmailInputClass] = useState(
    "border-2 border-[#656ED3] h-12 rounded-full p-4"
  );
  const [passwordInputClass, setPasswordInputClass] = useState(
    "border-2 border-[#656ED3] h-12 rounded-full p-4"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [usernameInputClass, setUsernameInputClass] = useState(
    "border-2 border-[#656ED3] h-12 rounded-full p-4"
  );

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const hashPassword = async (password: string) => {
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashedPassword;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const hashedPassword = await hashPassword(password);

    const userData = {
      username,
      email,
      password: hashedPassword,
      points,
      rating,
      tier
    };

    try {
      await axios.post("http://localhost:3000/api/auth/register", userData);
      setToastMessage('Data submitted successfully!');
      setToastVisible(true);
    
      setUsername("Anonymous#");
      setEmail("");
      setPassword("");
      setUsernameInputClass("border-2 border-[#656ED3] h-12 rounded-full p-4");
      setEmailInputClass("border-2 border-[#656ED3] h-12 rounded-full p-4");
      setPasswordInputClass("border-2 border-[#656ED3] h-12 rounded-full p-4");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if(error.response.data.field === "username"){
          setUsernameInputClass("border-2 border-red-500 h-12 rounded-full p-4");
        }else if(error.response.data.field === "email"){
          setEmailInputClass("border-2 border-red-500 h-12 rounded-full p-4");
        }
        setToastMessage(error.response.data.error);
        console.log(error.response.data.error);
        setToastVisible(true);
      }
    }
    
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    // Check that the new value starts with "Anonymous#" and that the rest is a number
    if (
      newValue.startsWith(defaultValue) &&
      !isNaN(Number(newValue.substring(defaultValue.length)))
    ) {
      setUsername(newValue);
    }
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
  };

  useEffect(() => {
    if (
      usernameInputClass ===
        "border-2 border-green-500 h-12 rounded-full p-4" &&
      emailInputClass === "border-2 border-green-500 h-12 rounded-full p-4" &&
      (passwordInputClass ===
        "border-2 border-green-500 h-12 rounded-full p-4" ||
        passwordInputClass ===
          "border-2 border-yellow-500 h-12 rounded-full p-4")
    ) {
      setButtonClass(
        "bg-[#0D90FF] text-xl text-white font-bold p-3 rounded-full w-full"
      );
    } else {
      setButtonClass(
        "bg-gray-300 text-xl text-gray-400 font-bold p-3 rounded-full w-full"
      );
    }
  }, [usernameInputClass, emailInputClass, passwordInputClass]);

  useEffect(() => {
    if (username == "Anonymous#") {
      setUsernameInputClass("border-2 border-[#656ED3] h-12 rounded-full p-4");
    } else if (username.length <= 14) {
      setUsernameInputClass("border-2 border-red-500 h-12 rounded-full p-4");
    } else {
      setUsernameInputClass("border-2 border-green-500 h-12 rounded-full p-4");
    }
  }, [username]);

  // Update email input class every time email changes
  useEffect(() => {
    // More complex email validation regex
    const emailValidationRegex =
      /^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;

    if (email === "") {
      setEmailInputClass("border-2 border-[#656ED3] h-12 rounded-full p-4");
    } else if (!emailValidationRegex.test(email)) {
      setEmailInputClass("border-2 border-red-500 h-12 rounded-full p-4");
    } else {
      setEmailInputClass("border-2 border-green-500 h-12 rounded-full p-4");
    }
  }, [email]);

  // Update password input class every time password changes
  useEffect(() => {
    if (password.length == 0) {
      setPasswordInputClass("border-2 border-[#656ED3] h-12 rounded-full p-4");
    } else if (password.length < 8) {
      setPasswordInputClass("border-2 border-red-500 h-12 rounded-full p-4");
    } else if (password.length > 25) {
      setPasswordInputClass("border-2 border-green-500 h-12 rounded-full p-4");
    } else if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      setPasswordInputClass("border-2 border-yellow-500 h-12 rounded-full p-4");
    } else if (
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/\d/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      setPasswordInputClass("border-2 border-yellow-500 h-12 rounded-full p-4");
    } else {
      setPasswordInputClass("border-2 border-green-500 h-12 rounded-full p-4");
    }
  }, [password]);

  return (
    <section className="flex justify-between">
      <Toast message={toastMessage} visible={toastVisible} />
      <div className="bg-white flex flex-col items-center justify-center h-screen flex-grow space-y-12">
        <div className="text-xl font-bold">Let&apos;s Create Account!</div>
        <form
          className="flex flex-col w-[500px] space-y-3"
          onSubmit={handleSubmit}
        >
          <div className="text-xl">Username (number only):</div>
          <input
            className={`${usernameInputClass} focus:outline-none`}
            value={username}
            onChange={handleInputChange}
          />
          <div className="text-xl">Email:</div>
          <input
            className={`${emailInputClass} focus:outline-none`}
            value={email}
            onChange={handleEmailChange}
            placeholder="Input your email (example@mail.com)"
          />
          <div className="text-xl">Password:</div>
          <div
            className={`${passwordInputClass} relative w-full pr-12 items-center flex`}
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
              Register
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

export default Register;
