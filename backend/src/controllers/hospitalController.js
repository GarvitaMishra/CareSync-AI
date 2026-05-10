const Hospital = require("../models/Hospital");

// 🔥 Haversine formula (distance in km)
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

// ✅ Add hospital
exports.addHospital = async (req, res) => {
  try {
    const { name, address, lat, lng, services, rating } = req.body;

    const hospital = await Hospital.create({
      name,
      address,
      services,
      rating,
      owner: req.user._id,

      // 🔥 Convert to GeoJSON
      location: {
        type: "Point",
        coordinates: [lng, lat]
      }
    });

    res.status(201).json(hospital);

  } catch {
    res.status(500).json({ msg: "Failed to add hospital" });
  }
};

// ✅ Get all hospitals
exports.getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);

  } catch {
    res.status(500).json({
      msg: "Failed to fetch hospitals"
    });
  }
};

// 🔥 SEARCH WITH AI + DISTANCE
exports.searchHospitals = async (req, res) => {
  try {
    const { service, userLat, userLng } = req.query;

    let hospitals = await Hospital.find({
      "services.name": { $regex: service, $options: "i" }
    });

    hospitals = hospitals.map((h) => {
      const matchedServices = h.services.filter(s =>
        s.name.toLowerCase().includes(service.toLowerCase())
      );

      const avgPrice =
        matchedServices.reduce((sum, s) => sum + s.price, 0) /
        (matchedServices.length || 1);

      // 🔥 Extract hospital location
      const [lng, lat] = h.location.coordinates;

      let distance = 0;

      if (userLat && userLng) {
        distance = getDistance(
          parseFloat(userLat),
          parseFloat(userLng),
          lat,
          lng
        );
      }

      // 🔥 FINAL AI SCORE
      const score =
        (h.rating || 0) * 0.5 -
        avgPrice * 0.003 -
        distance * 0.2;

      return {
        ...h.toObject(),
        score,
        distance: distance.toFixed(2)
      };
    });

    // 🔥 Sort by best score
    hospitals.sort((a, b) => b.score - a.score);

    res.json(hospitals);

  } catch (err) {
    res.status(500).json(err);
  }
};

// ✅ Owner hospitals
exports.getMyHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find({
      owner: req.user._id
    });

    res.json(hospitals);

  } catch {
    res.status(500).json({ msg: "Failed to fetch your hospitals" });
  }
};

// ✅ Add service
exports.addServiceToHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const { name, price, duration } = req.body;

    const hospital = await Hospital.findById(hospitalId);

    if (!hospital) {
      return res.status(404).json({ msg: "Hospital not found" });
    }

    if (hospital.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    hospital.services.push({ name, price, duration });

    await hospital.save();

    res.json({ msg: "Service added successfully", hospital });

  } catch {
    res.status(500).json({ msg: "Failed to add service" });
  }
};
