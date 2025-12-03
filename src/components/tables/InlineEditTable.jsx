import React, { useState } from 'react';
import { Check, X, Pencil, Trash2, GripVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import StatusSelect from '@/components/ui/StatusSelect';
import { showUndoToast } from '@/components/ui/UndoToast';

export default function InlineEditTable({
  data = [],
  columns = [],
  onUpdate,
  onDelete,
  onReorder,
  selectable = false,
  draggable = false,
  statusField
}) {
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);

  const startEditing = (rowId, field, value) => {
    setEditingCell({ rowId, field });
    setEditValue(value || '');
  };

  const saveEdit = (row) => {
    if (editingCell) {
      onUpdate?.(row.id, { [editingCell.field]: editValue });
      setEditingCell(null);
    }
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleDelete = (row) => {
    onDelete?.(row.id);
    showUndoToast('Item deleted', () => {
      // Restore logic would go here
    });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(data);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    onReorder?.(reordered);
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map(r => r.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const TableContent = () => (
    <table className="w-full">
      <thead>
        <tr className="border-b border-slate-200">
          {draggable && <th className="w-8" />}
          {selectable && (
            <th className="w-10 px-3 py-3">
              <Checkbox 
                checked={selectedRows.length === data.length && data.length > 0}
                onCheckedChange={toggleSelectAll}
              />
            </th>
          )}
          {columns.map(col => (
            <th key={col.key} className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              {col.label}
            </th>
          ))}
          <th className="w-20" />
        </tr>
      </thead>
      <tbody>
        {draggable ? (
          <Droppable droppableId="table">
            {(provided) => (
              <React.Fragment>
                <tr ref={provided.innerRef} {...provided.droppableProps} style={{ display: 'none' }} />
                {data.map((row, index) => (
                  <Draggable key={row.id} draggableId={String(row.id)} index={index}>
                    {(provided, snapshot) => (
                      <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "border-b border-slate-100 hover:bg-slate-50 transition-colors",
                          snapshot.isDragging && "bg-white shadow-lg"
                        )}
                      >
                        <td className="px-2" {...provided.dragHandleProps}>
                          <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
                        </td>
                        <TableRow row={row} />
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </React.Fragment>
            )}
          </Droppable>
        ) : (
          data.map((row) => (
            <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <TableRow row={row} />
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  const TableRow = ({ row }) => (
    <>
      {selectable && (
        <td className="px-3 py-3">
          <Checkbox 
            checked={selectedRows.includes(row.id)}
            onCheckedChange={() => toggleSelect(row.id)}
          />
        </td>
      )}
      {columns.map(col => {
        const isEditing = editingCell?.rowId === row.id && editingCell?.field === col.key;
        const value = row[col.key];

        if (col.key === statusField) {
          return (
            <td key={col.key} className="px-4 py-3">
              <StatusSelect 
                value={value} 
                onChange={(v) => onUpdate?.(row.id, { [col.key]: v })}
                statuses={col.statuses}
              />
            </td>
          );
        }

        return (
          <td key={col.key} className="px-4 py-3">
            {isEditing ? (
              <div className="flex items-center gap-1">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit(row);
                    if (e.key === 'Escape') cancelEdit();
                  }}
                  className="h-8 text-sm"
                  autoFocus
                />
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => saveEdit(row)}>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={cancelEdit}>
                  <X className="w-3.5 h-3.5 text-slate-400" />
                </Button>
              </div>
            ) : (
              <div 
                className={cn(
                  "group flex items-center gap-2",
                  col.editable && "cursor-pointer hover:bg-slate-100 rounded px-2 py-1 -mx-2"
                )}
                onClick={() => col.editable && startEditing(row.id, col.key, value)}
              >
                <span className={cn("text-sm", !value && "text-slate-400")}>
                  {col.render ? col.render(value, row) : (value || '-')}
                </span>
                {col.editable && (
                  <Pencil className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100" />
                )}
              </div>
            )}
          </td>
        );
      })}
      <td className="px-3 py-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-slate-400 hover:text-rose-500"
          onClick={() => handleDelete(row)}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </td>
    </>
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
      {draggable ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <TableContent />
        </DragDropContext>
      ) : (
        <TableContent />
      )}
      {data.length === 0 && (
        <div className="py-12 text-center text-slate-400">
          <p>No data available</p>
        </div>
      )}
    </div>
  );
}