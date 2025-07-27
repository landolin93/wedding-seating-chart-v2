import React, { useState, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Users, Circle, Square, Minus } from "lucide-react";

export default function TableDesigner({ 
  tables, 
  guests, 
  selectedTable, 
  onSelectTable, 
  onTableMove, 
  loading 
}) {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedTable, setDraggedTable] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const getTableGuests = (tableNumber) => {
    return guests.filter(guest => guest.table_number === tableNumber);
  };

  const getShapeIcon = (shape) => {
    switch (shape) {
      case 'round': return Circle;
      case 'square': return Square;
      case 'rectangular': return Minus;
      default: return Circle;
    }
  };

  const handleMouseDown = useCallback((e, table) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const tableElement = e.currentTarget;
    const tableRect = tableElement.getBoundingClientRect();
    
    setDraggedTable(table);
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - tableRect.left,
      y: e.clientY - tableRect.top
    });

    // Add pointer-events: none to prevent interference
    tableElement.style.pointerEvents = 'none';
    tableElement.style.zIndex = '9999';
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !draggedTable || !containerRef.current) return;

    e.preventDefault();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    const newX = Math.max(0, Math.min(
      containerRect.width - 112, // 112px is table width (28 * 4)
      e.clientX - containerRect.left - dragOffset.x
    ));
    const newY = Math.max(0, Math.min(
      containerRect.height - 112, // 112px is table height (28 * 4)
      e.clientY - containerRect.top - dragOffset.y
    ));

    const tableElement = document.getElementById(`table-${draggedTable.id}`);
    if (tableElement) {
      tableElement.style.transform = `translate(${newX}px, ${newY}px)`;
      tableElement.style.transition = 'none';
    }
  }, [isDragging, draggedTable, dragOffset]);

  const handleMouseUp = useCallback((e) => {
    if (!isDragging || !draggedTable || !containerRef.current) return;

    e.preventDefault();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    const newX = Math.max(0, Math.min(
      containerRect.width - 112,
      e.clientX - containerRect.left - dragOffset.x
    ));
    const newY = Math.max(0, Math.min(
      containerRect.height - 112,
      e.clientY - containerRect.top - dragOffset.y
    ));

    // Reset styles
    const tableElement = document.getElementById(`table-${draggedTable.id}`);
    if (tableElement) {
      tableElement.style.pointerEvents = 'auto';
      tableElement.style.zIndex = 'auto';
      tableElement.style.transition = 'all 0.2s ease';
    }

    // Save new position
    onTableMove(draggedTable.id, { x: newX, y: newY });
    
    setIsDragging(false);
    setDraggedTable(null);
  }, [isDragging, draggedTable, dragOffset, onTableMove]);

  // Global mouse event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = 'auto';
        document.body.style.cursor = 'auto';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (loading) {
    return (
      <Card className="bg-white/60 backdrop-blur-sm border-stone-200/60 shadow-lg h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" style={{ borderBottomColor: '#8cabc0' }}></div>
          <p className="text-stone-600">Loading layout...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-stone-200/60 shadow-lg">
      <div 
        ref={containerRef}
        className="relative h-[600px] overflow-hidden bg-gradient-to-br from-stone-50 to-blue-50/30 rounded-lg"
        style={{ userSelect: 'none' }}
      >
        {/* Room Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 h-full">
            {Array(144).fill(0).map((_, i) => (
              <div key={i} className="border border-stone-300"></div>
            ))}
          </div>
        </div>

        {/* Dance Floor Indicator */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-rose-200 to-blue-200 rounded-lg px-4 py-2 border-2 border-dashed border-rose-300">
          <p className="text-rose-800 font-medium text-sm">🎵 Dance Floor</p>
        </div>

        {/* Tables */}
        {tables.map((table) => {
          const ShapeIcon = getShapeIcon(table.shape);
          const tableGuests = getTableGuests(table.table_number);
          const isSelected = selectedTable?.id === table.id;
          const isDraggingThis = draggedTable?.id === table.id;

          return (
            <div
              key={table.id}
              id={`table-${table.id}`}
              className={`absolute w-28 h-28 cursor-grab active:cursor-grabbing ${isDraggingThis ? 'z-50' : 'z-10'}`}
              style={{
                transform: `translate(${table.position_x || 0}px, ${table.position_y || 0}px)`,
                transition: isDraggingThis ? 'none' : 'all 0.2s ease'
              }}
              onMouseDown={(e) => handleMouseDown(e, table)}
              onClick={(e) => {
                e.stopPropagation();
                if (!isDragging) {
                  onSelectTable(table);
                }
              }}
            >
              <motion.div
                whileHover={!isDragging ? { scale: 1.05 } : {}}
                className={`w-full h-full rounded-xl border-2 transition-all duration-200 shadow-lg ${
                  isSelected
                    ? 'border-rose-400 bg-gradient-to-br from-rose-100 to-blue-100 shadow-rose-200/50 shadow-lg'
                    : 'border-stone-300 bg-gradient-to-br from-white to-stone-50 hover:border-blue-400 hover:shadow-blue-200/30'
                } ${isDraggingThis ? 'shadow-xl scale-105' : ''}`}
              >
                <div className="p-2 h-full flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-1 mb-1">
                    <ShapeIcon className="w-3 h-3 text-stone-600" />
                    <span className="font-bold text-stone-900 text-sm">
                      {table.table_number}
                    </span>
                  </div>
                  
                  {table.table_name && (
                    <p className="text-xs text-stone-600 mb-1 leading-tight">
                      {table.table_name.length > 12 
                        ? table.table_name.substring(0, 12) + '...' 
                        : table.table_name
                      }
                    </p>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-stone-500" />
                    <span className="text-xs text-stone-600">
                      {tableGuests.length}/{table.capacity}
                    </span>
                  </div>

                  {tableGuests.length > 0 && (
                    <Badge 
                      variant="outline" 
                      className="text-xs px-1 py-0 mt-1 bg-emerald-50 text-emerald-700 border-emerald-200"
                    >
                      Assigned
                    </Badge>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })}

        {tables.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-stone-400" />
              </div>
              <p className="text-stone-500 mb-2">No tables created yet</p>
              <p className="text-stone-400 text-sm">Add tables from the sidebar to start designing</p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-stone-200/60 shadow-lg">
          <p className="text-stone-600 text-sm font-medium mb-1">💡 Quick Tips:</p>
          <ul className="text-stone-500 text-xs space-y-1">
            <li>• Drag tables to rearrange layout</li>
            <li>• Click table to view details</li>
            <li>• Add tables from sidebar</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}