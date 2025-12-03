import { motion } from "framer-motion";
import { XCircle, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="p-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <XCircle className="w-24 h-24 text-destructive mx-auto mb-6" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Booking <span className="text-destructive">Cancelled</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Your booking was cancelled and no charges were made to your account.
              </p>

              <div className="bg-muted rounded-lg p-6 mb-8">
                <p className="text-muted-foreground">
                  If you experienced any issues during the booking process,
                  please don't hesitate to contact our support team. We're here to help!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => navigate("/hotels")}
                  className="bg-primary hover:bg-primary-light gap-2"
                >
                  <Search className="w-5 h-5" />
                  Browse Hotels
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="gap-2"
                >
                  <Home className="w-5 h-5" />
                  Back to Home
                </Button>
              </div>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Cancel;
