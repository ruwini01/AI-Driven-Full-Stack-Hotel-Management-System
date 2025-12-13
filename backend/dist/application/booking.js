"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBooking = exports.getBookingStats = exports.cancelBooking = exports.getBookingById = exports.getUserBookings = void 0;
const Booking_1 = __importDefault(require("../infrastructure/entities/Booking"));
const Hotel_1 = __importDefault(require("../infrastructure/entities/Hotel"));
const mongodb_1 = require("mongodb");
// Helper function to get user ID from Clerk auth
const getUserId = (req) => {
    const auth = req.auth?.() || {};
    return auth?.userId || auth?.sessionClaims?.sub || null;
};
const getUserBookings = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status, page = 1, limit = 10, sortBy = 'createdAt' } = req.query;
        const authenticatedUserId = getUserId(req);
        if (!authenticatedUserId || authenticatedUserId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access'
            });
        }
        const query = { userId };
        if (status && status !== 'ALL') {
            query.paymentStatus = status;
        }
        const skip = (Number(page) - 1) * Number(limit);
        const bookings = await Booking_1.default.find(query)
            .populate({
            path: 'hotelId',
            select: 'name location city images rating amenities price'
        })
            .sort({ [sortBy]: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean();
        const total = await Booking_1.default.countDocuments(query);
        const stats = await Booking_1.default.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: '$paymentStatus',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$totalAmount' }
                }
            }
        ]);
        return res.status(200).json({
            success: true,
            data: {
                bookings,
                pagination: {
                    current: Number(page),
                    total: Math.ceil(total / Number(limit)),
                    totalBookings: total,
                    limit: Number(limit)
                },
                statistics: {
                    total,
                    paid: stats.find(s => s._id === 'PAID')?.count || 0,
                    pending: stats.find(s => s._id === 'PENDING')?.count || 0,
                    totalSpent: stats.find(s => s._id === 'PAID')?.totalAmount || 0
                }
            }
        });
    }
    catch (error) {
        console.error('Error fetching user bookings:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch bookings',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getUserBookings = getUserBookings;
const getBookingById = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { userId } = req.query;
        const authenticatedUserId = getUserId(req);
        if (!authenticatedUserId || authenticatedUserId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access'
            });
        }
        const booking = await Booking_1.default.findOne({
            _id: bookingId,
            userId
        }).populate({
            path: 'hotelId',
            select: 'name location city images rating amenities price'
        });
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }
        return res.status(200).json({
            success: true,
            data: booking
        });
    }
    catch (error) {
        console.error('Error fetching booking:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch booking details',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getBookingById = getBookingById;
const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { userId } = req.body;
        const authenticatedUserId = getUserId(req);
        if (!authenticatedUserId || authenticatedUserId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access'
            });
        }
        const booking = await Booking_1.default.findOne({
            _id: bookingId,
            userId
        });
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }
        if (booking.paymentStatus === 'CANCELLED') {
            return res.status(400).json({
                success: false,
                message: 'Booking is already cancelled'
            });
        }
        const checkInDate = new Date(booking.checkInDate);
        const currentDate = new Date();
        if (currentDate >= checkInDate) {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel booking after check-in date'
            });
        }
        booking.paymentStatus = 'CANCELLED';
        await booking.save();
        return res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            data: booking
        });
    }
    catch (error) {
        console.error('Error cancelling booking:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to cancel booking',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.cancelBooking = cancelBooking;
const getBookingStats = async (req, res) => {
    try {
        const { userId } = req.params;
        const authenticatedUserId = getUserId(req);
        if (!authenticatedUserId || authenticatedUserId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access'
            });
        }
        const stats = await Booking_1.default.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: null,
                    totalBookings: { $sum: 1 },
                    totalSpent: {
                        $sum: {
                            $cond: [{ $eq: ['$paymentStatus', 'PAID'] }, '$totalAmount', 0]
                        }
                    },
                    upcomingBookings: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $gte: ['$checkInDate', new Date()] },
                                        { $eq: ['$paymentStatus', 'PAID'] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    },
                    completedBookings: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $lt: ['$checkOutDate', new Date()] },
                                        { $eq: ['$paymentStatus', 'PAID'] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]);
        const result = stats[0] || {
            totalBookings: 0,
            totalSpent: 0,
            upcomingBookings: 0,
            completedBookings: 0
        };
        return res.status(200).json({
            success: true,
            data: result
        });
    }
    catch (error) {
        console.error('Error fetching booking stats:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch booking statistics',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getBookingStats = getBookingStats;
const addBooking = async (req, res) => {
    try {
        const { hotelId, roomNumber, checkInDate, checkOutDate, numberOfGuests, numberOfRooms, totalAmount, specialRequests, guestDetails } = req.body;
        // Get authenticated Clerk user ID
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not logged in"
            });
        }
        // Validate hotel existence
        const hotel = await Hotel_1.default.findById({ _id: new mongodb_1.ObjectId(hotelId) });
        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found"
            });
        }
        // Create booking
        const newBooking = await Booking_1.default.create({
            userId,
            hotelId,
            roomNumber,
            checkInDate,
            checkOutDate,
            numberOfGuests,
            numberOfRooms,
            totalAmount,
            paymentStatus: "PENDING",
            specialRequests: specialRequests || "",
            guestDetails
        });
        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: newBooking
        });
    }
    catch (error) {
        console.error("Error creating booking:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create booking",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.addBooking = addBooking;
exports.default = {
    getUserBookings: exports.getUserBookings,
    getBookingById: exports.getBookingById,
    cancelBooking: exports.cancelBooking,
    getBookingStats: exports.getBookingStats,
    addBooking: exports.addBooking
};
//# sourceMappingURL=booking.js.map