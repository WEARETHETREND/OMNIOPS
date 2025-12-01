import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function WorkflowConnection({ from, to, onDelete }) {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate control points for a smooth bezier curve
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const controlOffset = Math.min(Math.abs(dx) * 0.5, 150);

  const path = `M ${from.x} ${from.y} C ${from.x + controlOffset} ${from.y}, ${to.x - controlOffset} ${to.y}, ${to.x} ${to.y}`;

  // Calculate midpoint for delete button
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  return (
    <g 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ pointerEvents: 'all' }}
    >
      {/* Invisible wider path for easier hover */}
      <path
        d={path}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        style={{ cursor: 'pointer' }}
      />
      
      {/* Visible path */}
      <path
        d={path}
        fill="none"
        stroke={isHovered ? "#10b981" : "#475569"}
        strokeWidth={isHovered ? 3 : 2}
        strokeDasharray={isHovered ? "none" : "none"}
        markerEnd="url(#arrowhead)"
        className="transition-all duration-200"
      />

      {/* Animated flow dots */}
      <circle r="4" fill="#10b981">
        <animateMotion dur="2s" repeatCount="indefinite" path={path} />
      </circle>

      {/* Delete button */}
      {isHovered && (
        <g 
          transform={`translate(${midX}, ${midY})`}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{ cursor: 'pointer' }}
        >
          <circle r="12" fill="#1e293b" stroke="#ef4444" strokeWidth="2" />
          <line x1="-4" y1="-4" x2="4" y2="4" stroke="#ef4444" strokeWidth="2" />
          <line x1="4" y1="-4" x2="-4" y2="4" stroke="#ef4444" strokeWidth="2" />
        </g>
      )}
    </g>
  );
}