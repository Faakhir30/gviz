"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { RotatingLines } from 'react-loader-spinner'

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    
    router.push("/connect");
  }, []);
  return (
    <>
    <div className="bg-primary-medium-light flex justify-center items-center h-screen">
        <RotatingLines strokeColor="#161A30"/>
      
      </div>
      </>
  );
}
