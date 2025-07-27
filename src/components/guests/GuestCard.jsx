
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Mail, Phone, Edit, Trash2, User, CheckCircle, Clock, XCircle } from "lucide-react";

const statusColors = {
  confirmed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  pending: "bg-stone-100 text-stone-800 border-stone-200",
  declined: "bg-red-100 text-red-800 border-red-200"
};

const statusIcons = {
  confirmed: CheckCircle,
  pending: Clock,
  declined: XCircle
};

export default function GuestCard({ guest, tables, onEdit, onDelete, delay = 0 }) {
  const StatusIcon = statusIcons[guest.rsvp_status] || Clock;
  const assignedTable = tables.find(t => t.table_number === guest.table_number);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border-stone-200/60 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-stone-100 to-stone-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-stone-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-lg">{guest.name}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={statusColors[guest.rsvp_status]} variant="outline">
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {guest.rsvp_status}
                    </Badge>
                    {assignedTable && (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200" style={{ backgroundColor: 'rgba(140, 171, 192, 0.1)', color: '#8cabc0', borderColor: 'rgba(140, 171, 192, 0.3)' }}>
                        Table {assignedTable.table_number}
                        {assignedTable.table_name && ` - ${assignedTable.table_name}`}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1 text-sm text-stone-600">
                {guest.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{guest.email}</span>
                  </div>
                )}
                {guest.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{guest.phone}</span>
                  </div>
                )}
                {guest.notes && (
                  <div className="text-stone-500 italic mt-2">
                    "{guest.notes}"
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 ml-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(guest)}
                className="border-stone-300 hover:bg-stone-50"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(guest.id)}
                className="border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
