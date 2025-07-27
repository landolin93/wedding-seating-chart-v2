import React, { useState, useEffect } from "react";
import { Guest } from "@/entities/Guest";
import { Table } from "@/entities/Table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Users, TableProperties, Upload, Search, Heart, CheckCircle, Clock, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [guests, setGuests] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [guestData, tableData] = await Promise.all([
        Guest.list(),
        Table.list()
      ]);
      setGuests(guestData);
      setTables(tableData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGuestStats = () => {
    const confirmed = guests.filter((g) => g.rsvp_status === 'confirmed').length;
    const pending = guests.filter((g) => g.rsvp_status === 'pending').length;
    const declined = guests.filter((g) => g.rsvp_status === 'declined').length;
    const assigned = guests.filter((g) => g.table_number).length;

    return { confirmed, pending, declined, assigned, total: guests.length };
  };

  const stats = getGuestStats();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#8cabc0' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="mb-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Wedding Seating Dashboard</h1>
            <p className="text-white/80 text-lg">Manage your guests and table arrangements with elegance</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: 0.1 }}>
            <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-stone-600 uppercase tracking-wide">Total Guests</CardTitle>
                  <Users className="w-5 h-5" style={{ color: '#8cabc0' }} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-stone-900 mb-1">{stats.total}</div>
                <p className="text-sm text-stone-500">{stats.assigned} assigned to tables</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: 0.2 }}>
            <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-stone-600 uppercase tracking-wide">Confirmed</CardTitle>
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-700 mb-1">{stats.confirmed}</div>
                <p className="text-sm text-stone-500">Ready for seating</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: 0.3 }}>
            <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-stone-600 uppercase tracking-wide">Pending</CardTitle>
                  <Clock className="w-5 h-5 text-stone-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-stone-700 mb-1">{stats.pending}</div>
                <p className="text-sm text-stone-500">Awaiting response</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: 0.4 }}>
            <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-stone-600 uppercase tracking-wide">Tables</CardTitle>
                  <TableProperties className="w-5 h-5 text-rose-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-rose-700 mb-1">{tables.length}</div>
                <p className="text-sm text-stone-500">Reception tables</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: 0.5 }}>
            <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-stone-900">Quick Actions</CardTitle>
                <p className="text-stone-600">Get started with your seating arrangements</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link to={createPageUrl("Upload")} className="w-full">
                  <Button className="w-full text-white shadow-lg hover:shadow-xl transition-all duration-300 py-6" style={{ backgroundColor: '#8cabc0' }}>
                    <Upload className="w-5 h-5 mr-3" />
                    Upload Guest List (CSV)
                  </Button>
                </Link>
                
                <Link to={createPageUrl("Guests")} className="w-full">
                  <Button variant="outline" className="bg-[#8cabc0] text-slate-50 px-4 py-6 text-sm font-medium inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border h-10 w-full border-stone-300 hover:bg-white hover:text-[#8cabc0] transition-all duration-300">
                    <Users className="w-5 h-5 mr-3" />
                    Manage Guests Manually
                  </Button>
                </Link>

                <Link to={createPageUrl("Layout")} className="w-full">
                  <Button variant="outline" className="bg-[#8cabc0] text-slate-50 px-4 py-6 text-sm font-medium inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border h-10 w-full border-stone-300 hover:bg-white hover:text-[#8cabc0] transition-all duration-300">
                    <TableProperties className="w-5 h-5 mr-3" />
                    Design Table Layout
                  </Button>
                </Link>

                <Link to={createPageUrl("Search")} className="w-full">
                  <Button variant="outline" className="bg-[#8cabc0] text-slate-50 px-4 py-6 text-sm font-medium inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border h-10 w-full border-stone-300 hover:bg-white hover:text-[#8cabc0] transition-all duration-300">
                    <Search className="w-5 h-5 mr-3" />
                    Guest Search Portal
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: 0.6 }}>
            <Card className="bg-white/90 backdrop-blur-sm border-white/30 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-stone-900">Recent Activity</CardTitle>
                <p className="text-stone-600">Latest updates to your guest list</p>
              </CardHeader>
              <CardContent>
                {guests.length === 0 ?
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-stone-400" />
                    </div>
                    <p className="text-stone-500 mb-4">No guests added yet</p>
                    <Link to={createPageUrl("Upload")}>
                      <Button size="sm" className="text-white" style={{ backgroundColor: '#8cabc0' }}>
                        Add Your First Guests
                      </Button>
                    </Link>
                  </div> :
                  <div className="space-y-3">
                    {guests.slice(0, 5).map((guest, index) => (
                      <div key={guest.id} className="flex items-center justify-between p-3 bg-stone-50/50 rounded-lg">
                        <div>
                          <p className="font-medium text-stone-900">{guest.name}</p>
                          <p className="text-sm text-stone-500">
                            {guest.table_number ? `Table ${guest.table_number}` : 'No table assigned'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {guest.rsvp_status === 'confirmed' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                          {guest.rsvp_status === 'pending' && <Clock className="w-4 h-4 text-stone-600" />}
                          {guest.rsvp_status === 'declined' && <XCircle className="w-4 h-4 text-red-600" />}
                        </div>
                      </div>
                    ))}
                  </div>
                }
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
