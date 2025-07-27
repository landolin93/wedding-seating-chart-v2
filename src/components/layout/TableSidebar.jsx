import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Users, Edit, Trash2, Circle, Square, Minus } from "lucide-react";
import { motion } from "framer-motion";

export default function TableSidebar({
  tables,
  guests,
  selectedTable,
  onSelectTable,
  onEditTable,
  onDeleteTable,
  onAddTable
}) {
  const getTableGuests = (tableNumber) => {
    return guests.filter((guest) => guest.table_number === tableNumber);
  };

  const getShapeIcon = (shape) => {
    switch (shape) {
      case 'round':return Circle;
      case 'square':return Square;
      case 'rectangular':return Minus;
      default:return Circle;
    }
  };

  const unassignedGuests = guests.filter((guest) => !guest.table_number);

  return (
    <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-stone-200/60 h-screen overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-stone-200/60">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-stone-900">Tables</h2>
          <Button
            onClick={onAddTable}
            size="sm"
            className="text-white"
            style={{ backgroundColor: '#8cabc0' }}>

            <Plus className="w-4 h-4 mr-2" />
            Add Table
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="text-center p-2 bg-stone-50 rounded-lg">
            <div className="font-semibold text-stone-900">{tables.length}</div>
            <div className="text-stone-500">Tables</div>
          </div>
          <div className="text-center p-2 bg-stone-50 rounded-lg">
            <div className="font-semibold text-stone-900">{unassignedGuests.length}</div>
            <div className="text-stone-500">Unassigned</div>
          </div>
        </div>
      </div>

      {/* Tables List */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-3">
            {tables.map((table) => {
              const ShapeIcon = getShapeIcon(table.shape);
              const tableGuests = getTableGuests(table.table_number);
              const isSelected = selectedTable?.id === table.id;

              return (
                <motion.div
                  key={table.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 4 }}>

                  <Card
                    className={`cursor-pointer transition-all duration-200 ${
                    isSelected ?
                    'border-rose-300 bg-gradient-to-r from-rose-50 to-amber-50 shadow-md' :
                    'border-stone-200 hover:border-amber-300 hover:shadow-sm bg-white/60'}`
                    }
                    onClick={() => onSelectTable(table)}>

                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-rose-100' : 'bg-stone-100'}`
                          }>
                            <ShapeIcon className={`w-4 h-4 ${
                            isSelected ? 'text-rose-600' : 'text-stone-600'}`
                            } />
                          </div>
                          <div>
                            <h3 className="font-semibold text-stone-900">
                              Table {table.table_number}
                            </h3>
                            {table.table_name &&
                            <p className="text-sm text-stone-600">{table.table_name}</p>
                            }
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-7 h-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditTable(table);
                            }}>

                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-7 h-7 text-red-600 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteTable(table.id);
                            }}>

                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1 text-sm text-stone-600">
                          <Users className="w-3 h-3" />
                          <span>{tableGuests.length}/{table.capacity} guests</span>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                          tableGuests.length === 0 ?
                          'bg-orange-50 text-orange-700 border-orange-200' :
                          tableGuests.length === table.capacity ?
                          'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          'bg-blue-50 text-blue-700 border-blue-200'}`
                          }>

                          {tableGuests.length === 0 ? 'Empty' :
                          tableGuests.length === table.capacity ? 'Full' : 'Partial'}
                        </Badge>
                      </div>

                      {tableGuests.length > 0 &&
                      <div className="text-xs text-stone-500">
                          {tableGuests.slice(0, 2).map((guest) => guest.name).join(', ')}
                          {tableGuests.length > 2 && ` +${tableGuests.length - 2} more`}
                        </div>
                      }
                    </CardContent>
                  </Card>
                </motion.div>);

            })}

            {tables.length === 0 &&
            <div className="text-center py-8">
                <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-stone-400" />
                </div>
                <p className="text-stone-500 text-sm mb-3">No tables yet</p>
                <Button
                onClick={onAddTable}
                size="sm"
                className="text-white"
                style={{ backgroundColor: '#8cabc0' }}>

                  Create First Table
                </Button>
              </div>
            }
          </div>
        </ScrollArea>
      </div>

      {/* Selected Table Details */}
      {selectedTable &&
      <div className="border-t border-stone-200/60 p-4 bg-gradient-to-r from-rose-50/50 to-amber-50/50">
          <h3 className="font-semibold text-stone-900 mb-2">Table Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-600">Capacity:</span>
              <span className="text-slate-950 text-base font-medium">{selectedTable.capacity} guests</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">Shape:</span>
              <span className="text-slate-950 font-medium capitalize">{selectedTable.shape}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">Assigned:</span>
              <span className="text-slate-950 font-medium">{getTableGuests(selectedTable.table_number).length} guests</span>
            </div>
          </div>
          {selectedTable.notes &&
        <div className="mt-3 p-2 bg-white/60 rounded-lg">
              <p className="text-xs text-stone-600 italic">"{selectedTable.notes}"</p>
            </div>
        }
        </div>
      }
    </div>);

}