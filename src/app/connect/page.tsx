"use client";
import React, { useState } from "react";
export default function Connect() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {};
  const [connLink, setConLink]=useState('')
  return (
    <div className="flex h-screen">
      <div className="p-4 md:w-1/3 h-full bg-slate-500">
        <form className="text-black m-auto mt-20 " onSubmit={handleSubmit} method="post">
          <h1>GraphViz for Relational Databases</h1>
          <h3>Connection Link/ host</h3>
          <input type="text" />
          <h3>User</h3>
          <input type="text" />
          <h3>Password</h3>
          <input type="text" />
          <h3>database</h3>
          <input type="text" />
          </form>
      </div>
      <div className="hidden md:flex items-center justify-center w-auto h-full ">
        <img
          className="object-cover"
          src="http://cyborganthropology.com/wiki/images/4/4a/Aaron-Parecki-Facebook-Graph.jpg"
          alt=""
        />
      </div>
    </div>
  );
}
