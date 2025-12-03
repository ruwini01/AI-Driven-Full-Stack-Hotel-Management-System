import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  MapPin,
  Wifi,
  Utensils,
  Dumbbell,
  Car,
  Coffee,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useGetHotelByIdQuery } from "@/lib/api";
import { toast } from "sonner";

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Load hotel from API
  const { data: hotel, isLoading, isError } = useGetHotelByIdQuery(id);

  const [currentImage, setCurrentImage] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [selectedRoom, setSelectedRoom] = useState("");

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-semibold">Loading hotel details...</h1>
      </div>
    );
  }

  // Error or hotel not found
  if (isError || !hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Hotel Not Found</h1>
          <Button onClick={() => navigate("/hotels")}>Back to Hotels</Button>
        </div>
      </div>
    );
  }

  // Amenity Icons
  const amenityIcons = {
    WiFi: Wifi,
    Restaurant: Utensils,
    Gym: Dumbbell,
    Parking: Car,
    "Room Service": Coffee,
  };

  // Handle Booking
  const handleBooking = () => {
    if (!checkIn || !checkOut || !selectedRoom) {
      toast.error("Please fill in all booking details");
      return;
    }
    toast.success("Proceeding to payment...");
    setTimeout(() => navigate("/success"), 1000);
  };

  // Image Navigation
  const nextImage = () => setCurrentImage((prev) => (prev + 1) % hotel.images.length);
  const prevImage = () =>
    setCurrentImage((prev) => (prev - 1 + hotel.images.length) % hotel.images.length);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2">
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>

          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-[60vh] rounded-3xl overflow-hidden mb-8 group"
          >
            <img
              src={hotel.images[currentImage]}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/30"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/30"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Info Overlay */}
            <div className="absolute bottom-8 left-8 text-white z-10">
              {hotel.featured && (
                <Badge className="mb-3 bg-accent text-accent-foreground">Featured</Badge>
              )}

              <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
                {hotel.name}
              </h1>

              <div className="flex items-center gap-4 text-lg">
                <div className="flex items-center gap-1">
                  <MapPin className="w-5 h-5" /> <span>{hotel.location}</span>
                </div>

                <div className="flex items-center gap-1">
                  {[...Array(hotel.stars)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Rating */}
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary text-primary-foreground rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold">{hotel.rating}</div>
                    <div className="text-sm">Excellent</div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(hotel.rating)
                              ? "fill-primary text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-muted-foreground">
                      Based on {hotel.reviews} reviews
                    </p>
                  </div>
                </div>
              </Card>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="rooms">Rooms</TabsTrigger>
                </TabsList>

                {/* Overview */}
                <TabsContent value="overview" className="space-y-4">
                  <Card className="p-6">
                    <h2 className="text-2xl font-display font-semibold mb-4">
                      About This Hotel
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {hotel.description}
                    </p>
                  </Card>
                </TabsContent>

                {/* Amenities */}
                <TabsContent value="amenities" className="space-y-4">
                  <Card className="p-6">
                    <h2 className="text-2xl font-display font-semibold mb-4">Amenities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {hotel.amenities.map((amenity) => {
                        const Icon = amenityIcons[amenity] || Coffee;
                        return (
                          <div
                            key={amenity}
                            className="flex items-center gap-3 p-3 rounded-lg bg-muted"
                          >
                            <Icon className="w-5 h-5 text-primary" />
                            <span>{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </TabsContent>

                {/* Rooms */}
                <TabsContent value="rooms" className="space-y-4">
                  {hotel.roomTypes.map((room) => (
                    <Card key={room.name} className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                          <p className="text-muted-foreground">
                            {room.available} rooms available
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">${room.price}</div>
                          <div className="text-sm text-muted-foreground">per night</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>

            {/* Booking Card */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 sticky top-24">
                <div className="mb-6">
                  <div className="text-3xl font-bold text-primary mb-1">${hotel.price}</div>
                  <div className="text-muted-foreground">per night</div>
                </div>

                <div className="space-y-4">
                  {/* Room Type */}
                  <div>
                    <Label className="mb-2 block">Room Type</Label>
                    <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        {hotel.roomTypes.map((room) => (
                          <SelectItem key={room.name} value={room.name}>
                            {room.name} - ${room.price}/night
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Check-in */}
                  <div>
                    <Label className="mb-2 block flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Check-in
                    </Label>
                    <Input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                    />
                  </div>

                  {/* Check-out */}
                  <div>
                    <Label className="mb-2 block flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Check-out
                    </Label>
                    <Input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                  </div>

                  {/* Guests */}
                  <div>
                    <Label className="mb-2 block">Guests</Label>
                    <Input
                      type="number"
                      min="1"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                    />
                  </div>

                  <Button
                    className="w-full bg-primary hover:bg-primary-light"
                    size="lg"
                    onClick={handleBooking}
                  >
                    Book Now
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    You won't be charged yet
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HotelDetails;
