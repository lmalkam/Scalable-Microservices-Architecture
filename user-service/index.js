const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");

const PORT = process.env.PORT || 5000

dotenv.config();

const app = express();


app.use(express.json());

app.use("/api/users", userRoutes);

mongoose.connect(process.env.MONGO_URL , {
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(() => {
    console.log("User service connect to db")
    app.listen(PORT, ()=>{
        console.log(`Server running on the ${PORT}`)
    })
})
.catch((err) => {
    console.log("Failed to connect", err);
});