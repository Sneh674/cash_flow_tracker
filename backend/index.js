const express = require("express");
const app = express();
const path = require("path");
const userRoute = require("./routes/user_route.js");
const appRoute = require("./routes/app_routes.js");
const createHTTPError = require("http-errors");
require("dotenv").config();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "flow backend api",
      description: "API endpoints for flow backend documented on swagger",
      // contact: {
      //     name: "Desmond Obisi",
      //     email: "info@miniblog.com",
      //     url: "https://github.com/DesmondSanctity/node-js-swagger"
      // },
      version: "1.0.0",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Local server",
      }
    ],
  },
  // looks for configuration in specified directories
  apis: ["./routes/*.js","./index.js"],
};
const swaggerSpec = swaggerJsdoc(options);
function swaggerDocs(app, port) {
  // Swagger Page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // Documentation in JSON format
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}

/**
 * @swagger
 * /:
 *  get:
 *      summary: Home page
 *      description: Get home page
 *      responses:
 *          200:
 *              description: successfull swagger implementation
 */
app.get("/", (req, res) => {
  res.json({ message: "home page" });
});

app.use("/", userRoute);
app.use("/", appRoute);

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  next(createHTTPError(404, "This page does not exist"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

app.listen(port, () => {
  console.log(`listening at port: ${port}`);
});
