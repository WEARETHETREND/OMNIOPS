import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Pin, PinOff, X, Plus, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const STORAGE_KEY = 'omniops-dashboard-widgets';

export default function DraggableWidgets({ 
  widgets, 
  children,
  onLayoutChange 
}) {
  const [layout, setLayout] = useState([]);
  const [hiddenWidgets, setHiddenWidgets] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { layout: savedLayout, hidden } = JSON.parse(saved);
      setLayout(savedLayout || widgets.map(w => w.id));
      setHiddenWidgets(hidden || []);
    } else {
      setLayout(widgets.map(w => w.id));
    }
  }, [widgets]);

  const saveLayout = (newLayout, newHidden) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
      layout: newLayout, 
      hidden: newHidden 
    }));
    onLayoutChange?.({ layout: newLayout, hidden: newHidden });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newLayout = Array.from(layout);
    const [removed] = newLayout.splice(result.source.index, 1);
    newLayout.splice(result.destination.index, 0, removed);

    setLayout(newLayout);
    saveLayout(newLayout, hiddenWidgets);
  };

  const toggleWidget = (widgetId) => {
    const newHidden = hiddenWidgets.includes(widgetId)
      ? hiddenWidgets.filter(id => id !== widgetId)
      : [...hiddenWidgets, widgetId];
    
    setHiddenWidgets(newHidden);
    saveLayout(layout, newHidden);
  };

  const resetLayout = () => {
    const defaultLayout = widgets.map(w => w.id);
    setLayout(defaultLayout);
    setHiddenWidgets([]);
    saveLayout(defaultLayout, []);
  };

  const visibleWidgets = layout
    .filter(id => !hiddenWidgets.includes(id))
    .map(id => widgets.find(w => w.id === id))
    .filter(Boolean);

  const availableWidgets = widgets.filter(w => hiddenWidgets.includes(w.id));

  return (
    <div className="space-y-4">
      {/* Widget Controls */}
      <div className="flex items-center justify-end gap-2">
        {availableWidgets.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Widget
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {availableWidgets.map(widget => (
                <DropdownMenuItem key={widget.id} onClick={() => toggleWidget(widget.id)}>
                  {widget.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Settings2 className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={resetLayout}>
              Reset to Default
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Draggable Widgets */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="widgets">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {visibleWidgets.map((widget, index) => (
                <Draggable key={widget.id} draggableId={widget.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        "relative group",
                        snapshot.isDragging && "z-50"
                      )}
                    >
                      {/* Drag Handle & Controls */}
                      <div className="absolute -left-8 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                        <div
                          {...provided.dragHandleProps}
                          className="p-1 bg-white border border-slate-200 rounded cursor-grab hover:bg-slate-50"
                        >
                          <GripVertical className="w-4 h-4 text-slate-400" />
                        </div>
                        <button
                          onClick={() => toggleWidget(widget.id)}
                          className="p-1 bg-white border border-slate-200 rounded hover:bg-slate-50"
                        >
                          <X className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>

                      {/* Widget Content */}
                      <div className={cn(
                        "transition-shadow",
                        snapshot.isDragging && "shadow-2xl ring-2 ring-slate-200"
                      )}>
                        {children(widget)}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}