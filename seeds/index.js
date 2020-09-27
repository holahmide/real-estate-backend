const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require('../models')
const config = require('../config')

class Seeds {
    static async run () {
        const users =[
            {
                email : 'adeniyi.olamide@lmu.edu.ng',
                firstname : 'Olamide',
                lastname : 'Adeniyi',
                role : "admin",
                password : 'oluwaseyi'
            }
        ]
        //creating user
        try {
            let count = 0
            users.forEach( async (user) => {
                const hashPassword = bcrypt.hashSync(user.password, 10);
                user.password = hashPassword
                const createUser = await User.create(user);
                count++
            })

            if(count == users.length){
                return 'Database succesfully Seeded'
            } 
            else {
                return 'Database Seeding Failed!!'
            }
        } catch (error) {
            return 'Database Seeding Failed!!'
        }
    }
}


module.exports = Seeds;
