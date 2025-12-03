import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Home, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";

const Success = ({ email = "your@email.com" }) => {
  const navigate = useNavigate();

  // Generate stable booking ID
  const bookingId = useMemo(
    () => `#LUX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    []
  );

  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    let frameId;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#3b82f6", "#8b5cf6", "#ec4899"],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#3b82f6", "#8b5cf6", "#ec4899"],
      });

      if (Date.now() < end) {
        frameId = requestAnimationFrame(frame);
      }
    };

    frame();

    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center animated-gradient">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="glass-card p-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-24 h-24 text-success mx-auto mb-6" aria-hidden="true" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Booking <span className="gradient-text">Confirmed!</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Your payment was successful. We've sent a confirmation email with all the details.
              </p>

              <div className="bg-muted/50 rounded-lg p-6 mb-8 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Booking ID</p>
                    <p className="font-semibold">{bookingId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Confirmation Sent To</p>
                    <p className="font-semibold">{email}</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-8">
                You can view your booking details anytime in your account dashboard.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => navigate("/my-account")}
                  className="gap-2"
                  aria-label="View Booking"
                >
                  <FileText className="w-5 h-5" />
                  View Booking
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="gap-2"
                  aria-label="Back to Home"
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

export default Success;
