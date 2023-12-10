'use client';
import React, { useEffect, useState } from 'react'
import { query } from '../lib/db';

const page = () => {
    const [curOutput, setCurOutput] = useState("");
    useEffect(() => {
        const a=async() => {
                const res=await query({query:"show tables"});
            setCurOutput(JSON.stringify(res)    )
        }
        a()
    }
    , [])
  return (
    <div>
        
    </div>
  )
}

export default page
