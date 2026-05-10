const Booking = require("../models/Booking");
const Hospital = require("../models/Hospital");

// ✅ Create booking
exports.createBooking = async (req, res) => {
  try {
    const { hospitalId, serviceName, price, date, slot } = req.body;

    const userId = req.user._id;

    const existing = await Booking.findOne({
      hospitalId,
      date,
      slot
    });

    if (existing) {
      return res.status(400).json({ msg: "Slot already booked" });
    }

    const booking = await Booking.create({
      userId,
      hospitalId,
      serviceName,
      price,
      date,
      slot
    });

    res.status(201).json(booking);

  } catch (err) {
    res.status(500).json(err);
  }
};

// ✅ User bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user._id
    })
    .populate(
      "hospitalId",
      "name address"
    );

    const formattedBookings =
      bookings.map((b) => ({

        ...b._doc,

        hospitalName:
          b.hospitalId?.name,

        hospitalAddress:
          b.hospitalId?.address
      }));

    res.json(formattedBookings);

  } catch (err) {
    res.status(500).json(err);
  }
};

// ✅ Owner bookings
exports.getOwnerBookings = async (req, res) => {
  try {
    const hospitals = await Hospital.find({
      owner: req.user._id
    });

    const hospitalIds = hospitals.map(h => h._id);

    const bookings = await Booking.find({
      hospitalId: { $in: hospitalIds }
    }).populate("userId", "name email");

    res.json(bookings);

  } catch {
    res.status(500).json({ msg: "Failed to fetch owner bookings" });
  }
};

// ✅ Cancel booking + refund
exports.cancelBooking = async (req, res) => {

  try {

    const booking =
      await Booking.findById(
        req.params.id
      );

    if (!booking) {

      return res.status(404).json({
        msg: "Booking not found"
      });
    }

    // Only booking owner can cancel
    if (
      booking.userId.toString() !==
      req.user._id.toString()
    ) {

      return res.status(403).json({
        msg: "Unauthorized"
      });
    }

    // Prevent double cancellation
    if (
      booking.status === "cancelled"
    ) {

      return res.status(400).json({
        msg:
          "Booking already cancelled"
      });
    }

    // Update booking
    booking.status = "cancelled";

    booking.cancelledAt = new Date();

    booking.paymentStatus = "refunded";

    booking.refundStatus = "processed";

    // Simulated refund amount
    booking.refundAmount =
      Math.floor(
        booking.price * 0.8
      );

    await booking.save();

    res.json({

      success: true,

      msg:
        "Booking cancelled successfully",

      refund:
        booking.refundAmount,

      refundStatus:
        booking.refundStatus
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      msg:
        "Error cancelling booking"
    });
  }
};



// 🔥 ============================
// 📊 ANALYTICS APIs
// 🔥 ============================

// ✅ Total bookings
exports.getTotalBookings = async (req, res) => {
  try {
    const total = await Booking.countDocuments();

    res.json({
      totalBookings: total
    });

  } catch {
    res.status(500).json({
      msg: "Error fetching total bookings"
    });
  }
};

// ✅ Total revenue
exports.getRevenue = async (req, res) => {
  try {
    const revenue = await Booking.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$price" }
        }
      }
    ]);

    res.json({
      revenue: revenue[0]?.total || 0
    });

  } catch {
    res.status(500).json({
      msg: "Error fetching revenue"
    });
  }
};

// ✅ Most popular service
exports.getPopularService = async (req, res) => {
  try {
    const result = await Booking.aggregate([
      {
        $group: {
          _id: "$serviceName",
          count: { $sum: 1 }
        }
      },

      { $sort: { count: -1 } },

      { $limit: 1 }
    ]);

    res.json({
      service: result[0]?._id || "N/A",
      bookings: result[0]?.count || 0
    });

  } catch {
    res.status(500).json({
      msg: "Error fetching popular service"
    });
  }
};

// ✅ Top hospital with REAL NAME
exports.getTopHospital = async (req, res) => {
  try {

    const result = await Booking.aggregate([

      {
        $group: {
          _id: "$hospitalId",
          count: { $sum: 1 }
        }
      },

      {
        $sort: {
          count: -1
        }
      },

      {
        $limit: 1
      },

      {
        $lookup: {
          from: "hospitals",
          localField: "_id",
          foreignField: "_id",
          as: "hospital"
        }
      },

      {
        $unwind: "$hospital"
      },

      {
        $project: {
          _id: 0,
          hospitalName: "$hospital.name",
          count: 1
        }
      }

    ]);

    res.json(
      result[0] || {}
    );

  } catch {

    res.status(500).json({
      msg: "Error fetching top hospital"
    });
  }
};