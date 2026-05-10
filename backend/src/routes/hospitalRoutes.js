const router = require("express").Router();

const {
  addHospital,
  getHospitals,
  searchHospitals,
  getMyHospitals,
  addServiceToHospital
} = require("../controllers/hospitalController");

const auth = require("../middleware/authMiddleware");

// 🛡️ Role check middleware
const isHospital = (req, res, next) => {
  // 🔥 FIX: support both cases
  if (req.user?.role !== "hospital") {
    return res.status(403).json({
      msg: "Only hospital users can perform this action"
    });
  }
  next();
};

// ✅ Create hospital (OWNER ONLY)
router.post("/", auth, isHospital, addHospital);

// ✅ Get owner's hospitals
router.get("/my-hospitals", auth, isHospital, getMyHospitals);

// 🔥 Add service to hospital
router.post("/:hospitalId/services", auth, isHospital, addServiceToHospital);

// 🌍 Public routes
router.get("/", getHospitals);
router.get("/search", searchHospitals);

module.exports = router;