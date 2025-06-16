"use client";
import RegisterForm from "@/components/register/RegisterForm";
import React from "react";
import { Suspense } from "react";

const RegisterView = () => {
  return (
    <Suspense>
      <div className="min-h-screen bg-gradient-to-br from-slate-300 via-slate-200 to-slate-300 flex justify-center  items-center overflow-hidden  flex-col  p-10">
        <div>
          <h1 className="text-4xl font-bold text-center text-gray-800 mt-10">
            Create an Account
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Please enter your details to create an account
          </p>
        </div>

        <div className="flex flex-col items-center  w-full max-w-md p-6 rounded-lg ">
          <RegisterForm />
        </div>
      </div>
    </Suspense>
  );
};

export default RegisterView;
