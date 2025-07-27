
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { X, Save, User } from "lucide-react";

export default function GuestForm({ guest, tables, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: guest?.name || "",
    email: guest?.email || "",
    phone: guest?.phone || "",
    table_number: guest?.table_number || "",
    rsvp_status: guest?.rsvp_status || "pending",
    notes: guest?.notes || ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">

      <Card className="w-full max-w-2xl bg-white shadow-2xl">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-stone-900 flex items-center gap-3">
              <User className="w-6 h-6" style={{ color: '#8cabc0' }} />
              {guest ? "Edit Guest" : "Add New Guest"}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-stone-700 font-medium">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Full name"
                  required
                  className="border-stone-300 focus:border-blue-400"
                  style={{ '--tw-ring-color': '#8cabc0' }} />

              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-stone-700 font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="email@example.com"
                  className="border-stone-300 focus:border-blue-400"
                  style={{ '--tw-ring-color': '#8cabc0' }} />

              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-stone-700 font-medium">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Phone number"
                  className="border-stone-300 focus:border-blue-400"
                  style={{ '--tw-ring-color': '#8cabc0' }} />

              </div>
              <div className="space-y-2">
                <Label htmlFor="table" className="text-stone-700 font-medium">Table Assignment</Label>
                <Select
                  value={formData.table_number ? formData.table_number.toString() : ""}
                  onValueChange={(value) => handleInputChange("table_number", value ? parseInt(value) : "")}>

                  <SelectTrigger className="border-stone-300 focus:border-blue-400">
                    <SelectValue placeholder="Select table" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>No table assigned</SelectItem>
                    {tables.map((table) =>
                      <SelectItem key={table.id} value={table.table_number.toString()}>
                        Table {table.table_number}
                        {table.table_name && ` - ${table.table_name}`}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rsvp" className="text-stone-700 font-medium">RSVP Status</Label>
                <Select
                  value={formData.rsvp_status}
                  onValueChange={(value) => handleInputChange("rsvp_status", value)}>

                  <SelectTrigger className="border-stone-300 focus:border-blue-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
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
                placeholder="Additional notes about this guest"
                className="border-stone-300 focus:border-blue-400 h-20"
                style={{ '--tw-ring-color': '#8cabc0' }} />

            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel} className="bg-slate-50 text-slate-950 px-4 py-2 text-sm font-medium inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border hover:text-accent-foreground h-10 border-stone-300 hover:bg-stone-50">
                Cancel
              </Button>
              <Button
                type="submit"
                className="text-white bg-[#8cabc0] hover:bg-[#7e99ad]"> {/* Applied hover effect using Tailwind classes */}
                <Save className="w-4 h-4 mr-2" />
                {guest ? "Update Guest" : "Add Guest"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>);

}
