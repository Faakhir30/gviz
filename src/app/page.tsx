"use client";
import React, { useEffect, useState } from "react";
import TsGraph from "./(_components_)/tsgraph";
import { query } from "./lib/db";
import { generateColors } from "./utills/colors";

export default function Home() {
  const [curNodes, setCurNodes] = useState<any[]>([]);
  const [curEdges, setCurEdges] = useState<any[]>([]);
  async function apicalls() {
    const data = await (
      await fetch("http://localhost:3000/api/getData")
    ).json();
    setCurNodes(data.nodes);
    setCurEdges(data.edges);
  }
  useEffect(() => {
    apicalls();
  }, []);
  console.log(curEdges, curNodes)
  return (
    <main className="flex bg-black h-screen p-0 flex-col items-center justify-between">
      <TsGraph nodes={curNodes} edges={curEdges} />
    </main>
  );
}
