const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/hospitals", require("./src/routes/hospitalRoutes"));
app.use("/api/bookings", require("./src/routes/bookingRoutes"));
app.use("/api/payment", require("./src/routes/paymentRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));