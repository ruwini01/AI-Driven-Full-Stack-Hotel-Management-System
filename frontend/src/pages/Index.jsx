import { motion } from "framer-motion";
import { Star, TrendingUp, Shield, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import HotelCard from "@/components/HotelCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllHotelsQuery } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-hotel.jpg";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  
  // Fetch hotels from API instead of mock data
  const { data: hotels, isLoading, isError, error } = useGetAllHotelsQuery();
  
  // Debug logging
  useEffect(() => {
    console.log("Hotels data:", hotels);
    console.log("Is loading:", isLoading);
    console.log("Is error:", isError);
    console.log("Error details:", error);
  }, [hotels, isLoading, isError, error]);
  
  // Filter featured hotels from API response
  const featuredHotels = hotels?.filter(hotel => hotel.featured) || [];

  const features = [
    {
      icon: Star,
      title: "Best Price Guarantee",
      description: "Find the best deals or we'll refund the difference",
    },
    {
      icon: Shield,
      title: "Secure Booking",
      description: "Your data is safe with our secure payment system",
    },
    {
      icon: TrendingUp,
      title: "AI-Powered Search",
      description: "Smart recommendations tailored to your preferences",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer service whenever you need",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 animated-gradient" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
              <span className="gradient-text">Discover Your</span>
              <br />
              <span className="text-foreground">Perfect Stay</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Experience luxury accommodations with AI-powered recommendations
              tailored just for you
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <SearchBar className="max-w-5xl mx-auto" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-4 mt-8"
          >
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/ai-search")}
              className="glass hover:bg-primary/10 gap-2"
            >
              <Star className="w-5 h-5" />
              Try AI Search
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Why Choose <span className="gradient-text">LuxStay</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We make hotel booking simple, secure, and smart
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card text-center hover-lift"
              >
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Featured <span className="gradient-accent-text">Destinations</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Handpicked luxury hotels from around the world
            </p>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-64 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg mb-4">
                Error loading hotels. Please try again later.
              </p>
              <p className="text-sm text-muted-foreground">
                {error?.status && `Status: ${error.status} - `}
                {error?.data?.message || error?.error || "Unknown error"}
              </p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Success State */}
          {!isLoading && !isError && featuredHotels.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredHotels.slice(0, 6).map((hotel, index) => (
                  <HotelCard key={hotel._id} hotel={hotel} index={index} />
                ))}
              </div>

              <div className="text-center">
                <Button
                  size="lg"
                  onClick={() => navigate("/hotels")}
                  className="bg-primary hover:bg-primary-light"
                >
                  Explore All Hotels
                </Button>
              </div>
            </>
          )}

          {/* No Hotels State */}
          {!isLoading && !isError && featuredHotels.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No featured hotels available at the moment.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Total hotels loaded: {hotels?.length || 0}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 animated-gradient">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card max-w-3xl mx-auto py-16 px-8"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-white">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of travelers who trust LuxStay for their perfect getaway
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("/hotels")}
                className="text-lg"
              >
                Browse Hotels
              </Button>
              <Button
                size="lg"
                onClick={() => navigate("/ai-search")}
                className="bg-accent hover:bg-accent-light text-accent-foreground text-lg"
              >
                Try AI Search
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;