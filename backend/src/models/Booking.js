const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true
  },

  serviceName: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  date: {
    type: String,
    required: true
  },

  slot: {
    type: String,
    required: true
  },

  // ✅ Booking status
  status: {
    type: String,
    enum: [
      "confirmed",
      "cancelled"
    ],
    default: "confirmed"
  },

  // ✅ Refund tracking
  refundAmount: {
    type: Number,
    default: 0
  },

  // ✅ Refund status
  refundStatus: {
    type: String,
    enum: [
      "none",
      "processed"
    ],
    default: "none"
  },

  // ✅ Payment tracking
  paymentStatus: {
    type: String,
    enum: [
      "paid",
      "refunded"
    ],
    default: "paid"
  },

  // ✅ Cancellation timestamp
  cancelledAt: {
    type: Date,
    default: null
  }

},
{
  timestamps: true
});

module.exports =
  mongoose.model(
    "Booking",
    bookingSchema
  );