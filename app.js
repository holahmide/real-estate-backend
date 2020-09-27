const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require("cookie-parser");
const config = require('./config')
const { sequelize } = require('./models')
const Seeds = require('./seeds')

//Configure App
const app = express()
var corsOptions = {
    origin: [
       "http://localhost:8080",
       "http://192.168.0.100:8080"
    ]
  };
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(cookieParser())

//Routes
app.use("/api/v1", require("./routes/api"));

//Database
const force = false
sequelize.sync({force : force})
  .then(() => {
    app.listen(config.port)
    console.log(`Bytech Dynamics Server running at http://localhost:${config.port}`)
    if(force){
        Seeds.run()
    }
  })

