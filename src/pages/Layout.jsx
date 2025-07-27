import React, { useState, useEffect } from "react";
import { Table } from "@/api/entities";
import { Guest } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft, Save, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import TableDesigner from "../components/layout/TableDesigner";
import TableForm from "../components/layout/TableForm";
import TableSidebar from "../components/layout/TableSidebar";

export default function LayoutPage() {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [guests, setGuests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tableData, guestData] = await Promise.all([
        Table.list('table_number'),
        Guest.list()
      ]);
      setTables(tableData);
      setGuests(guestData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTable = async (tableData) => {
    try {
      if (editingTable) {
        await Table.update(editingTable.id, tableData);
      } else {
        await Table.create(tableData);
      }
      setShowForm(false);
      setEditingTable(null);
      loadData();
    } catch (error) {
      console.error("Error saving table:", error);
    }
  };

  const handleEditTable = (table) => {
    setEditingTable(table);
    setShowForm(true);
  };

  const handleDeleteTable = async (tableId) => {
    try {
      await Table.delete(tableId);
      setSelectedTable(null);
      loadData();
    } catch (error) {
      console.error("Error deleting table:", error);
    }
  };

  const handleTableMove = async (tableId, newPosition) => {
    try {
      const table = tables.find(t => t.id === tableId);
      if (table) {
        await Table.update(tableId, {
          ...table,
          position_x: newPosition.x,
          position_y: newPosition.y
        });
        loadData();
      }
    } catch (error) {
      console.error("Error updating table position:", error);
    }
  };

  const handleSaveLayout = async () => {
    setSaving(true);
    try {
      // Layout is automatically saved when tables are moved
      // This could trigger additional validation or notifications
      setTimeout(() => setSaving(false), 1000);
    } catch (error) {
      console.error("Error saving layout:", error);
      setSaving(false);
    }
  };

  const resetLayout = async () => {
    try {
      const resetPromises = tables.map((table, index) => 
        Table.update(table.id, {
          ...table,
          position_x: (index % 4) * 200 + 100,
          position_y: Math.floor(index / 4) * 150 + 100
        })
      );
      await Promise.all(resetPromises);
      loadData();
    } catch (error) {
      console.error("Error resetting layout:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100">
      <div className="flex">
        {/* Sidebar */}
        <TableSidebar
          tables={tables}
          guests={guests}
          selectedTable={selectedTable}
          onSelectTable={setSelectedTable}
          onEditTable={handleEditTable}
          onDeleteTable={handleDeleteTable}
          onAddTable={() => setShowForm(true)}
        />

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm border-b border-stone-200/60 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate(createPageUrl("Dashboard"))}
                  className="border-stone-300 hover:bg-stone-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-stone-900">Table Layout Designer</h1>
                  <p className="text-stone-600">Arrange your wedding reception tables</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={resetLayout}
                  className="border-stone-300 hover:bg-stone-50"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Layout
                </Button>
                <Button
                  onClick={handleSaveLayout}
                  disabled={saving}
                  className="bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Layout"}
                </Button>
              </div>
            </div>
          </div>

          {/* Designer */}
          <div className="p-6">
            <TableDesigner
              tables={tables}
              guests={guests}
              selectedTable={selectedTable}
              onSelectTable={setSelectedTable}
              onTableMove={handleTableMove}
              loading={loading}
            />
          </div>
        </div>
      </div>

      {/* Table Form Modal */}
      {showForm && (
        <TableForm
          table={editingTable}
          onSave={handleSaveTable}
          onCancel={() => {
            setShowForm(false);
            setEditingTable(null);
          }}
        />
      )}
    </div>
  );
}