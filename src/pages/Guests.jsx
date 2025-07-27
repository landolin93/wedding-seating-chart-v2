
import React, { useState, useEffect } from "react";
import { Guest } from "@/api/entities";
import { Table } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Search, Filter, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import GuestCard from "../components/guests/GuestCard";
import GuestForm from "../components/guests/GuestForm";
import GuestFilters from "../components/guests/GuestFilters";

export default function GuestsPage() {
  const navigate = useNavigate();
  const [guests, setGuests] = useState([]);
  const [tables, setTables] = useState([]);
  const [filteredGuests, setFilteredGuests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [filters, setFilters] = useState({
    rsvp_status: "all",
    table_assigned: "all"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterGuests();
  }, [guests, searchTerm, filters]);

  const loadData = async () => {
    try {
      const [guestData, tableData] = await Promise.all([
        Guest.list('-created_date'),
        Table.list('table_number')
      ]);
      setGuests(guestData);
      setTables(tableData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterGuests = () => {
    let filtered = guests;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((guest) =>
        guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // RSVP status filter
    if (filters.rsvp_status !== "all") {
      filtered = filtered.filter((guest) => guest.rsvp_status === filters.rsvp_status);
    }

    // Table assignment filter
    if (filters.table_assigned === "assigned") {
      filtered = filtered.filter((guest) => guest.table_number);
    } else if (filters.table_assigned === "unassigned") {
      filtered = filtered.filter((guest) => !guest.table_number);
    }

    setFilteredGuests(filtered);
  };

  const handleSaveGuest = async (guestData) => {
    try {
      if (editingGuest) {
        await Guest.update(editingGuest.id, guestData);
      } else {
        await Guest.create(guestData);
      }
      setShowForm(false);
      setEditingGuest(null);
      loadData();
    } catch (error) {
      console.error("Error saving guest:", error);
    }
  };

  const handleEditGuest = (guest) => {
    setEditingGuest(guest);
    setShowForm(true);
  };

  const handleDeleteGuest = async (guestId) => {
    try {
      await Guest.delete(guestId);
      loadData();
    } catch (error) {
      console.error("Error deleting guest:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8">

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate(createPageUrl("Dashboard"))} className="bg-[#8cabc0] text-slate-50 text-sm font-medium inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border hover:text-accent-foreground h-10 w-10 border-stone-300 hover:bg-stone-50">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-stone-900 flex items-center gap-3">
                  <Users className="w-8 h-8 text-amber-600" />
                  Guest Management
                </h1>
                <p className="text-stone-600 mt-1">Manage your wedding guest list and table assignments</p>
              </div>
            </div>
            <Button
              onClick={() => setShowForm(true)} className="bg-[#8cabc0] text-slate-50 px-4 py-2 text-sm font-medium inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-[#8cabc0]/90 h-10 from-amber-500 to-rose-500 shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="w-4 h-4 mr-2" />
              Add Guest
            </Button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <Card className="bg-white/60 backdrop-blur-sm border-stone-200/60 shadow-lg">
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-stone-900">
                    Guests ({filteredGuests.length})
                  </CardTitle>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
                      <Input
                        placeholder="Search guests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-10 w-full rounded-md border ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-stone-300 bg-white/50 hover:bg-[#8cabc0] hover:text-slate-50 focus:border-blue-400 transition-colors duration-200"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <AnimatePresence>
                    {loading ?
                      Array(6).fill(0).map((_, i) =>
                        <div key={i} className="animate-pulse">
                          <div className="h-20 bg-stone-200 rounded-lg"></div>
                        </div>
                      ) :
                      filteredGuests.length === 0 ?
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-stone-400" />
                          </div>
                          <p className="text-stone-500 mb-4">No guests found</p>
                          <Button
                            onClick={() => setShowForm(true)}
                            className="bg-[#8cabc0] text-slate-50 px-4 py-2 text-sm font-medium inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-[#8cabc0]/90 h-10 transition-colors duration-200">
                            Add Your First Guest
                          </Button>
                        </div> :

                        filteredGuests.map((guest, index) =>
                          <GuestCard
                            key={guest.id}
                            guest={guest}
                            tables={tables}
                            onEdit={handleEditGuest}
                            onDelete={handleDeleteGuest}
                            delay={index * 0.05} />
                        )
                    }
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <GuestFilters
              filters={filters}
              onFiltersChange={setFilters}
              guestCount={guests.length}
              filteredCount={filteredGuests.length} />
          </div>
        </div>

        <AnimatePresence>
          {showForm &&
            <GuestForm
              guest={editingGuest}
              tables={tables}
              onSave={handleSaveGuest}
              onCancel={() => {
                setShowForm(false);
                setEditingGuest(null);
              }} />
          }
        </AnimatePresence>
      </div>
    </div>);

}
