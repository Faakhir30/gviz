import VisGraph, {
  GraphData,
  GraphEvents,
  Options,
} from "react-vis-graph-wrapper";

export default function TsGraph({
  nodes,
  edges,
  setCurOutput,
}: {
  nodes: any;
  edges: any;
  setCurOutput: any;
}) {
  const graph: GraphData = {
    nodes: nodes,
    edges: edges,
  };
  const options: Options = {
    nodes: {
      shape: "dot",
      size: 30,
      font: {
        size: 16,
        color: "#fff",
      },
      borderWidth: 2,
      shadow: true,
    },
    layout: {
      // hierarchical: true,
    },
    edges: {
      color: "#fff",
    },
    autoResize: true,
  };

  const events: GraphEvents = {
    select: (event: any) => {
      const data = event;
      const edgedata = data.edges
        .map((edge: any) =>{
          edge=graph.edges.find((e) => e.id === edge)
          return (JSON.stringify(nodes.find((node:any)=>node.id=edge.from)) + " -> " + JSON.stringify(nodes.find((node:any)=>node.id=edge.to)))
        }) 
        .filter((e: any) => e);
      setCurOutput(`Selected nodes: ${data.nodes}\nSelected edges: ${edgedata}`);
    },
  };
  return (
    <VisGraph
      style={{ width: "100%", height: "100%", zIndex: 1 , border: "1px solid #fff"}}
      graph={graph}
      options={options}
      events={events}
      getNetwork={(network: any) => {
        //  if you want access to vis.js network api you can set the state in a parent component using this property
        // console.log(network);
      }}
    />
  );
}
