import React, { useRef } from 'react';
import { Zap } from 'lucide-react';
import WorkflowNode from './WorkflowNode';
import WorkflowConnection from './WorkflowConnection';

export default function WorkflowCanvas({
  workflow,
  selectedNode,
  connectingFrom,
  onSelectNode,
  onMoveNode,
  onStartConnection,
  onEndConnection,
  onAddNode
}) {
  const canvasRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const nodeTypeData = e.dataTransfer.getData('nodeType');
    if (nodeTypeData) {
      const nodeType = JSON.parse(nodeTypeData);
      const rect = canvasRef.current.getBoundingClientRect();
      const position = {
        x: e.clientX - rect.left - 120,
        y: e.clientY - rect.top - 40
      };
      onAddNode(nodeType, position);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      ref={canvasRef}
      className="flex-1 relative overflow-hidden bg-slate-950"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(71, 85, 105, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(71, 85, 105, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px'
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => onSelectNode(null)}
    >
      {workflow.nodes.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <Zap className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-400 mb-2">Build Your Workflow</h3>
            <p className="text-slate-600">Drag components from the sidebar or click them to add</p>
          </div>
        </div>
      ) : (
        <>
          {/* Render connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {workflow.connections.map((connection) => {
              const fromNode = workflow.nodes.find(n => n.id === connection.from);
              const toNode = workflow.nodes.find(n => n.id === connection.to);
              if (!fromNode || !toNode) return null;

              return (
                <WorkflowConnection
                  key={connection.id}
                  from={{ x: fromNode.position.x + 240, y: fromNode.position.y + 40 }}
                  to={{ x: toNode.position.x, y: toNode.position.y + 40 }}
                />
              );
            })}
          </svg>

          {/* Render nodes */}
          {workflow.nodes.map((node) => (
            <WorkflowNode
              key={node.id}
              node={node}
              isSelected={selectedNode?.id === node.id}
              isConnecting={connectingFrom === node.id}
              onSelect={() => onSelectNode(node)}
              onMove={(position) => onMoveNode(node.id, position)}
              onStartConnect={() => onStartConnection(node.id)}
              onEndConnect={() => onEndConnection(node.id)}
            />
          ))}
        </>
      )}
    </div>
  );
}