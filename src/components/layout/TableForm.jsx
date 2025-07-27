import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { X, Save, TableProperties } from "lucide-react";

export default function TableForm({ table, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    table_number: table?.table_number || "",
    table_name: table?.table_name || "",
    capacity: table?.capacity || 8,
    shape: table?.shape || "round",
    size: table?.size || "medium",
    position_x: table?.position_x || 100,
    position_y: table?.position_y || 100,
    notes: table?.notes || ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <Card className="w-full max-w-lg bg-white shadow-2xl">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-stone-900 flex items-center gap-3">
              <TableProperties className="w-6 h-6" style={{ color: '#8cabc0' }} />
              {table ? "Edit Table" : "Add New Table"}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="table_number" className="text-stone-700 font-medium">Table Number *</Label>
                <Input
                  id="table_number"
                  type="number"
                  value={formData.table_number}
                  onChange={(e) => handleInputChange("table_number", parseInt(e.target.value) || "")}
                  placeholder="1"
                  required
                  className="border-stone-300"
                  style={{ '--tw-ring-color': '#8cabc0' }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity" className="text-stone-700 font-medium">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange("capacity", parseInt(e.target.value) || 8)}
                  placeholder="8"
                  className="border-stone-300"
                  style={{ '--tw-ring-color': '#8cabc0' }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="table_name" className="text-stone-700 font-medium">Table Name/Theme</Label>
              <Input
                id="table_name"
                value={formData.table_name}
                onChange={(e) => handleInputChange("table_name", e.target.value)}
                placeholder="e.g., Family & Friends, College Crew"
                className="border-stone-300"
                style={{ '--tw-ring-color': '#8cabc0' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shape" className="text-stone-700 font-medium">Table Shape</Label>
                <Select
                  value={formData.shape}
                  onValueChange={(value) => handleInputChange("shape", value)}
                >
                  <SelectTrigger className="border-stone-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="round">Round</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="size" className="text-stone-700 font-medium">Table Size</Label>
                <Select
                  value={formData.size}
                  onValueChange={(value) => handleInputChange("size", value)}
                >
                  <SelectTrigger className="border-stone-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-stone-700 font-medium">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Special requirements or notes"
                className="border-stone-300 h-20"
                style={{ '--tw-ring-color': '#8cabc0' }}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-stone-300 hover:bg-stone-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="text-white"
                style={{ backgroundColor: '#8cabc0' }}
              >
                <Save className="w-4 h-4 mr-2" />
                {table ? "Update Table" : "Create Table"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}