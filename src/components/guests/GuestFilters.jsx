
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Users, CheckCircle, Clock, XCircle } from "lucide-react";

export default function GuestFilters({ filters, onFiltersChange, guestCount, filteredCount }) {
  const handleFilterChange = (key, value) => {
    onFiltersChange((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-stone-200/60 shadow-lg sticky top-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-stone-900 flex items-center gap-2">
          <Filter className="w-5 h-5 text-amber-600" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-700">RSVP Status</label>
          <Select
            value={filters.rsvp_status}
            onValueChange={(value) => handleFilterChange("rsvp_status", value)}>
            <SelectTrigger className="border-stone-300 bg-white/50 hover:bg-[#8cabc0] hover:text-slate-50 focus:border-blue-400 transition-colors duration-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="confirmed">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Confirmed
                </div>
              </SelectItem>
              <SelectItem value="pending">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Pending
                </div>
              </SelectItem>
              <SelectItem value="declined">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  Declined
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-700">Table Assignment</label>
          <Select
            value={filters.table_assigned}
            onValueChange={(value) => handleFilterChange("table_assigned", value)}>
            <SelectTrigger className="border-stone-300 bg-white/50 hover:bg-[#8cabc0] hover:text-slate-50 focus:border-blue-400 transition-colors duration-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Guests</SelectItem>
              <SelectItem value="assigned">Table Assigned</SelectItem>
              <SelectItem value="unassigned">No Table</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4 border-t border-stone-200">
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <Users className="w-4 h-4" />
            <span>
              Showing {filteredCount} of {guestCount} guests
            </span>
          </div>
        </div>
      </CardContent>
    </Card>);

}
