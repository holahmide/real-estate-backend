require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    db : {
        database: process.env.DB_NAME,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS,
        options: {
            dialect : 'mysql',
            host : process.env.DB_HOST || 'localhost',
            define: {
              timestamps: true,
              underscored: true,
              createdAt: "created_at",
              updatedAt: "updated_at"
            },
            pool: {
              max: 5,
              min: 0,
              acquire: 30000,
              idle: 10000
            }
        }
    },
    authentication : {
        jwtSecret : process.env.JWT_SECRET || 'AAAAB3NzaC1yc2EAAAADAQABAAABAQDYuuD09CbQ+LrqxVp8M62cnfE5gogIO/MomlQu8PIK6RL0BG3dsUSSgcEXJKmOvMHwWEUv3FTIr+5pMIX+E5wNIAnVfNeMl6FdPA3l6eH9M/AA3Oy2hO+iXzd03vQ/lmeUnlOYAGMykT751ZPvBd1JadN6AF3mQN155KbCA5Tf6nFrqp3Yn923CVYGmiXZecEB2Dqi3LX+L2EkFgQmx7EhGVx4vKeG8Lj5Mjw8ypauyGZBNIVOYUKHCFYiw6QqGZBA8Qw7lOHNC1pnj4FwnqUER7AVK5XE1qd8Lo9gYFuO6H+sOk6762DfmakkFx3OztuN6zlbjiOkyJw48vIC3mAp',
        refresh_token_expiry_time : process.env.REFRESH_TOKEN_EXPIRY_TIME || 3000000 * 20,
        token_expiry_time : process.env.TOKEN_EXPIRY_TIME || 3000000
    }
}
