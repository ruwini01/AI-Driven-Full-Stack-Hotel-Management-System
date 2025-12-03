import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Grid, List, SlidersHorizontal, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import HotelCard from "@/components/HotelCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllHotelsQuery } from "@/lib/api";

const Hotels = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedStars, setSelectedStars] = useState([]);
  const [sortBy, setSortBy] = useState("featured");

  // Fetch hotels from API
  const { data: hotels, isLoading, isError } = useGetAllHotelsQuery();

  // Get unique cities and amenities from API data
  const cities = useMemo(() => {
    if (!hotels) return [];
    return [...new Set(hotels.map(h => h.city))].sort();
  }, [hotels]);

  const allAmenities = useMemo(() => {
    if (!hotels) return [];
    return [...new Set(hotels.flatMap(h => h.amenities || []))].sort();
  }, [hotels]);

  // Filter hotels based on selected criteria
  const filteredHotels = useMemo(() => {
    if (!hotels) return [];

    return hotels.filter((hotel) => {
      // Price filter
      if (hotel.price < priceRange[0] || hotel.price > priceRange[1]) return false;

      // City filter
      if (selectedCities.length > 0 && !selectedCities.includes(hotel.city)) return false;

      // Star rating filter
      if (selectedStars.length > 0 && !selectedStars.includes(hotel.stars)) return false;

      // Amenities filter (hotel must have ALL selected amenities)
      if (selectedAmenities.length > 0) {
        const hasAllAmenities = selectedAmenities.every((amenity) =>
          hotel.amenities?.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }

      return true;
    });
  }, [hotels, priceRange, selectedCities, selectedStars, selectedAmenities]);

  // Sort hotels
  const sortedHotels = useMemo(() => {
    const sorted = [...filteredHotels];

    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "featured":
      default:
        return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [filteredHotels, sortBy]);

  const toggleCity = (city) => {
    setSelectedCities(prev =>
      prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
    );
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const toggleStar = (stars) => {
    setSelectedStars(prev =>
      prev.includes(stars) ? prev.filter(s => s !== stars) : [...prev, stars]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedCities([]);
    setSelectedAmenities([]);
    setSelectedStars([]);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Explore Our <span className="gradient-text">Hotels</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              {isLoading ? "Loading..." : `Find your perfect stay from ${hotels?.length || 0} luxury properties`}
            </p>
          </motion.div>

          <SearchBar className="mb-8" />

          {/* Error State */}
          {isError && (
            <div className="text-center py-12 glass-card">
              <p className="text-red-500 text-lg mb-4">
                Error loading hotels. Please try again later.
              </p>
              <Button onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-64 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Main Content */}
          {!isLoading && !isError && hotels && (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              {showFilters && (
                <motion.aside
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="w-full lg:w-80 space-y-6"
                >
                  <div className="glass-card p-6 sticky top-24">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <SlidersHorizontal className="w-5 h-5" /> Filters
                      </h2>
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="text-primary">
                        Clear All
                      </Button>
                    </div>

                    {/* Price Range */}
                    <div className="mb-6">
                      <Label className="mb-3 block">Price Range</Label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        min={0}
                        max={1000}
                        step={50}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>

                    {/* Cities */}
                    <div className="mb-6">
                      <Label className="mb-3 block">Location</Label>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {cities.map(city => (
                          <div key={city} className="flex items-center gap-2">
                            <Checkbox
                              id={city}
                              checked={selectedCities.includes(city)}
                              onCheckedChange={() => toggleCity(city)}
                            />
                            <label htmlFor={city} className="text-sm cursor-pointer">{city}</label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="mb-6">
                      <Label className="mb-3 block">Star Rating</Label>
                      <div className="space-y-2">
                        {[5, 4, 3].map(stars => (
                          <div key={stars} className="flex items-center gap-2">
                            <Checkbox
                              id={`${stars}-stars`}
                              checked={selectedStars.includes(stars)}
                              onCheckedChange={() => toggleStar(stars)}
                            />
                            <label htmlFor={`${stars}-stars`} className="text-sm cursor-pointer">
                              {stars} Stars
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Amenities */}
                    <div>
                      <Label className="mb-3 block">Amenities</Label>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {allAmenities.slice(0, 10).map(amenity => (
                          <div key={amenity} className="flex items-center gap-2">
                            <Checkbox
                              id={amenity}
                              checked={selectedAmenities.includes(amenity)}
                              onCheckedChange={() => toggleAmenity(amenity)}
                            />
                            <label htmlFor={amenity} className="text-sm cursor-pointer">{amenity}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.aside>
              )}

              {/* Hotel List */}
              <div className="flex-1">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-6 glass-card p-4">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="gap-2"
                    >
                      {showFilters ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
                      {showFilters ? "Hide" : "Show"} Filters
                    </Button>
                    <span className="text-muted-foreground">{sortedHotels.length} hotels found</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="name">Name (A-Z)</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex gap-2">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="icon"
                        onClick={() => setViewMode("grid")}
                      >
                        <Grid className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="icon"
                        onClick={() => setViewMode("list")}
                      >
                        <List className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Hotels Grid/List */}
                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}>
                  {sortedHotels.map((hotel, index) => (
                    <HotelCard key={hotel._id} hotel={hotel} index={index} />
                  ))}
                </div>

                {sortedHotels.length === 0 && (
                  <div className="text-center py-20">
                    <p className="text-xl text-muted-foreground">
                      No hotels match your filters. Try adjusting your search.
                    </p>
                    <Button onClick={clearFilters} className="mt-4">
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Hotels;