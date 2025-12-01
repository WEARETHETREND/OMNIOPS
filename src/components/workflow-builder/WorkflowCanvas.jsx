import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import WorkflowNode from './WorkflowNode';
import WorkflowConnection from './WorkflowConnection';

export default function WorkflowCanvas({ 
  nodes, 
  connections, 
  onNodeMove, 
  onNodeSelect, 
  onConnect,
  onDeleteConnection,
  selectedNodeId,
  connectingFrom
}) {
  const canvasRef = useRef(null);
  const [isPanning, setIsPanning] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current || e.target.classList.contains('canvas-bg')) {
      onNodeSelect(null);
    }
  };

  const getNodeCenter = (node) => {
    return {
      x: node.position.x + 120,
      y: node.position.y + 40
    };
  };

  return (
    <div 
      ref={canvasRef}
      className="relative flex-1 bg-slate-900 overflow-hidden cursor-grab active:cursor-grabbing"
      onClick={handleCanvasClick}
    >
      {/* Grid background */}
      <div 
        className="canvas-bg absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`
        }}
      />

      {/* Connections SVG layer */}
      <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
          </marker>
        </defs>
        {connections.map((conn, i) => {
          const fromNode = nodes.find(n => n.id === conn.from);
          const toNode = nodes.find(n => n.id === conn.to);
          if (!fromNode || !toNode) return null;
          
          const from = getNodeCenter(fromNode);
          const to = getNodeCenter(toNode);
          
          return (
            <WorkflowConnection
              key={i}
              from={from}
              to={to}
              onDelete={() => onDeleteConnection(i)}
            />
          );
        })}
      </svg>

      {/* Nodes layer */}
      <div className="absolute inset-0" style={{ zIndex: 2 }}>
        {nodes.map(node => (
          <WorkflowNode
            key={node.id}
            node={node}
            isSelected={selectedNodeId === node.id}
            isConnecting={connectingFrom === node.id}
            onSelect={() => onNodeSelect(node.id)}
            onMove={(pos) => onNodeMove(node.id, pos)}
            onStartConnect={() => onConnect(node.id, null)}
            onEndConnect={() => connectingFrom && connectingFrom !== node.id && onConnect(connectingFrom, node.id)}
          />
        ))}
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex gap-2 z-10">
        <button
          onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
          className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700"
        >
          -
        </button>
        <span className="px-3 py-1 rounded-lg bg-slate-800 text-white text-sm">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(z => Math.min(2, z + 0.1))}
          className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700"
        >
          +
        </button>
      </div>
    </div>
  );
}