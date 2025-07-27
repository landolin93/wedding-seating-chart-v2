import React, { useState, useEffect } from "react";
import { Table } from "@/api/entities";
import { LayoutItem } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Circle, Square, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function TableLayoutViewer({ guestTable, guestName }) {
  const [tables, setTables] = useState([]);
  const [layoutItems, setLayoutItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLayoutData();
  }, []);

  const loadLayoutData = async () => {
    try {
      const [tableData, layoutData] = await Promise.all([
        Table.list(),
        LayoutItem.list().catch(() => []) // Handle if no layout items exist
      ]);
      setTables(tableData);
      setLayoutItems(layoutData);
    } catch (error) {
      console.error("Error loading layout:", error);
    } finally {
      setLoading(false);
    }
  };

  const getShapeIcon = (shape) => {
    return shape === 'square' ? Square : Circle;
  };

  const getTableSize = (size) => {
    switch (size) {
      case 'small': return { width: 80, height: 80 };
      case 'large': return { width: 140, height: 140 };
      default: return { width: 112, height: 112 }; // medium
    }
  };

  const getLayoutItemStyle = (item) => {
    const baseStyle = {
      position: 'absolute',
      left: item.position_x,
      top: item.position_y,
      width: item.width,
      height: item.height,
      backgroundColor: item.color || '#8cabc0',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '12px',
      fontWeight: 'bold'
    };

    return baseStyle;
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderBottomColor: '#8cabc0' }}></div>
          <p className="text-stone-600">Loading table layout...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold text-blue-800 flex items-center justify-center gap-2">
          <MapPin className="w-5 h-5" />
          Table Layout View
        </CardTitle>
        <p className="text-blue-600">Your table is highlighted in the layout below</p>
      </CardHeader>
      <CardContent>
        <div className="relative h-[400px] bg-white rounded-lg border-2 border-blue-200 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-12 h-full">
              {Array(120).fill(0).map((_, i) => (
                <div key={i} className="border border-stone-300"></div>
              ))}
            </div>
          </div>

          {/* Layout Items */}
          {layoutItems.map((item) => (
            <div
              key={item.id}
              style={getLayoutItemStyle(item)}
            >
              {item.name}
            </div>
          ))}

          {/* Tables */}
          {tables.map((table) => {
            const ShapeIcon = getShapeIcon(table.shape);
            const isGuestTable = guestTable && table.table_number === guestTable.table_number;
            const tableSize = getTableSize(table.size);

            return (
              <motion.div
                key={table.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="absolute"
                style={{
                  left: table.position_x || (table.table_number - 1) * 120 + 50,
                  top: table.position_y || 100,
                  width: tableSize.width,
                  height: tableSize.height
                }}
              >
                <div
                  className={`w-full h-full rounded-xl border-2 transition-all duration-300 shadow-lg ${
                    isGuestTable
                      ? 'border-rose-400 bg-gradient-to-br from-rose-100 to-pink-100 shadow-rose-200/50 animate-pulse'
                      : 'border-stone-300 bg-gradient-to-br from-white to-stone-50'
                  }`}
                >
                  <div className="p-2 h-full flex flex-col items-center justify-center text-center">
                    <div className="flex items-center gap-1 mb-1">
                      <ShapeIcon className={`w-3 h-3 ${isGuestTable ? 'text-rose-600' : 'text-stone-600'}`} />
                      <span className={`font-bold text-sm ${isGuestTable ? 'text-rose-900' : 'text-stone-900'}`}>
                        {table.table_number}
                      </span>
                    </div>
                    
                    {table.table_name && (
                      <p className={`text-xs mb-1 leading-tight ${isGuestTable ? 'text-rose-700' : 'text-stone-600'}`}>
                        {table.table_name.length > 10 
                          ? table.table_name.substring(0, 10) + '...' 
                          : table.table_name
                        }
                      </p>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <Users className={`w-3 h-3 ${isGuestTable ? 'text-rose-500' : 'text-stone-500'}`} />
                      <span className={`text-xs ${isGuestTable ? 'text-rose-600' : 'text-stone-600'}`}>
                        {table.capacity}
                      </span>
                    </div>

                    {isGuestTable && (
                      <Badge className="text-xs px-1 py-0 mt-1 bg-rose-200 text-rose-800 border-rose-300">
                        Your Table
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-stone-200 shadow-lg">
            <p className="text-stone-600 text-sm font-medium mb-2">🎯 Legend:</p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-br from-rose-100 to-pink-100 border border-rose-300 rounded"></div>
                <span className="text-stone-600">Your Table</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white border border-stone-300 rounded"></div>
                <span className="text-stone-600">Other Tables</span>
              </div>
            </div>
          </div>

          {/* Guest Indicator */}
          {guestTable && (
            <div className="absolute top-4 right-4 bg-rose-100 border border-rose-300 rounded-lg p-3">
              <p className="text-rose-800 font-semibold text-sm">👋 {guestName}</p>
              <p className="text-rose-700 text-xs">Table {guestTable.table_number}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}