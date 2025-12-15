import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLazyGetSessionStatusQuery } from "@/lib/paymentApi";
import { CheckCircle2, XCircle, Loader2, MapPin, Calendar, Users, Mail, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "../components/Navbar";

const BookingComplete = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  const [getSessionStatus, { data, isLoading, error }] = useLazyGetSessionStatusQuery();
  const [statusChecked, setStatusChecked] = useState(false);

  useEffect(() => {
    if (sessionId && !statusChecked) {
      console.log("Checking session status for:", sessionId);
      getSessionStatus(sessionId);
      setStatusChecked(true);
    }
  }, [sessionId, getSessionStatus, statusChecked]);

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-background py-12">
        <Navbar />
        <div className="container mx-auto px-4 max-w-2xl pt-10">
          <Card className="p-8 text-center">
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Invalid Session</h1>
            <p className="text-muted-foreground mb-6">
              No session ID found. Please start a new booking.
            </p>
            <Button onClick={() => navigate("/hotels")}>
              Browse Hotels
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <Navbar />
        <div className="container mx-auto px-4 max-w-2xl pt-10">
          <Card className="p-12 text-center">
            <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Processing Your Payment</h2>
            <p className="text-muted-foreground">
              Please wait while we confirm your booking...
            </p>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-12">
        <Navbar />
        <div className="container mx-auto px-4 max-w-2xl pt-10">
          <Card className="p-8 text-center">
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Something Went Wrong</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't retrieve your booking details. Please contact support.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate("/hotels")}>
                Browse Hotels
              </Button>
              <Button onClick={() => navigate("/bookings")}>
                My Bookings
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { booking, hotel, status, paymentStatus, customer_email } = data;

  const isSuccess = status === "complete" && paymentStatus === "PAID";

  const calculateNights = () => {
    if (!booking) return 0;
    const nights = Math.ceil(
      (new Date(booking.checkOutDate) - new Date(booking.checkInDate)) /
        (1000 * 60 * 60 * 24)
    );
    return nights;
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <Navbar />
      <div className="container mx-auto px-4 max-w-3xl pt-10">
        {isSuccess ? (
          // Success State
          <Card className="p-8">
            <div className="text-center mb-8">
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Booking Confirmed! 🎉</h1>
              <p className="text-muted-foreground">
                Your payment was successful and your reservation is confirmed.
              </p>
            </div>

            <Separator className="my-6" />

            {/* Booking Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
                
                {hotel?.images?.[0] && (
                  <img
                    src={hotel.images[0]}
                    alt={hotel.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}

                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{hotel?.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {hotel?.location}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Check-in</p>
                      <p className="font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(booking.checkInDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Check-out</p>
                      <p className="font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(booking.checkOutDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Guests</p>
                      <p className="font-medium flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {booking.numberOfGuests} {booking.numberOfGuests === 1 ? 'Guest' : 'Guests'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Nights</p>
                      <p className="font-medium">
                        {calculateNights()} {calculateNights() === 1 ? 'Night' : 'Nights'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Guest Details */}
              <div>
                <h3 className="font-semibold mb-3">Guest Information</h3>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Name:</span> 
                    <span className="font-medium">{booking.guestDetails.name}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Email:</span> 
                    <span className="font-medium">{booking.guestDetails.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Phone:</span> 
                    <span className="font-medium">{booking.guestDetails.phone}</span>
                  </p>
                </div>
              </div>

              <Separator />

              {/* Payment Summary */}
              <div>
                <h3 className="font-semibold mb-3">Payment Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      ${(booking.totalAmount / calculateNights()).toFixed(2)} × {calculateNights()} nights
                    </span>
                    <span>${booking.totalAmount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Paid</span>
                    <span className="text-primary">${booking.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {booking.specialRequests && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Special Requests</h3>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                      {booking.specialRequests}
                    </p>
                  </div>
                </>
              )}
            </div>

            <Separator className="my-6" />

            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg mb-6">
              <p className="text-sm text-center">
                📧 A confirmation email has been sent to <strong>{customer_email || booking.guestDetails.email}</strong>
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => navigate("/hotels")}
              >
                Browse More Hotels
              </Button>
              <Button onClick={() => navigate("/bookings")}>
                View My Bookings
              </Button>
            </div>
          </Card>
        ) : (
          // Pending/Failed State
          <Card className="p-8 text-center">
            <XCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Payment Processing</h1>
            <p className="text-muted-foreground mb-6">
              Your payment is being processed. This may take a few moments.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Status: <span className="font-medium">{status}</span>
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Refresh Status
              </Button>
              <Button onClick={() => navigate("/bookings")}>
                View Bookings
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BookingComplete;
