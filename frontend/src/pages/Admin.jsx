import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Hotel,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  Users,
  DollarSign,
  Calendar
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  useGetAllHotelsQuery,
  useGetHotelsBySearchQuery
} from "@/lib/api";

import { useGetBookingStatsQuery } from "@/lib/bookingApi";
import { toast } from "sonner";

const Admin = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // ---------------------- HOTEL FETCHING ----------------------------------
  const { data: allHotelsData, isLoading: loadingAll } = useGetAllHotelsQuery();
  const { data: searchedData, isFetching: searching } =
    useGetHotelsBySearchQuery(searchQuery, {
      skip: searchQuery.length < 1,
    });

  // Support both API response structures: { data: [...] } or { data: { hotels: [...] } }
  const hotels = searchQuery
  ? searchedData || []
  : allHotelsData || [];


  console.log("ALL HOTELS DATA:", allHotelsData);
  console.log("SEARCHED DATA:", searchedData);

  
  // ---------------------- BOOKING STATS ----------------------------------
  const adminId = "ADMIN_ID"; // Replace when auth is ready
  const { data: statsData } = useGetBookingStatsQuery(adminId);

  const stats = [
    {
      title: "Total Revenue",
      value: statsData?.totalRevenue || "$0",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: "Total Bookings",
      value: statsData?.totalBookings || 0,
      change: "+8.2%",
      icon: Calendar,
      color: "text-blue-500",
    },
    {
      title: "Active Users",
      value: statsData?.activeUsers || 0,
      change: "+15.3%",
      icon: Users,
      color: "text-purple-500",
    },
    {
      title: "Occupancy Rate",
      value: statsData?.occupancyRate || "0%",
      change: "+5.1%",
      icon: TrendingUp,
      color: "text-orange-500",
    },
  ];

  const handleEdit = (id) => {
    navigate(`/admin/edit-hotel/${id}`);
  };

  const handleDelete = (id) => {
    toast.error("Delete API not implemented yet");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-12 container mx-auto px-4">

        {/* ---------------------- HEADER ---------------------- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-display font-bold mb-2">
                Admin <span className="gradient-text">Dashboard</span>
              </h1>
              <p className="text-muted-foreground">
                Manage hotels, bookings, and system data
              </p>
            </div>

            <div className="flex gap-3">
              {/* GO TO BOOKINGS BUTTON */}
              <Button
                className="bg-emerald-500 hover:bg-emerald-400 gap-2"
                onClick={() => navigate("/admin/bookings")}
              >
                <Calendar className="w-5 h-5" />
                Bookings
              </Button>

              {/* ADD HOTEL BUTTON */}
              <Button
                className="bg-primary hover:bg-primary-light gap-2"
                onClick={() => navigate("/admin/create-hotel")}
              >
                <Plus className="w-5 h-5" />
                Add Hotel
              </Button>
            </div>
          </div>
        </motion.div>

        {/* ---------------------- STATS GRID ---------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
              >
                <Card className="p-6 hover-lift">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ---------------------- HOTEL MANAGEMENT ---------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-2xl font-display font-semibold">
                Hotels ({hotels?.length || 0})
              </h2>

              <div className="w-full sm:w-80">
                <Input
                  placeholder="Search hotels by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* ---------------------- TABLE ---------------------- */}
            {loadingAll || searching ? (
              <div className="flex justify-center items-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="text-sm text-muted-foreground">
                    Loading hotels...
                  </p>
                </div>
              </div>
            ) : hotels?.length === 0 ? (
              <div className="text-center py-12">
                <Hotel className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-1">No hotels found</p>
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? "Try adjusting your search query"
                    : "Add your first hotel to get started"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">
                        Hotel
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Location
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Rating
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Reviews
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Price
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Status
                      </th>
                      <th className="text-right py-3 px-4 font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {hotels.map((hotel) => (
                      <tr
                        key={hotel._id}
                        className="border-b border-border hover:bg-muted/20 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                              {hotel.images?.[0] ? (
                                <img
                                  src={hotel.images[0]}
                                  alt={hotel.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Hotel className="w-6 h-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{hotel.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {hotel.stars} Star Hotel
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <div className="font-medium">{hotel.city}</div>
                            <div className="text-muted-foreground">
                              {hotel.location}
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{hotel.rating}</span>
                            <span className="text-yellow-500">★</span>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-muted-foreground">
                          {hotel.reviews.toLocaleString()} reviews
                        </td>

                        <td className="py-4 px-4 font-semibold text-primary">
                          ${hotel.price}
                          <span className="text-sm text-muted-foreground font-normal">
                            /night
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <Badge
                            variant={hotel.featured ? "default" : "outline"}
                          >
                            {hotel.featured ? "Featured" : "Active"}
                          </Badge>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(hotel._id)}
                              className="hover:bg-primary/10 hover:text-primary"
                              title="Edit hotel"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(hotel._id)}
                              className="hover:bg-destructive/10 text-destructive hover:text-destructive"
                              title="Delete hotel"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Admin;