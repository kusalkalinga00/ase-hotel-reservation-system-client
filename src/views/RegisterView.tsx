import RegisterForm from "@/components/register/RegisterForm";
import React from "react";

const RegisterView = () => {
  return (
    <div className="h-screen flex flex-col  items-center">
      <div className="flex flex-col items-center mt-20 w-full max-w-md p-6 rounded-lg h-screen">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterView;
