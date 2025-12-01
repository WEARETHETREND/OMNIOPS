import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

import WorkflowToolbar from '@/components/workflow-builder/WorkflowToolbar';
import WorkflowSidebar from '@/components/workflow-builder/WorkflowSidebar';
import WorkflowCanvas from '@/components/workflow-builder/WorkflowCanvas';
import WorkflowProperties from '@/components/workflow-builder/WorkflowProperties';

export default function WorkflowBuilder() {
  const queryClient = useQueryClient();
  
  const [workflowName, setWorkflowName] = useState('New Workflow');
  const [nodes, setNodes] = useState([
    {
      id: 'start-1',
      type: 'trigger',
      name: 'Start',
      position: { x: 100, y: 200 },
      config: { description: 'Workflow starts here' }
    }
  ]);
  const [connections, setConnections] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  const urlParams = new URLSearchParams(window.location.search);
  const workflowId = urlParams.get('id');

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (workflowId) {
        return base44.entities.Workflow.update(workflowId, data);
      }
      return base44.entities.Workflow.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast.success('Workflow saved successfully');
    },
    onError: () => {
      toast.error('Failed to save workflow');
    }
  });

  const addNode = useCallback((nodeType) => {
    const newNode = {
      id: `${nodeType.type}-${Date.now()}`,
      type: nodeType.type,
      name: nodeType.name,
      position: { x: 300 + Math.random() * 200, y: 150 + Math.random() * 200 },
      config: {}
    };
    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
  }, []);

  const moveNode = useCallback((nodeId, position) => {
    setNodes(prev => prev.map(n => 
      n.id === nodeId ? { ...n, position } : n
    ));
  }, []);

  const updateNode = useCallback((updatedNode) => {
    setNodes(prev => prev.map(n => 
      n.id === updatedNode.id ? updatedNode : n
    ));
  }, []);

  const deleteNode = useCallback((nodeId) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setConnections(prev => prev.filter(c => c.from !== nodeId && c.to !== nodeId));
    setSelectedNodeId(null);
  }, []);

  const handleConnect = useCallback((fromId, toId) => {
    if (toId === null) {
      setConnectingFrom(fromId);
    } else if (fromId && fromId !== toId) {
      // Check if connection already exists
      const exists = connections.some(c => c.from === fromId && c.to === toId);
      if (!exists) {
        setConnections(prev => [...prev, { from: fromId, to: toId }]);
      }
      setConnectingFrom(null);
    }
  }, [connections]);

  const deleteConnection = useCallback((index) => {
    setConnections(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSave = () => {
    const workflowData = {
      name: workflowName,
      description: `Visual workflow with ${nodes.length} nodes`,
      department: 'operations',
      trigger_type: nodes.find(n => n.type === 'schedule') ? 'scheduled' : 
                    nodes.find(n => n.type === 'webhook') ? 'api_triggered' : 'manual',
      status: 'draft',
      steps: nodes.map(node => ({
        name: node.name,
        action: node.type,
        config: { ...node.config, position: node.position }
      }))
    };
    saveMutation.mutate(workflowData);
  };

  const handleRun = () => {
    toast.success('Workflow execution started');
  };

  const handleExport = () => {
    const data = { name: workflowName, nodes, connections };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflowName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Workflow exported');
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-4">
        <Link to={createPageUrl('Workflows')}>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <WorkflowToolbar
            workflowName={workflowName}
            onNameChange={setWorkflowName}
            onSave={handleSave}
            onRun={handleRun}
            onExport={handleExport}
            isSaving={saveMutation.isPending}
            isRunning={false}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            onUndo={() => {}}
            onRedo={() => {}}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <WorkflowSidebar onAddNode={addNode} />
        
        <WorkflowCanvas
          nodes={nodes}
          connections={connections}
          selectedNodeId={selectedNodeId}
          connectingFrom={connectingFrom}
          onNodeMove={moveNode}
          onNodeSelect={setSelectedNodeId}
          onConnect={handleConnect}
          onDeleteConnection={deleteConnection}
        />
        
        <WorkflowProperties
          node={selectedNode}
          onUpdate={updateNode}
          onDelete={deleteNode}
          onClose={() => setSelectedNodeId(null)}
        />
      </div>
    </div>
  );
}