import VisGraph, {
    GraphData,
    GraphEvents,
    Options,
  } from 'react-vis-graph-wrapper';
  
  
export default function TsGraph() {
    const graph: GraphData = {
      nodes: [
        { id: 1, label: 'Node 1', title: 'node 1 tootip text',color:'#fff' },
        { id: 2, label: 'Node 2', title: 'node 2 tootip text' },
        { id: 3, label: 'Node 3', title: 'node 3 tootip text' },
        { id: 4, label: 'Node 4', title: 'node 4 tootip text' },
        { id: 5, label: 'Node 5', title: 'node 5 tootip text' },
      ],
      edges: [
        {id:'12', from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 2, to: 4 },
        { from: 2, to: 5 },
      ],
    };
  
    const options: Options = {
      nodes: {
        shape: 'dot',
        size: 30,
        font: {
          size: 32,
          color: '#fff',
        },
        borderWidth: 2,
        shadow: true,
      },
      layout: {
        // hierarchical: true,
      },
      edges: {
        color: '#fff',
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
      style={{width:'100%',height:'100%' ,zIndex:1}}
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