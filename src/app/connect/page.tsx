"use client";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { delay } from "../utills/delay";
import { SiGraphql } from "react-icons/si";

export default function Connect() {
  const [data, setData] = React.useState({
    host: "",
    database: "",
    user: "",
    password: "",
  });
  const router = useRouter();
  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("/api/runQuery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: "show tables", poolInfo:data }),
    });
    const resdata = await res.json();
    console.log("resData: ",resdata)
    if (!resdata || !Array.isArray(resdata.data)) {
      toast.error(resdata.errorMsg||"Error connecting to database");
      return;
    }
    toast.success("Connected!");
    await delay(1000);
    router.push("/home");
  };
  return (
    <div className=" bg-primary-medium-light h-screen">
      {/* form for database connection */}
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-lg">
          <div className="flex font-extrabold text-4xl text-gray-800">
            <SiGraphql className="m-2" />
            <h1>SQLViz</h1>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Connect to Database
          </h1>
          <form
            onSubmit={handleSubmit}
           className="flex flex-col items-center justify-center space-y-4 mt-4 text-primary-medium-dark">
            <input
              className="w-64 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-medium"
              type="text"
              required
              placeholder="Host"
              onChange={(e) => setData({ ...data, host: e.target.value })}
            />
            <input
              className="w-64 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-medium"
              type="text"
              required
              placeholder="Database"
              onChange={(e) => setData({ ...data, database: e.target.value })}
            />
            <input
              className="w-64 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-medium"
              type="text"
              placeholder="User"
              required
              onChange={(e) => setData({ ...data, user: e.target.value })}
            />
            <input
              className="w-64 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-medium"
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <button
              className="w-64 p-2 bg-primary-dark text-white rounded-lg focus:outline-none focus:bg-primary-medium-dark"
              type="submit"
            >
              Connect
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
