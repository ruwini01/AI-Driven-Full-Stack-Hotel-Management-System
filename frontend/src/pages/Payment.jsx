import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  CreditCard,
  User,
  Mail,
  Phone,
  Calendar,
  Users,
  MapPin,
  DollarSign,
} from "lucide-react";
import { useAddBookingMutation } from "@/lib/bookingApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "../components/Navbar";

// Replace with your Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ bookingData, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [addBooking] = useAddBookingMutation();

  const [loading, setLoading] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  // Pre-fill user data if available
  useEffect(() => {
    if (window.Clerk?.user) {
      setGuestName(window.Clerk.user.fullName || "");
      setEmail(window.Clerk.user.primaryEmailAddress?.emailAddress || "");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!guestName || !email || !phone) {
      toast.error("Please fill in all guest details");
      return;
    }

    setLoading(true);

    try {
      // 1. Create payment intent on your backend
      const paymentIntentResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/payments/create-payment-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await window.Clerk.session.getToken()}`,
          },
          body: JSON.stringify({
            amount: Math.round(bookingData.totalAmount * 100), // Convert to cents
            currency: "usd",
          }),
        }
      );

      if (!paymentIntentResponse.ok) {
        throw new Error("Failed to create payment intent");
      }

      const { clientSecret } = await paymentIntentResponse.json();

      // 2. Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: guestName,
            email: email,
            phone: phone,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // 3. Payment successful - NOW save booking to database
        const bookingPayload = {
          hotelId: bookingData.hotelId,
          roomNumber: bookingData.roomNumber,
          checkInDate: bookingData.checkIn,
          checkOutDate: bookingData.checkOut,
          numberOfGuests: bookingData.guests,
          numberOfRooms: 1,
          totalAmount: bookingData.totalAmount,
          paymentStatus: "PAID",
          paymentIntentId: paymentIntent.id,
          specialRequests: specialRequests || undefined,
          guestDetails: {
            name: guestName,
            email: email,
            phone: phone,
          },
        };

        const response = await addBooking(bookingPayload).unwrap();
        
        toast.success("Payment successful! Booking confirmed.");
        onSuccess(response._id);
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error(err.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Guest Details Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <User className="w-5 h-5" /> Guest Details
        </h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="guestName" className="flex items-center gap-2">
              <User className="w-4 h-4" /> Full Name *
            </Label>
            <Input
              id="guestName"
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" /> Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              required
            />
          </div>

          <div>
            <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
            <textarea
              id="specialRequests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Early check-in, high floor, etc."
              className="w-full p-3 border rounded-md min-h-[80px] resize-none"
              maxLength={500}
            />
            <p className="text-sm text-muted-foreground mt-1">
              {specialRequests.length}/500 characters
            </p>
          </div>
        </div>
      </Card>

      {/* Payment Details Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5" /> Payment Details
        </h2>

        <div className="p-4 border rounded-md bg-muted/50">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>

        <p className="text-sm text-muted-foreground mt-4">
          Your payment information is secure and encrypted
        </p>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
        size="lg"
        disabled={!stripe || loading}
      >
        {loading ? "Processing Payment..." : `Pay $${bookingData.totalAmount}`}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        By confirming your booking, you agree to our Terms & Conditions
      </p>
    </form>
  );
};

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Redirect if no booking data
  useEffect(() => {
    if (!state || !state.hotelId) {
      toast.error("No booking data found. Please start from hotel details.");
      navigate("/hotels");
    }
  }, [state, navigate]);

  if (!state) {
    return null;
  }

  const bookingData = state;

  const handlePaymentSuccess = (bookingId) => {
    navigate(`/booking-success/${bookingId}`);
  };

  const calculateNights = () => {
    const nights = Math.ceil(
      (new Date(bookingData.checkOut) - new Date(bookingData.checkIn)) /
        (1000 * 60 * 60 * 24)
    );
    return nights;
  };

  return (
    
    <div className="min-h-screen bg-background py-12">
        <Navbar/>
      <div className="container mx-auto px-4 max-w-6xl pt-10">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            ← Back to Hotel
          </Button>
          <h1 className="text-3xl font-bold">Complete Your Booking</h1>
          <p className="text-muted-foreground mt-2">
            Review your booking details and complete payment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>

              {/* Hotel Image */}
              {bookingData.hotelImage && (
                <img
                  src={bookingData.hotelImage}
                  alt={bookingData.hotelName}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}

              {/* Hotel Details */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{bookingData.hotelName}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {bookingData.hotelLocation}
                  </p>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Room Type:</span>
                    <span className="font-medium">{bookingData.roomNumber}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Check-in:
                    </span>
                    <span className="font-medium">
                      {new Date(bookingData.checkIn).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Check-out:
                    </span>
                    <span className="font-medium">
                      {new Date(bookingData.checkOut).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Users className="w-4 h-4" /> Guests:
                    </span>
                    <span className="font-medium">{bookingData.guests}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Nights:</span>
                    <span className="font-medium">{calculateNights()}</span>
                  </div>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      ${bookingData.totalAmount / calculateNights()} × {calculateNights()}{" "}
                      nights
                    </span>
                    <span>${bookingData.totalAmount}</span>
                  </div>

                  <div className="flex items-center justify-between font-semibold text-lg pt-2 border-t">
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-5 h-5" /> Total
                    </span>
                    <span className="text-primary">${bookingData.totalAmount}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Elements stripe={stripePromise}>
              <CheckoutForm
                bookingData={bookingData}
                onSuccess={handlePaymentSuccess}
              />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;