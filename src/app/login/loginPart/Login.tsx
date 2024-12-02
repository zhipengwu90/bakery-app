"use client";
import React, { useState, useEffect,Suspense } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { login } from "./actions";
import { useSearchParams } from "next/navigation";

type Props = {};

const Login = (props: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      console.log(error);
      setErrorMessage(error);
    }
  }, [searchParams]);
  const loginHandler = () => {
    if (email.trim() === "" || password.trim() === "") {
      console.log("Email and password cannot be empty.");
      return;
    }
    login(email, password);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      loginHandler();
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="border border-1 bg-white flex flex-col gap-3 justify-around items-center rounded-lg w-1/2 h-1/2 lg:w-3/4 lg:h-3/4  ">
        <div className="text-dark text-xl font-bold"> Admin Login </div>
        <div className=" flex flex-col gap-3 w-full justify-center items-center ">
          <TextField
            label="Email"
            color="primary"
            type="email"
            placeholder="Enter your email"
            className="w-1/2 lg:w-4/5  z-0"
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <TextField
            label="Password"
            type="password"
            placeholder="Enter your password"
            color="primary"
            className="w-1/2 lg:w-4/5 z-0 "
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
          />

          {errorMessage && (
            <div className="text-red-500 text-sm font-bold">{errorMessage}</div>
          )}
        </div>

        <Button
          disabled={email === "" || password === ""}
          onClick={loginHandler}
          variant="contained"
          className="z-0"
        >
          Log in
        </Button>
      </div>
    </div>
  );
};

const LoginPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Login />
  </Suspense>
);

export default LoginPage;
