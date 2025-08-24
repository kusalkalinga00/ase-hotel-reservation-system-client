"use client";
import AddClerksForm from "@/components/ManageClerks/AddClerksForm";
import React from "react";

const ManageClerksView = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="text-xl font-semibold">Add New Clerks</div>
      <div>
        <AddClerksForm />
      </div>
    </div>
  );
};

export default ManageClerksView;
