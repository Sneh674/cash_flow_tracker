const express = require('express')
const app = express();
const path = require("path")
const userRoute = require('./routes/user_route.js')
const appRoute=require("./routes/app_routes.js")
const createHTTPError = require("http-errors")
require('dotenv').config();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public')))

app.get("/", (req, res) => {
    res.json({ message: "home page" })
})

app.use("/", userRoute)
app.use("/", appRoute)

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening at port: ${port}`);
});
