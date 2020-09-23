module.exports = (sequelize, DataTypes) => {
    const Payment =  sequelize.define('Payment', {
        date : {
            type: DataTypes.DATE,
            allowNull: false,
        },
        amount : {
            type: DataTypes.BIGINT(12),
            allowNull: false,
        },
        // created_by : {
        //     type: DataTypes.INTEGER,
        //     allowNull: true,
        // },
    })
  
    
    Payment.associate = function(models) {
        Payment.belongsTo(models.Plan, { foreignKey: 'plan_id' });
        Payment.belongsTo(models.User, { foreignKey: 'user_id' });
    };
  
    return Payment
  }