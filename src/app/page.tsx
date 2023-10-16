'use client'
import React, { useEffect } from "react";
// import MyGraph from "./(_components_)/graph";
// import dynamic from 'next/dynamic'
import TsGraph from "./(_components_)/tsgraph";
// const NoSSR = dynamic(() => import('./(_components_)/graph'), { ssr: false })

export default function Home() {
    return (
    <main className="flex bg-white min-h-screen flex-col items-center justify-between">
      <div id="mynetwork" style={{ width: "100%", height: "100vh" }} />
      {/* <NoSSR /> */}
      <TsGraph />
    </main>
  );
}
