const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

// Routes
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const cartRoutes = require("./routes/cart");

const buildApp = async () => {
  const app = express();

  app.use(bodyParser.json());
  app.use(morgan("combined"));
  app.use(cors());

  // Routes
  app.use("/ics", productRoutes);
  app.use("/ics", orderRoutes);
  app.use("/ics", cartRoutes);

  return app;
};

module.exports = buildApp;
