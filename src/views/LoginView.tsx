import LoginForm from "@/components/login/LoginForm";
import { Card } from "@/components/ui/card";
import React from "react";

const LoginView = () => {
  return (
    <div className="h-screen flex flex-col  items-center">
      <div className="flex flex-col items-center mt-20 w-full max-w-md p-6 rounded-lg  h-screen">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginView;
