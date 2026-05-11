const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();


// ✅ CORS CONFIG
app.use(
  cors({

    origin: process.env.CLIENT_URL,

    credentials: true
  })
);


// ✅ JSON PARSER
app.use(express.json());


// ✅ HEALTH CHECK ROUTE
app.get("/", (req, res) => {

  res.send("CareSync API Running 🚀");
});


// ✅ ROUTES
app.use(
  "/api/auth",
  require("./src/routes/authRoutes")
);

app.use(
  "/api/hospitals",
  require("./src/routes/hospitalRoutes")
);

app.use(
  "/api/bookings",
  require("./src/routes/bookingRoutes")
);

app.use(
  "/api/payment",
  require("./src/routes/paymentRoutes")
);


// ✅ DATABASE CONNECT
mongoose
  .connect(process.env.MONGO_URI)

  .then(() => {

    console.log(
      "MongoDB Connected"
    );

    // ✅ START SERVER ONLY AFTER DB CONNECTS
    const PORT =
      process.env.PORT || 5000;

    app.listen(PORT, () => {

      console.log(
        `Server running on port ${PORT}`
      );
    });

  })

  .catch((err) => {

    console.log(
      "MongoDB Error:",
      err
    );
  });