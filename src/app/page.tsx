"use client";
import React, { useEffect } from "react";
import TsGraph from "./(_components_)/tsgraph";

export default function Home() {
  function apicalls() {
    async function getHello() {
      const resp=await fetch("/api/getData", 
      )
      const respjson=await resp.json()
      console.log(respjson)
    }
    getHello();
  }
  apicalls();
  return (
    <main className="flex bg-black h-screen p-0 flex-col items-center justify-between">
      <TsGraph />
    </main>
  );
}
