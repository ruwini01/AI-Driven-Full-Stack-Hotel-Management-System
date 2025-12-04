import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  userId: string;  // Clerk user ID (string, not ObjectId)
  hotelId: mongoose.Types.ObjectId;
  roomNumber?: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  numberOfRooms: number;
  totalAmount: number;
  paymentStatus: 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED';
  paymentIntentId?: string;
  specialRequests?: string;
  guestDetails: {
    name: string;
    email: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema(
  {
    userId: {
      type: String,  // String for Clerk user ID (e.g., "user_2abc123xyz")
      required: [true, 'User ID is required'],
      index: true,
    },
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: 'Hotel',
      required: [true, 'Hotel ID is required'],
      index: true,
    },
    roomNumber: {
      type: String,
      default: null,
    },
    checkInDate: {
      type: Date,
      required: [true, 'Check-in date is required'],
      index: true,
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Check-out date is required'],
      index: true,
    },
    numberOfGuests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: [1, 'At least 1 guest is required'],
      max: [10, 'Maximum 10 guests allowed'],
    },
    numberOfRooms: {
      type: Number,
      default: 1,
      min: [1, 'At least 1 room is required'],
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'CANCELLED', 'REFUNDED'],
      default: 'PENDING',
      index: true,
    },
    paymentIntentId: {
      type: String,
      default: null,
    },
    specialRequests: {
      type: String,
      maxlength: [500, 'Special requests cannot exceed 500 characters'],
    },
    guestDetails: {
      name: {
        type: String,
        required: [true, 'Guest name is required'],
      },
      email: {
        type: String,
        required: [true, 'Guest email is required'],
        lowercase: true,
        trim: true,
      },
      phone: {
        type: String,
        required: [true, 'Guest phone is required'],
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for efficient queries
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ userId: 1, paymentStatus: 1 });
bookingSchema.index({ checkInDate: 1, checkOutDate: 1 });

// Virtual for booking duration in days
bookingSchema.virtual('durationDays').get(function(this: IBooking) {
  const diffTime = Math.abs(this.checkOutDate.getTime() - this.checkInDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for booking status (upcoming, active, completed)
bookingSchema.virtual('bookingStatus').get(function(this: IBooking) {
  const now = new Date();
  if (this.paymentStatus === 'CANCELLED' || this.paymentStatus === 'REFUNDED') {
    return 'CANCELLED';
  }
  if (now < this.checkInDate) {
    return 'UPCOMING';
  }
  if (now >= this.checkInDate && now <= this.checkOutDate) {
    return 'ACTIVE';
  }
  return 'COMPLETED';
});

// Pre-save validation
bookingSchema.pre('save', function(next) {
  if (this.checkOutDate <= this.checkInDate) {
    next(new Error('Check-out date must be after check-in date'));
  }
  next();
});

const Booking = mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;