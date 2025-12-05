import { motion } from "framer-motion";
import { Star, MapPin, Wifi, Utensils, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const HotelCard = ({ hotel, index = 0 }) => {
  const navigate = useNavigate();

  const amenityIcons = {
    WiFi: Wifi,
    Restaurant: Utensils,
    Gym: Dumbbell,
  };

  const hotelImage = hotel.images?.[0] || "/placeholder.svg";
  const displayPrice = hotel.roomTypes && hotel.roomTypes.length > 0
    ? Math.min(...hotel.roomTypes.map(rt => rt.price))
    : hotel.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card hover-lift cursor-pointer group"
      onClick={() => navigate(`/hotels/${hotel._id}`)}
    >
      
      {/* Image */} <div className="relative h-64 rounded-xl overflow-hidden mb-4"> <div className="absolute inset-0 bg-gradient-to-t from-black/50 dark:from-black/30 to-transparent z-10" />
        <img
          src={hotelImage}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
        />
        {hotel.featured && (<Badge className="absolute top-4 right-4 z-20 bg-accent text-accent-foreground dark:bg-accent-light dark:text-accent-foreground">
          Featured </Badge>
        )} <div className="absolute bottom-4 left-4 z-20 text-white dark:text-gray-200"> <div className="flex items-center gap-1 mb-1">
          {[...Array(hotel.stars || 5)].map((_, i) => (<Star key={i} className="w-4 h-4 fill-accent text-accent dark:fill-accent-light dark:text-accent-light" />
          ))} </div> </div> </div>


      {/* Content */}
      <div className="space-y-3">
        <div>
          <h3 className="text-xl font-display font-semibold mb-1 group-hover:text-primary dark:group-hover:text-primary transition-colors">
            {hotel.name}
          </h3>
          <div className="flex items-center gap-1 text-muted-foreground dark:text-muted-foreground text-sm">
            <MapPin className="w-4 h-4" />
            <span>{hotel.city}, {hotel.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-primary/10 dark:bg-primary/20 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 fill-primary text-primary dark:fill-primary-light dark:text-primary-light" />
              <span className="font-semibold text-primary dark:text-primary-light">{hotel.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground dark:text-muted-foreground">
              ({hotel.reviews || 0} reviews)
            </span>
          </div>
        </div>

        {/* Amenities */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {hotel.amenities.slice(0, 3).map((amenity) => {
              const Icon = amenityIcons[amenity];
              return (
                <div
                  key={amenity}
                  className="flex items-center gap-1 text-xs bg-muted dark:bg-muted-foreground/20 px-2 py-1 rounded-lg"
                >
                  {Icon && <Icon className="w-3 h-3" />}
                  <span>{amenity}</span>
                </div>
              );
            })}
            {hotel.amenities.length > 3 && (
              <div className="text-xs text-muted-foreground dark:text-muted-foreground">
                +{hotel.amenities.length - 3} more
              </div>
            )}
          </div>
        )}

        <div className="pt-3 border-t border-border dark:border-border flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary dark:text-primary-light">${displayPrice}</span>
            <span className="text-sm text-muted-foreground dark:text-muted-foreground">/night</span>
          </div>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary-light dark:bg-primary-light dark:hover:bg-primary text-white border-0"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/hotels/${hotel._id}`);
            }}
          >
            View Details
          </Button>
        </div>
      </div>
    </motion.div>


  );
};

export default HotelCard;
