import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  XCircle,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useGetUserBookingsQuery, useCancelBookingMutation } from "@/lib/bookingApi";
import { useToast } from "@/hooks/use-toast";

const BookingHistory = ({ userId }) => {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { toast } = useToast();

  const {
    data: bookingsData,
    isLoading,
    isError,
    error,
    refetch
  } = useGetUserBookingsQuery({
    userId,
    status: statusFilter,
    page: currentPage,
    limit: 6
  }, {
    skip: !userId
  });

  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();

  const handleNavigate = (path) => {
    window.location.href = path;
  };

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedBooking) return;

    try {
      await cancelBooking({
        bookingId: selectedBooking._id,
        userId
      }).unwrap();

      toast({
        title: "Booking Cancelled",
        description: "Your booking has been successfully cancelled.",
      });

      setCancelDialogOpen(false);
      setSelectedBooking(null);
      refetch();
    } catch (error) {
      toast({
        title: "Cancellation Failed",
        description: error?.data?.message || "Failed to cancel booking. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PAID: { label: "Paid", className: "bg-success/10 text-success", icon: CheckCircle },
      PENDING: { label: "Pending", className: "bg-warning/10 text-warning", icon: Clock },
      CANCELLED: { label: "Cancelled", className: "bg-destructive/10 text-destructive", icon: XCircle },
      REFUNDED: { label: "Refunded", className: "bg-secondary/10 text-secondary-foreground", icon: AlertCircle }
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <Badge className={`${config.className} gap-1 border-0`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getBookingStatus = (booking) => {
    const now = new Date();
    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);

    if (booking.paymentStatus === 'CANCELLED' || booking.paymentStatus === 'REFUNDED') {
      return 'CANCELLED';
    }
    if (now < checkIn) return 'UPCOMING';
    if (now >= checkIn && now <= checkOut) return 'ACTIVE';
    return 'COMPLETED';
  };

  const canCancelBooking = (booking) => {
    const checkIn = new Date(booking.checkInDate);
    const now = new Date();
    return (
      booking.paymentStatus !== 'CANCELLED' &&
      booking.paymentStatus !== 'REFUNDED' &&
      now < checkIn
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="glass-card text-center py-12">
        <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Error Loading Bookings</h3>
        <p className="text-muted-foreground mb-4">
          {error?.data?.message || "Failed to load your bookings. Please try again."}
        </p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  const bookings = bookingsData?.data?.bookings || [];
  const pagination = bookingsData?.data?.pagination || {};
  const statistics = bookingsData?.data?.statistics || {};

  if (bookings.length === 0) {
    return (
      <div className="glass-card text-center py-16">
        <Calendar className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-2xl font-display font-bold mb-2">No Bookings Found</h3>
        <p className="text-muted-foreground mb-6">
          {statusFilter === "ALL" 
            ? "You haven't made any bookings yet. Start exploring our hotels!"
            : `No ${statusFilter.toLowerCase()} bookings found.`}
        </p>
        <Button onClick={() => handleNavigate('/hotels')}>
          Browse Hotels
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="glass-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold mb-1">My Bookings</h2>
          <p className="text-sm text-muted-foreground">
            {statistics.total} total bookings • {statistics.paid} paid • {statistics.pending} pending
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Bookings</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {bookings.map((booking, index) => {
          const hotel = booking.hotelId;
          const bookingStatus = getBookingStatus(booking);

          return (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card hover-lift"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Hotel Image */}
                <div className="lg:w-64 h-48 lg:h-auto rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {hotel?.images?.[0] ? (
                    <img
                      src={hotel.images[0]}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Booking Details */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-display font-bold mb-1">
                        {hotel?.name || "Hotel Name"}
                      </h3>
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <MapPin className="w-4 h-4" />
                        {hotel?.city}, {hotel?.location}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(booking.paymentStatus)}
                      <Badge variant="outline">{bookingStatus}</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Check-in</p>
                        <p className="font-medium">
                          {new Date(booking.checkInDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Check-out</p>
                        <p className="font-medium">
                          {new Date(booking.checkOutDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Guests</p>
                        <p className="font-medium">{booking.numberOfGuests} Guests</p>
                      </div>
                    </div>
                  </div>

                  {booking.roomNumber && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">
                        Room Number: <span className="font-medium text-foreground">{booking.roomNumber}</span>
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                      <p className="text-2xl font-bold gradient-text">
                        ${booking.totalAmount.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleNavigate(`/hotels/${hotel._id}`)}
                      >
                        View Hotel
                      </Button>
                      {canCancelBooking(booking) && (
                        <Button
                          variant="destructive"
                          onClick={() => handleCancelClick(booking)}
                          disabled={isCancelling}
                        >
                          Cancel Booking
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination.total > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <span className="text-sm text-muted-foreground">
            Page {pagination.current} of {pagination.total}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(pagination.total, p + 1))}
            disabled={currentPage === pagination.total}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your booking at{" "}
              <strong>{selectedBooking?.hotelId?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isCancelling}
            >
              {isCancelling ? "Cancelling..." : "Cancel Booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BookingHistory;