import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star, MapPin, Wifi, Utensils, Dumbbell, Car, Coffee,
  ChevronLeft, ChevronRight, Calendar,
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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

import { useGetHotelByIdQuery } from "@/lib/api";
import { useGetUserBookingsQuery } from "@/lib/bookingApi";
import { toast } from "sonner";

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: hotel, isLoading, isError } = useGetHotelByIdQuery(id);

  const [currentImage, setCurrentImage] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [selectedRoom, setSelectedRoom] = useState("");

  const { data: bookings = [] } = useGetUserBookingsQuery({
    userId: window.Clerk?.user?.id,
    status: "ALL",
  });

  const unavailableDates = useMemo(() => {
    if (!selectedRoom || !bookings.length) return [];

    return bookings
      .filter((b) => b.roomNumber === selectedRoom)
      .flatMap((b) => {
        const start = new Date(b.checkInDate);
        const end = new Date(b.checkOutDate);
        const roomDates = [];
        for (let d = new Date(start); d < end; d = new Date(d.getTime() + 86400000)) {
          roomDates.push(d.toISOString().split("T")[0]);
        }
        return roomDates;
      });
  }, [bookings, selectedRoom]);

  const isDateUnavailable = (date) => unavailableDates.includes(date);

  const calculateTotalAmount = () => {
    if (!checkIn || !checkOut || !selectedRoom) return 0;
    
    const nights = Math.ceil(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    );
    
    const roomType = hotel?.roomTypes.find((r) => r.name === selectedRoom);
    const pricePerNight = roomType?.price || hotel?.price || 0;
    
    return nights * pricePerNight;
  };

  const handleProceedToPayment = () => {
    if (!checkIn || !checkOut || !selectedRoom) {
      toast.error("Please fill in all booking details");
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(checkIn) < today) {
      toast.error("Check-in date cannot be in the past");
      return;
    }

    const selectedDates = [];
    for (
      let d = new Date(checkIn);
      d < new Date(checkOut);
      d = new Date(d.getTime() + 86400000)
    ) {
      selectedDates.push(d.toISOString().split("T")[0]);
    }

    const conflict = selectedDates.some((d) => isDateUnavailable(d));
    if (conflict) {
      toast.error("Selected dates are not available. Please choose other dates.");
      return;
    }

    // Pass data to payment page WITHOUT saving to database
    const bookingData = {
      hotelId: hotel._id,
      hotelName: hotel.name,
      hotelImage: hotel.images[0],
      hotelLocation: hotel.location,
      roomNumber: selectedRoom,
      checkIn,
      checkOut,
      guests: Number(guests),
      totalAmount: calculateTotalAmount(),
    };

    navigate("/payment", { state: bookingData });
  };

  const amenityIcons = {
    WiFi: Wifi,
    Restaurant: Utensils,
    Gym: Dumbbell,
    Parking: Car,
    "Room Service": Coffee,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-semibold">Loading hotel details...</h1>
      </div>
    );
  }

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

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % hotel.images.length);
  const prevImage = () =>
    setCurrentImage((prev) => (prev - 1 + hotel.images.length) % hotel.images.length);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2">
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>

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
            <div className="lg:col-span-2 space-y-8">
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

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="rooms">Rooms</TabsTrigger>
                </TabsList>

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
                          <div className="text-2xl font-bold text-primary">
                            ${room.price}
                          </div>
                          <div className="text-sm text-muted-foreground">per night</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <div className="mb-6">
                  <div className="text-3xl font-bold text-primary mb-1">
                    ${hotel.price}
                  </div>
                  <div className="text-muted-foreground">per night</div>
                </div>

                <div className="space-y-4">
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

                  <div>
                    <Label className="mb-2 block flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Check-in
                    </Label>
                    <Input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div>
                    <Label className="mb-2 block flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Check-out
                    </Label>
                    <Input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div>
                    <Label className="mb-2 block">Guests</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                    />
                  </div>

                  {checkIn && checkOut && selectedRoom && (
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-muted-foreground">Total</span>
                        <span className="text-2xl font-bold text-primary">
                          ${calculateTotalAmount()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {Math.ceil(
                          (new Date(checkOut) - new Date(checkIn)) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        nights
                      </p>
                    </div>
                  )}

                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                    onClick={handleProceedToPayment}
                  >
                    Proceed to Payment
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    You won't be charged yet
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HotelDetails;