import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Search, Loader2, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HotelCard from "@/components/HotelCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { mockHotels } from "@/data/mockHotels";
import { toast } from "sonner";

const AISearch = () => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const exampleQueries = [
    "Find luxury beachfront hotels under $400 in tropical locations",
    "Show me 5-star mountain resorts with spa facilities",
    "Budget-friendly hotels near city center with good ratings",
    "Romantic getaway destinations with ocean views",
  ];

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    setIsSearching(true);
    setSearchPerformed(true);

    // Simulate AI search with mock results
    setTimeout(() => {
      const keywords = query.toLowerCase();
      const filtered = mockHotels.filter(hotel => {
        const hotelText = `${hotel.name} ${hotel.location} ${hotel.city} ${hotel.description} ${hotel.amenities.join(" ")}`.toLowerCase();
        
        if (keywords.includes("under")) {
          const priceMatch = keywords.match(/under\s*\$?(\d+)/);
          if (priceMatch && hotel.price > parseInt(priceMatch[1])) {
            return false;
          }
        }

        if (keywords.includes("5-star") || keywords.includes("luxury")) {
          return hotel.stars === 5;
        }

        if (keywords.includes("beach") && hotel.location.toLowerCase().includes("ocean")) {
          return true;
        }
        if (keywords.includes("mountain") && hotel.location.toLowerCase().includes("alps")) {
          return true;
        }
        if (keywords.includes("city") && (hotel.city.includes("New York") || hotel.city.includes("Dubai"))) {
          return true;
        }

        return hotelText.includes(keywords.split(" ")[0]);
      });

      setResults(filtered.length > 0 ? filtered : mockHotels.slice(0, 4));
      setIsSearching(false);
      toast.success(`Found ${filtered.length > 0 ? filtered.length : 4} hotels matching your criteria`);
    }, 1500);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setSearchPerformed(false);
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
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-12 h-12 text-primary animate-pulse-glow" />
              <h1 className="text-4xl md:text-5xl font-display font-bold">
                <span className="gradient-text">AI-Powered</span> Hotel Search
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Describe your perfect hotel in natural language and let our AI find the best matches
            </p>
          </motion.div>

          {/* Search Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <div className="glass-card p-6">
              <Textarea
                placeholder="E.g., Find me a luxury beachfront hotel with spa facilities under $500 per night..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-[120px] mb-4 text-lg"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Press Enter to search
                  </span>
                  {searchPerformed && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSearch}
                      className="gap-2"
                    >
                      <X className="w-4 h-4" />
                      Clear
                    </Button>
                  )}
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-primary hover:bg-primary-light gap-2"
                  size="lg"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Example Queries */}
            {!searchPerformed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6"
              >
                <p className="text-sm text-muted-foreground mb-3">
                  Try these example searches:
                </p>
                <div className="flex flex-wrap gap-2">
                  {exampleQueries.map((example) => (
                    <Badge
                      key={example}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary/10 transition-colors py-2 px-4"
                      onClick={() => setQuery(example)}
                    >
                      {example}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Results */}
          {isSearching && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">
                  AI is analyzing your request...
                </p>
              </div>
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-semibold">
                  Search Results ({results.length})
                </h2>
                <Badge className="bg-accent text-accent-foreground gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI Matched
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((hotel, index) => (
                  <HotelCard key={hotel.id} hotel={hotel} index={index} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Features */}
          {!searchPerformed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                {
                  title: "Natural Language",
                  description: "Search hotels the way you think - just describe what you want",
                },
                {
                  title: "Smart Matching",
                  description: "AI understands context and finds hotels that truly match your needs",
                },
                {
                  title: "Instant Results",
                  description: "Get personalized recommendations in seconds, not hours",
                },
              ].map((feature, index) => (
                <div key={index} className="glass-card p-6 text-center">
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AISearch;
