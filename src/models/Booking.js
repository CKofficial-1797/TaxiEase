import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  // Booking Identification
  bookingId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Customer Information
  customer: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true
    }
  },
  
  // Trip Details
  trip: {
    from: {
      type: String,
      required: true,
      trim: true
    },
    to: {
      type: String,
      required: true,
      trim: true
    },
    route: {
      type: String,
      required: true,
      trim: true
    },
    pickupDate: {
      type: Date,
      required: true
    },
    pickupTime: {
      type: String,
      required: true
    },
    pickupAddress: {
      type: String,
      required: true,
      trim: true
    },
    dropAddress: {
      type: String,
      required: true,
      trim: true
    },
    passengers: {
      type: Number,
      required: true,
      min: 1,
      max: 15
    },
    specialRequests: {
      type: String,
      default: '',
      trim: true
    }
  },
  
  // Vehicle Information
  vehicle: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    capacity: {
      type: String,
      required: true
    }
  },
  
  // Pricing Information
  pricing: {
    baseFare: {
      type: Number,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  
  // Payment Information
  payment: {
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['razorpay', 'cash', 'other'],
      default: 'razorpay'
    },
    razorpayOrderId: {
      type: String,
      default: null
    },
    razorpayPaymentId: {
      type: String,
      default: null
    },
    razorpaySignature: {
      type: String,
      default: null
    },
    paidAt: {
      type: Date,
      default: null
    }
  },
  
  // Booking Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  // Driver Information (assigned later)
  driver: {
    name: {
      type: String,
      default: null
    },
    phone: {
      type: String,
      default: null
    },
    vehicleNumber: {
      type: String,
      default: null
    },
    assignedAt: {
      type: Date,
      default: null
    }
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // Additional Notes
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for better query performance
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ 'customer.phone': 1 });
bookingSchema.index({ 'customer.email': 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'payment.status': 1 });
bookingSchema.index({ 'trip.pickupDate': 1 });
bookingSchema.index({ createdAt: -1 });

// Pre-save middleware to update updatedAt
bookingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to generate booking ID
bookingSchema.statics.generateBookingId = function() {
  const prefix = 'BK';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

// Instance method to get booking summary
bookingSchema.methods.getSummary = function() {
  return {
    bookingId: this.bookingId,
    customer: this.customer.name,
    route: this.trip.route,
    vehicle: this.vehicle.name,
    totalAmount: this.pricing.totalAmount,
    status: this.status,
    paymentStatus: this.payment.status,
    pickupDate: this.trip.pickupDate,
    createdAt: this.createdAt
  };
};

// Virtual for formatted pickup date
bookingSchema.virtual('formattedPickupDate').get(function() {
  return this.trip.pickupDate.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for formatted pickup time
bookingSchema.virtual('formattedPickupTime').get(function() {
  return this.trip.pickupTime;
});

// Virtual for booking age in hours
bookingSchema.virtual('bookingAgeHours').get(function() {
  const now = new Date();
  const diffMs = now - this.createdAt;
  return Math.floor(diffMs / (1000 * 60 * 60));
});

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;
