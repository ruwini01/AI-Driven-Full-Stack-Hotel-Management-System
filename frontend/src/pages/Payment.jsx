import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import {
  CreditCard,
  User,
  Mail,
  Phone,
  Calendar,
  Users,
  MapPin,
  DollarSign,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAddBookingMutation } from "@/lib/bookingApi";
import { useCreateCheckoutSessionMutation } from "@/lib/paymentApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "../components/Navbar";

// Log Stripe key for debugging (first 10 chars only)
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
console.log("Stripe Key Present:", !!stripeKey);
console.log("Stripe Key Preview:", stripeKey?.substring(0, 10) + "...");

const stripePromise = loadStripe(stripeKey);

// Verify Stripe loads
stripePromise.then(stripe => {
  console.log("Stripe loaded successfully:", !!stripe);
}).catch(error => {
  console.error("Stripe failed to load:", error);
});

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [addBooking] = useAddBookingMutation();
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();

  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [stripeLoadError, setStripeLoadError] = useState(false);

  // Guest details state
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  // Verify Stripe loads correctly
  useEffect(() => {
    stripePromise.catch((error) => {
      console.error("Stripe failed to load:", error);
      setStripeLoadError(true);
      toast.error("Payment system failed to initialize. Please refresh the page.");
    });
  }, []);

  // Redirect if no booking data
  useEffect(() => {
    if (!state || !state.hotelId) {
      toast.error("No booking data found. Please start from hotel details.");
      navigate("/hotels");
    }
  }, [state, navigate]);

  // Pre-fill user data if available
  useEffect(() => {
    if (window.Clerk?.user) {
      setGuestName(window.Clerk.user.fullName || "");
      setEmail(window.Clerk.user.primaryEmailAddress?.emailAddress || "");
    }
  }, []);

  // Debug: Log when clientSecret changes
  useEffect(() => {
    console.log("=== Client Secret Updated ===");
    console.log("Value:", clientSecret);
    console.log("Type:", typeof clientSecret);
    console.log("Length:", clientSecret?.length);
    console.log("Starts with cs_:", clientSecret?.startsWith('cs_'));
  }, [clientSecret]);

  if (!state) {
    return null;
  }

  const bookingData = state;

  const calculateNights = () => {
    const nights = Math.ceil(
      (new Date(bookingData.checkOut) - new Date(bookingData.checkIn)) /
      (1000 * 60 * 60 * 24)
    );
    return nights;
  };

  const handleProceedToPayment = async (e) => {
    e.preventDefault();

    console.log("=== Proceeding to Payment ===");

    // Validate guest details
    if (!guestName || !email || !phone) {
      toast.error("Please fill in all guest details");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Create booking in database (PENDING status)
      const bookingPayload = {
        hotelId: bookingData.hotelId,
        roomNumber: bookingData.roomNumber || "Standard Room",
        checkInDate: bookingData.checkIn,
        checkOutDate: bookingData.checkOut,
        numberOfGuests: bookingData.guests || 1,
        numberOfRooms: bookingData.numberOfRooms || 1,
        totalAmount: bookingData.totalAmount,
        specialRequests: specialRequests || "",
        guestDetails: {
          name: guestName,
          email: email,
          phone: phone,
        },
      };

      console.log("1. Creating booking with payload:", bookingPayload);
      const bookingResponse = await addBooking(bookingPayload).unwrap();
      console.log("2. Booking created successfully:", bookingResponse);

      const createdBookingId = bookingResponse.data._id;
      setBookingId(createdBookingId);

      // Step 2: Create Stripe checkout session with bookingId
      console.log("3. Creating checkout session for booking:", createdBookingId);
      const sessionResponse = await createCheckoutSession(createdBookingId).unwrap();
      console.log("4. Full session response:", sessionResponse);
      console.log("5. Client secret from response:", sessionResponse.clientSecret);

      // Validate response
      if (!sessionResponse) {
        throw new Error("No response from checkout session creation");
      }

      if (!sessionResponse.clientSecret) {
        console.error("Response missing clientSecret:", sessionResponse);
        throw new Error("Invalid checkout session response - missing clientSecret");
      }

      // Verify clientSecret format
      const secret = sessionResponse.clientSecret;
      console.log("6. Validating client secret...");
      console.log("   - Type:", typeof secret);
      console.log("   - Length:", secret.length);
      console.log("   - First 20 chars:", secret.substring(0, 20));
      console.log("   - Starts with 'cs_':", secret.startsWith('cs_'));

      if (!secret.startsWith('cs_')) {
        throw new Error("Invalid client secret format - should start with 'cs_'");
      }

      console.log("7. Setting client secret and showing checkout");
      setClientSecret(secret);
      setShowCheckout(true);
      setLoading(false);

      toast.success("Booking created! Please complete payment.");
      console.log("8. Payment form should now be visible");
    } catch (err) {
      console.error("=== Error in handleProceedToPayment ===");
      console.error("Error object:", err);
      console.error("Error message:", err?.message);
      console.error("Error data:", err?.data);
      
      const errorMessage = err?.data?.message || err.message || "Failed to initialize payment";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <Navbar />
      <div className="container mx-auto px-4 max-w-6xl pt-10">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
            disabled={loading || showCheckout}
          >
            ← Back to Hotel
          </Button>
          <h1 className="text-3xl font-bold">Complete Your Booking</h1>
          <p className="text-muted-foreground mt-2">
            {showCheckout ? "Complete your payment" : "Enter your details and proceed to payment"}
          </p>
        </div>

        {/* Stripe Load Error Warning */}
        {stripeLoadError && (
          <div className="mb-6 bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Payment System Error</p>
              <p className="text-sm mt-1">
                The payment system failed to initialize. Please refresh the page or contact support.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Summary - Left Side */}
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
                    <span className="font-medium">{bookingData.roomNumber || "Standard Room"}</span>
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
                    <span className="font-medium">{bookingData.guests || 1}</span>
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
                      ${(bookingData.totalAmount / calculateNights()).toFixed(2)} × {calculateNights()}{" "}
                      nights
                    </span>
                    <span>${bookingData.totalAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between font-semibold text-lg pt-2 border-t">
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-5 h-5" /> Total
                    </span>
                    <span className="text-primary">${bookingData.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content - Right Side */}
          <div className="lg:col-span-2">
            {!showCheckout ? (
              // Guest Details Form
              <form onSubmit={handleProceedToPayment} className="space-y-6">
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
                        disabled={loading}
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
                        disabled={loading}
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
                        disabled={loading}
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
                        disabled={loading}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        {specialRequests.length}/500 characters
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Error Display */}
                {error && (
                  <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Error</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                  disabled={loading || stripeLoadError}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Booking...
                    </>
                  ) : (
                    <>
                      Proceed to Payment
                      <CreditCard className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By proceeding, you agree to our Terms & Conditions
                </p>
              </form>
            ) : (
              // Stripe Embedded Checkout
              <Card className="p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2">Payment</h2>
                  <p className="text-sm text-muted-foreground">
                    Booking created for <strong>{guestName}</strong> • {email}
                  </p>
                  {bookingId && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Booking ID: {bookingId}
                    </p>
                  )}
                </div>

                <Separator className="mb-6" />

                {loading && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Initializing secure payment...</p>
                  </div>
                )}

                {error && (
                  <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold">Payment Error</p>
                      <p className="text-sm mt-1">{error}</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                          setShowCheckout(false);
                          setClientSecret(null);
                          setError(null);
                        }}
                      >
                        Go Back
                      </Button>
                    </div>
                  </div>
                )}

                {/* Debug info - shows in development */}
                {import.meta.env.DEV && clientSecret && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded text-xs font-mono space-y-1">
                    <div className="font-bold text-blue-700 dark:text-blue-300">Debug Info:</div>
                    <div>Client Secret: {clientSecret ? '✓ Present' : '✗ Missing'}</div>
                    <div>Starts with cs_: {clientSecret?.startsWith('cs_') ? '✓ Yes' : '✗ No'}</div>
                    <div>Length: {clientSecret?.length || 0} chars</div>
                    <div>Loading: {loading ? 'Yes' : 'No'}</div>
                    <div>Error: {error || 'None'}</div>
                    <div>Show Checkout: {showCheckout ? 'Yes' : 'No'}</div>
                  </div>
                )}

                {clientSecret && !loading && !error && (
                  <div className="stripe-checkout-container min-h-[400px]">
                    <EmbeddedCheckoutProvider
                      stripe={stripePromise}
                      options={{ clientSecret }}
                    >
                      <EmbeddedCheckout />
                    </EmbeddedCheckoutProvider>
                  </div>
                )}

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-center text-muted-foreground">
                    🔒 Your payment is secure and encrypted by Stripe
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;