import React, { useState, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Save, Play, X } from 'lucide-react';
import WorkflowSidebar from '@/components/workflow-builder/WorkflowSidebar';
import WorkflowCanvas from '@/components/workflow-builder/WorkflowCanvas';
import WorkflowProperties from '@/components/workflow-builder/WorkflowProperties';
import WorkflowExecutionPanel from '@/components/workflow-builder/WorkflowExecutionPanel';

export default function WorkflowBuilder() {
  const [workflow, setWorkflow] = useState({
    name: 'New Workflow',
    description: '',
    nodes: [],
    connections: [],
    trigger_type: 'manual'
  });
  const [selectedNode, setSelectedNode] = useState(null);
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [showExecution, setShowExecution] = useState(false);
  const [executionData, setExecutionData] = useState(null);
  const queryClient = useQueryClient();

  const saveWorkflowMutation = useMutation({
    mutationFn: (data) => base44.entities.Workflow.create({
      name: data.name,
      description: data.description,
      department: 'operations',
      trigger_type: data.trigger_type,
      status: 'draft',
      steps: data.nodes.map((node, idx) => ({
        name: node.name,
        action: node.type,
        config: node.config
      }))
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['workflows']);
      toast.success('Workflow saved successfully');
    },
    onError: () => {
      toast.error('Failed to save workflow');
    }
  });

  const handleAddNode = useCallback((nodeType, position) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: nodeType.type,
      name: nodeType.name,
      position: position || {
        x: 100 + workflow.nodes.length * 50,
        y: 100 + workflow.nodes.length * 30
      },
      config: {}
    };
    setWorkflow({ ...workflow, nodes: [...workflow.nodes, newNode] });
    setSelectedNode(newNode);
  }, [workflow]);

  const handleMoveNode = useCallback((nodeId, newPosition) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(node =>
        node.id === nodeId ? { ...node, position: newPosition } : node
      )
    }));
  }, []);

  const handleUpdateNode = useCallback((nodeId, updates) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(node =>
        node.id === nodeId ? { ...node, ...updates } : node
      )
    }));
  }, []);

  const handleDeleteNode = useCallback((nodeId) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.filter(n => n.id !== nodeId),
      connections: prev.connections.filter(c => c.from !== nodeId && c.to !== nodeId)
    }));
    setSelectedNode(null);
  }, []);

  const handleStartConnection = useCallback((nodeId) => {
    setConnectingFrom(nodeId);
  }, []);

  const handleEndConnection = useCallback((nodeId) => {
    if (connectingFrom && connectingFrom !== nodeId) {
      const newConnection = {
        id: `conn-${Date.now()}`,
        from: connectingFrom,
        to: nodeId
      };
      setWorkflow(prev => ({
        ...prev,
        connections: [...prev.connections, newConnection]
      }));
    }
    setConnectingFrom(null);
  }, [connectingFrom]);

  const handleTestRun = () => {
    setExecutionData({
      status: 'running',
      steps: workflow.nodes.map((node, idx) => ({
        nodeId: node.id,
        name: node.name,
        status: idx === 0 ? 'running' : 'pending',
        startTime: idx === 0 ? new Date().toISOString() : null
      }))
    });
    setShowExecution(true);

    // Simulate execution
    workflow.nodes.forEach((node, idx) => {
      setTimeout(() => {
        setExecutionData(prev => ({
          ...prev,
          steps: prev.steps.map((step, i) => {
            if (i === idx) {
              return { ...step, status: 'completed', endTime: new Date().toISOString() };
            } else if (i === idx + 1) {
              return { ...step, status: 'running', startTime: new Date().toISOString() };
            }
            return step;
          })
        }));
      }, (idx + 1) * 2000);
    });
  };

  return (
    <div className="fixed inset-0 flex bg-slate-950">
      {/* Sidebar */}
      <WorkflowSidebar onAddNode={handleAddNode} />

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <Input
              value={workflow.name}
              onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleTestRun}
              className="border-slate-700 hover:bg-slate-800"
            >
              <Play className="w-4 h-4 mr-2" />
              Test Run
            </Button>
            <Button
              onClick={() => saveWorkflowMutation.mutate(workflow)}
              disabled={saveWorkflowMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {saveWorkflowMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex">
          <WorkflowCanvas
            workflow={workflow}
            selectedNode={selectedNode}
            connectingFrom={connectingFrom}
            onSelectNode={setSelectedNode}
            onMoveNode={handleMoveNode}
            onStartConnection={handleStartConnection}
            onEndConnection={handleEndConnection}
            onAddNode={handleAddNode}
          />

          {/* Properties Panel */}
          {selectedNode && (
            <WorkflowProperties
              node={selectedNode}
              onUpdate={(updates) => handleUpdateNode(selectedNode.id, updates)}
              onDelete={() => handleDeleteNode(selectedNode.id)}
              onClose={() => setSelectedNode(null)}
            />
          )}
        </div>
      </div>

      {/* Execution Panel */}
      {showExecution && (
        <div className="fixed inset-y-0 right-0 w-96 bg-slate-900 border-l border-slate-800 z-50">
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <h3 className="font-semibold text-white">Execution</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowExecution(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <WorkflowExecutionPanel execution={executionData} />
        </div>
      )}
    </div>
  );
}