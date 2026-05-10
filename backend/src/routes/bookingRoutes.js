const router = require("express").Router();

const {
  createBooking,
  getUserBookings,
  getOwnerBookings,

  // 🔥 CANCEL
  cancelBooking,

  // 🔥 ANALYTICS
  getTotalBookings,
  getRevenue,
  getPopularService,
  getTopHospital

} = require("../controllers/bookingController");

const auth = require("../middleware/authMiddleware");

// 🛡️ Role check for hospital owner
const isHospital = (req, res, next) => {

  if (req.user.role !== "hospital") {

    return res.status(403).json({
      msg: "Only hospital users can access this"
    });
  }

  next();
};

// 🛡️ Admin role
const isAdmin = (req, res, next) => {

  if (req.user.role !== "admin") {

    return res.status(403).json({
      msg: "Only admin can access analytics"
    });
  }

  next();
};

// ✅ Create booking
router.post("/", auth, createBooking);

// ✅ User bookings
router.get("/", auth, getUserBookings);

// ✅ Owner bookings
router.get(
  "/owner",
  auth,
  isHospital,
  getOwnerBookings
);

// ✅ Cancel booking
router.put(
  "/:id/cancel",
  auth,
  cancelBooking
);


// 🔥 ============================
// 📊 ANALYTICS ROUTES
// 🔥 ============================

router.get(
  "/analytics/total-bookings",
  auth,
  getTotalBookings
);

router.get(
  "/analytics/revenue",
  auth,
  getRevenue
);

router.get(
  "/analytics/popular-service",
  auth,
  getPopularService
);

router.get(
  "/analytics/top-hospital",
  auth,
  getTopHospital
);

module.exports = router;