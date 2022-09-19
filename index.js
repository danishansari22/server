const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose")
const app = express();
const userRoutes = require("./Routes/userRoutes");
const roomRoutes = require("./Routes/roomRoutes");
require('dotenv').config();
app.use(cors());
app.use(express.json());

app.use("/api/auth",userRoutes)
app.use("/api/room",roomRoutes)
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("DB connection successful!")).catch((err) => console.log(err))  
const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port: ${process.env.PORT}`);
});







