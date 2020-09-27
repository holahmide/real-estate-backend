const jwt = require("jsonwebtoken");
const Op = require('sequelize').Op;
const bcrypt = require("bcryptjs");
const { User, Token, sequelize } = require('../models')
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
                return res.status(400).send({
                  message: "Incorrect Email or Password",
                  success : false
                });
            }

        } catch (error) {
            return res.status(400).send({ success : false, message: "Database error", error: error.toString() });   
        }
    }

    static async register (req, res) {
        if(!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password || !req.body.appId) {
            return res.status(400).send({
                success : false,
                message : "Data provided is incomplete"
            })
        }

        const user = req.body
        const hashPassword = bcrypt.hashSync(user.password, 10);
        user.password = hashPassword

        try {
            const registerUser = await User.create(req.body)
            return res.status(200).send({
                success : true,
                message : "Successfully registered user",
                user : registerUser
            })
        } catch (error) {
            return res.status(400).send({
                message: "Registeration failed!",
                success : false
              });
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
        if(!req.body.user_id || !req.body.firstname || !req.body.lastname || !req.body.email) {
            return res.status(400).send({
                success : false,
                message : "Missing Parameters"
            })
        }
        const t = await sequelize.transaction()
        try {
            const editUser = await User.update(
                req.body,
                { where : {id : req.body.user_id} }
            )
            const user = await User.findOne({ where : {id : req.body.user_id}})
            delete user.password
            await t.commit()
            return res.send({
                success : true,
                message : 'Successfully edited details',
                user
            })
        } catch (error) {
            await t.rollback()
            return res.status(400).send({ 
                success : false, 
                message: "Could not update user details", 
                error: error.toString() 
            });   
        }
    }

    static async refresh (req, res) {
        try {
            const tokens = await generateToken(req.user)

            return res.cookie("refresh_token", tokens.refresh_token || '', {
                    Domain : 'http://localhost:3000',
                    maxAge: config.authentication.refresh_token_expiry_time || 100, //85400 * 1000,
                    httpOnly: true
                }).status(200).send({
                    message : "Refreshed Token!",
                    success : true,
                    accessToken : tokens.token || '',
                    refresh_token : tokens.refresh_token || ''
                })
        } catch(error) {
            return res.status(400).send({ 
                success : false, 
                message: "Database error", 
                error: error.toString() 
            });   
        }
        
    }
}

module.exports = UserController;
