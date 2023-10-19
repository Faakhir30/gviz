import React, { createContext, useContext, useState } from "react";
interface GraphData {
  nodes?: any[];
  edges?: any[];
  setNodes?: React.Dispatch<React.SetStateAction<any[]>>;
  setEdges?: React.Dispatch<React.SetStateAction<any[]>>;
}
export const grahContext = createContext<GraphData>({});
export function graphDataProvider({ children }: { children: React.ReactNode }) {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);

  return (
    <grahContext.Provider value={{ nodes, edges, setNodes, setEdges }}>
      {children}
    </grahContext.Provider>
  );
}

export function useGraphData() {
  const context = useContext(grahContext);
  if (!context) {
    throw new Error("Context not defined");
  }
  return context;
}
