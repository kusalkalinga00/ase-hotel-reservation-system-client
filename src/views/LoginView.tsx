import LoginForm from "@/components/login/LoginForm";
import { Card } from "@/components/ui/card";
import React from "react";

const LoginView = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-300 via-slate-200 to-slate-300 flex justify-center flex-col items-center overflow-hidden">
      <div>
        <h1 className="text-4xl font-bold text-center text-gray-800 mt-10">
          Welcome
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Please enter your credentials to login
        </p>
      </div>

      <div className="flex flex-col items-center mt-5 w-full max-w-md p-6 rounded-lg ">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginView;
