
import React, { useState, useEffect } from "react";
import { Guest } from "@/api/entities";
import { Table } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Heart, MapPin, Users, Utensils, ArrowLeft, ChevronDown, Eye, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import TableLayoutViewer from "../components/search/TableLayoutViewer";

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allGuests, setAllGuests] = useState([]);
  const [view, setView] = useState("details"); // "details" or "layout"

  useEffect(() => {
    loadGuests();
  }, []);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const filtered = allGuests.filter((guest) =>
        guest.name.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0 && searchTerm.length >= 2);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, allGuests]);

  const loadGuests = async () => {
    try {
      const guests = await Guest.list();
      setAllGuests(guests);
    } catch (error) {
      console.error("Error loading guests:", error);
    }
  };

  const handleSearch = async (selectedGuestName = null) => {
    const nameToSearch = selectedGuestName || searchTerm;
    if (!nameToSearch.trim()) return;

    setSearching(true);
    setNotFound(false);
    setSearchResult(null);
    setShowSuggestions(false);

    try {
      // Find exact or partial match
      let guest = allGuests.find((g) =>
        g.name.toLowerCase() === nameToSearch.toLowerCase()
      );

      if (!guest) {
        guest = allGuests.find((g) =>
          g.name.toLowerCase().includes(nameToSearch.toLowerCase()) ||
          nameToSearch.toLowerCase().includes(g.name.toLowerCase())
        );
      }

      if (guest) {
        let table = null;
        let tableGuests = [];

        if (guest.table_number) {
          const tables = await Table.filter({
            table_number: guest.table_number
          });
          table = tables[0] || null;

          // Get all guests at this table, excluding the searched guest
          tableGuests = allGuests.filter((g) => g.table_number === guest.table_number && g.id !== guest.id);
        }

        setSearchResult({ guest, table, tableGuests });
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error("Search error:", error);
      setNotFound(true);
    } finally {
      setSearching(false);
    }
  };

  const handleSuggestionSelect = (guest) => {
    setSearchTerm(guest.name);
    setShowSuggestions(false);
    handleSearch(guest.name);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !showSuggestions) {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#8cabc0' }}>
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-white">Find Your Seat</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="text-white/80 hover:text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8">
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Search className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">Welcome to Our Wedding!</h1>
            <p className="text-white/90 text-lg leading-relaxed">
              Enter your name below to find your table assignment and join us for this special celebration.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}>
            <Card className="bg-white/95 backdrop-blur-sm border-white/30 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-semibold text-stone-900">Find Your Seat</CardTitle>
                <p className="text-stone-600">Search for your name to see your table assignment</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                      <Input
                        placeholder="Start typing your name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pl-10 text-lg py-6 border-stone-300 bg-white/50 hover:bg-[#8cabc0] hover:text-slate-50 focus:border-blue-400 transition-colors duration-200"
                        style={{ '--tw-ring-color': '#8cabc0' }}
                      />
                      {suggestions.length > 0 &&
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                      }
                    </div>
                    <Button
                      onClick={() => handleSearch()}
                      disabled={searching || !searchTerm.trim()}
                      className="text-white px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
                      style={{ backgroundColor: '#8cabc0' }}>
                      {searching ?
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> :
                        "Search"
                      }
                    </Button>
                  </div>

                  {/* Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 &&
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 right-14 z-50 mt-1">
                      <Card className="shadow-lg border-stone-200 bg-white">
                        <CardContent className="p-2">
                          {suggestions.map((guest, index) =>
                            <motion.div
                              key={guest.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-center gap-3 p-3 hover:bg-stone-50 rounded-lg cursor-pointer transition-colors"
                              onClick={() => handleSuggestionSelect(guest)}>
                              <div className="w-8 h-8 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 text-rose-600" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-stone-900">{guest.name}</p>
                                <p className="text-sm text-stone-500">
                                  {guest.table_number ? `Table ${guest.table_number}` : 'No table assigned'}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  }
                </div>

                <AnimatePresence mode="wait">
                  {searchResult &&
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4">

                      {/* View Toggle */}
                      {searchResult.table &&
                        <div className="flex justify-center">
                          <div className="bg-stone-100 p-1 rounded-lg flex">
                            <Button
                              variant={view === "details" ? "default" : "ghost"}
                              size="sm"
                              onClick={() => setView("details")}
                              className={`${view === "details" ? 'bg-white shadow-sm' : ''}`}>
                              <List className="w-4 h-4 mr-2" />
                              Details
                            </Button>
                            <Button
                              variant={view === "layout" ? "default" : "ghost"}
                              size="sm"
                              onClick={() => setView("layout")}
                              className={`${view === "layout" ? 'bg-white shadow-sm' : ''}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              Table Layout
                            </Button>
                          </div>
                        </div>
                      }

                      {view === "details" ?
                        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                          <CardContent className="p-6">
                            <div className="text-center mb-6">
                              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-emerald-600" />
                              </div>
                              <h2 className="text-2xl font-bold text-emerald-800 mb-2">
                                Welcome, {searchResult.guest.name}!
                              </h2>
                              <p className="text-emerald-700">We're so excited to celebrate with you</p>
                            </div>

                            {searchResult.table ?
                              <div className="space-y-4">
                                <div className="bg-white/60 rounded-xl p-6 text-center">
                                  <div className="flex items-center justify-center gap-2 mb-3">
                                    <MapPin className="w-6 h-6 text-rose-600" />
                                    <span className="text-2xl font-bold text-stone-900">
                                      Table {searchResult.table.table_number}
                                    </span>
                                  </div>
                                  {searchResult.table.table_name &&
                                    <p className="text-lg text-stone-700 mb-3">
                                      "{searchResult.table.table_name}"
                                    </p>
                                  }
                                  <div className="flex justify-center gap-2 flex-wrap">
                                    <Badge className="bg-rose-100 text-rose-800 border-rose-200 px-3 py-1">
                                      Capacity: {searchResult.table.capacity} guests
                                    </Badge>
                                    <Badge className="bg-amber-100 text-amber-800 border-amber-200 px-3 py-1">
                                      {searchResult.table.shape} table
                                    </Badge>
                                  </div>
                                </div>

                                {/* Table Guests */}
                                {searchResult.tableGuests.length > 0 && (
                                  <div className="bg-white/60 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-stone-900 mb-4 text-center">
                                      Your Table Companions
                                    </h3>
                                    <div className="grid gap-3">
                                      {searchResult.tableGuests.map((tableGuest, index) => (
                                        <motion.div
                                          key={tableGuest.id}
                                          initial={{ opacity: 0, x: -20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: index * 0.1 }}
                                          className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg"
                                        >
                                          <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                                            <Users className="w-4 h-4 text-blue-600" />
                                          </div>
                                          <div className="flex-1">
                                            <p className="font-medium text-stone-900">{tableGuest.name}</p>
                                          </div>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div> :
                              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                                <p className="text-amber-800 font-medium">
                                  Your table assignment is being finalized. Please check back soon or contact the wedding party.
                                </p>
                              </div>
                            }
                          </CardContent>
                        </Card> :
                        <TableLayoutViewer
                          guestTable={searchResult.table}
                          guestName={searchResult.guest.name}
                        />
                      }
                    </motion.div>
                  }

                  {notFound &&
                    <motion.div
                      key="not-found"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}>
                      <Card className="bg-orange-50 border-orange-200">
                        <CardContent className="p-6 text-center">
                          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-orange-600" />
                          </div>
                          <h3 className="text-xl font-semibold text-orange-800 mb-2">Name Not Found</h3>
                          <p className="text-orange-700 mb-4">
                            We couldn't find your name in our guest list. Please double-check the spelling or contact the wedding party if you believe this is an error.
                          </p>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSearchTerm("");
                              setNotFound(false);
                            }}
                            className="border-orange-300 text-orange-700 hover:bg-orange-50">
                            Try Again
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  }
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-8">
            <p className="text-white/70 text-sm">
              Need help? Contact us at{" "}
              <a href="mailto:hello@wedding.com" className="text-white hover:text-white/90 font-medium">
                hello@wedding.com
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
