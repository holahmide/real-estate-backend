const jwt = require("jsonwebtoken");
const Op = require('sequelize').Op;
const bcrypt = require("bcryptjs");
const { User, Token } = require('../models')
const config = require('../config')


const generateToken = async (user) => {
    const token = jwt.sign(user, config.authentication.jwtSecret, {
        expiresIn: config.authentication.token_expiry_time
    });
    const refresh_token = jwt.sign(user, config.authentication.jwtSecret, {
        expiresIn: config.authentication.refresh_token_expiry_time
    });

    const setRefreshToken = await Token.create({ token : refresh_token, user_id : user.id})
    return { token, refresh_token }
}

class UserController {
    static async login(req, res) {
        let { email , password } = req.body
        // Authentication Handler
        if(!email || !password) {
            return res.status(400).send({
                message : 'Request Fields Empty',
                email,
                password,
                success : false
            });
        }
        //Action
        try {
            const findUser = await User.findOne({ 
                where : { email : email},
                // include: [Spendings],
            });

            if (!findUser) {
                return res.status(400).send({
                    message: "Incorrect Email or Password",
                    success : false
                });
            }

            // const match = await bcrypt.compare(password, findUser.password);
            const match = bcrypt.compareSync(password, findUser.password);

            if (match) {
                const userJson = findUser.toJSON()
                delete userJson.password
                const tokens = await generateToken(userJson)
    
                return res.cookie("refresh_token", tokens.refresh_token, {
                    Domain : 'http://localhost:3000',
                    maxAge: config.authentication.refresh_token_expiry_time, //85400 * 1000,
                    httpOnly: true
                }).status(200).send({
                    message : 'Logged In Successfully',
                    user : userJson,
                    accessToken: tokens.token,
                    success : true,
                    refresh_token : tokens.refresh_token
                });
            } else {
                res.status(400).send({
                  message: "Incorrect Email or Password",
                  success : false
                });
            }

        } catch (error) {
            res.status(400).send({ success : false, message: "Database error", error: error.toString() });   
        }
    }

    static async state(req, res) {
        delete req.user.password
        return res.send({
            success : true,
            user : req.user,
            message : "Welcome! you are logged in"
        })
    }
    
    static async edit (req, res) {
        
    }

    static async refresh (req, res) {
        try {
            const tokens = await generateToken(req.user)

            return res.cookie("refresh_token", tokens.refresh_token, {
                Domain : 'http://localhost:3000',
                maxAge: config.authentication.refresh_token_expiry_time, //85400 * 1000,
                httpOnly: true
            }).status(200).send({
                message : "Refreshed Token!",
                success : true,
                accessToken : tokens.token,
                refresh_token : tokens.refresh_token
            })
        } catch(error) {
            return res.status(400).send({ success : false, message: "Database error", error: error.toString() });   
        }
        
    }
}

module.exports = UserController;
