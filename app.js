const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require("cookie-parser");
const config = require('./config')
const { sequelize } = require('./models')
const Seeds = require('./seeds')
require('dotenv').config();

//Configure App
const app = express()
var corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(',') || ["http://127.0.0.1:8080"],
  };
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(cookieParser())

//Routes
app.use("/api/v1", require("./routes/api"));

//Database
const force = false
sequelize.sync()
  .then(() => {
    // app.listen(config.port)
    // app.listen(8080)
    console.log(`Bytech Dynamics Server running at http://localhost:${port}`)
    if(force){
        Seeds.run()
    }
  })
  .catch((error) => {
    console.log("An error Ocurred when connecting to sequelize")
    console.log(error)
  })

