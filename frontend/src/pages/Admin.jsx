import { useState } from "react";
import { motion } from "framer-motion";
import { Hotel, Plus, Edit, Trash2, TrendingUp, Users, DollarSign, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockHotels } from "@/data/mockHotels";
import { toast } from "sonner";

const Admin = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    {
      title: "Total Revenue",
      value: "$124,500",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: "Total Bookings",
      value: "342",
      change: "+8.2%",
      icon: Calendar,
      color: "text-blue-500",
    },
    {
      title: "Active Users",
      value: "1,234",
      change: "+15.3%",
      icon: Users,
      color: "text-purple-500",
    },
    {
      title: "Occupancy Rate",
      value: "78%",
      change: "+5.1%",
      icon: TrendingUp,
      color: "text-orange-500",
    },
  ];

  const filteredHotels = mockHotels.filter(hotel =>
    hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id) => {
    toast.info(`Edit hotel ${id}`);
  };

  const handleDelete = (id) => {
    toast.error(`Delete hotel ${id}`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-display font-bold mb-2">
                  Admin <span className="gradient-text">Dashboard</span>
                </h1>
                <p className="text-muted-foreground">
                  Manage hotels, bookings, and monitor performance
                </p>
              </div>
              <Button className="bg-primary hover:bg-primary-light gap-2">
                <Plus className="w-5 h-5" />
                Add Hotel
              </Button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover-lift">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      {stat.change}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Hotel Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-semibold">
                  Hotel Management ({mockHotels.length})
                </h2>
                <div className="w-80">
                  <Input
                    placeholder="Search hotels..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Hotel</th>
                      <th className="text-left py-3 px-4 font-semibold">Location</th>
                      <th className="text-left py-3 px-4 font-semibold">Rating</th>
                      <th className="text-left py-3 px-4 font-semibold">Price</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-right py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHotels.map((hotel) => (
                      <tr
                        key={hotel.id}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg">
                              <Hotel className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{hotel.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {hotel.stars} Star
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">
                          {hotel.location}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{hotel.rating}</span>
                            <span className="text-muted-foreground text-sm">
                              ({hotel.reviews})
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-medium text-primary">
                          ${hotel.price}/night
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            className={
                              hotel.featured
                                ? "bg-accent text-accent-foreground"
                                : "bg-muted"
                            }
                          >
                            {hotel.featured ? "Featured" : "Active"}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(hotel.id)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(hotel.id)}
                              className="text-destructive hover:text-destructive"
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

              {filteredHotels.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No hotels found matching "{searchQuery}"
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Admin;
