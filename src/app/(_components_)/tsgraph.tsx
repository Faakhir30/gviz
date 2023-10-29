import VisGraph, {
  GraphData,
  GraphEvents,
  Options,
} from "react-vis-graph-wrapper";

export default function TsGraph({ nodes,edges }: { nodes: any,edges:any }) {
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
  };

  const events: GraphEvents = {
    select: (event: any) => {
      const { nodes, edges } = event;
      // console.log(nodes, edges);
    },
  };
  return (
    <VisGraph
      style={{ width: "100%", height: "100%", zIndex: 1 }}
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
