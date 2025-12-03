import { useState } from "react";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ className = "" }) => {
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/hotels");
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`glass-card p-4 ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Location */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Where are you going?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10 bg-background/50"
          />
        </div>

        {/* Check-in */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="date"
            placeholder="Check-in"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="pl-10 bg-background/50"
          />
        </div>

        {/* Check-out */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="date"
            placeholder="Check-out"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="pl-10 bg-background/50"
          />
        </div>

        {/* Guests */}
        <div className="relative flex gap-2">
          <div className="flex-1 relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="number"
              min="1"
              placeholder="Guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>
          <Button type="submit" size="lg" className="bg-primary hover:bg-primary-light">
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;