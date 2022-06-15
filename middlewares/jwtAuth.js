const jwt = require("jsonwebtoken");
const config = require("../config");
const { User, Token } = require("../models");

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(401).send({
           message: "No token provided!",
           success : false
        });
    }

    jwt.verify(token, config.authentication.jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!",
                success : false
            });
        }

        var dateNow = new Date();
        if(decoded.exp < dateNow.getTime()/1000) {
            return res.status(401).send({
                message: "Expired Token, please login again",
                success : false
            });
        }
        
        const findUser = User.findOne({ where: { id : decoded.id } })
            .then(user => {
                if (!user) {
                    return res.status(400).send({
                        decoded,
                        message: "User was not found",
                        success : false
                    });
                }

                req.user = user.toJSON();
                req.body.user_id = user.id;
                next();
            });
    });
}

verifyRefreshToken = (req, res, next) => {
    let token = req.body.refresh_token;

    if (!token || typeof token == "undefined") {
        return res.status(403).send({
        msg : "JWT token required",
        status : "failed",
        error: true
      });
    }

    // Verify Refresh token
    jwt.verify(token, config.authentication.jwtSecret, (err, decoded) => {
      if (err) {
        return res.status(400).send({
            message: "Unauthorized!",
            status : "failed",
            error : true
        });
      }

    // Check database for refresh token
      const findRefreshToken = Token.findOne({ where: { user_id : decoded.id, token : token } })
        .then(RefreshToken => {
            if (!RefreshToken) {
                return res.status(400).send({
                    message: "Refresh Token was not found",
                    success : false
                });
            }
        }).catch( error => {
                return res.status(400).send({
                    message: "Error trying to find refresh token",
                    success : false
                });
        });

      //check expiry date
      var dateNow = new Date();
      if(decoded.exp < dateNow.getTime()/1000) {
          return res.status(400).send({
              msg: "Expired Refresh Token, please login again",
              status : "failed",
              error : true
          });
      }

      //check user
      const findUser = User.findOne({ where: { id : decoded.id } })
      .then(user => {
          if (!user) {
              return res.status(400).send({
                  message: "User was not found",
                  success : false
              });
          }


          req.user = user.toJSON();
          next();
      });
    })
}

const jwtAuth = {
    verifyToken,
    verifyRefreshToken
}

module.exports = jwtAuth