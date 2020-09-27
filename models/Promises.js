module.exports = (sequelize, DataTypes) => {
    const Promises =  sequelize.define('Promises', {
        date : {
            type: DataTypes.DATE,
            allowNull: true,
        },
        amount : {
            type: DataTypes.BIGINT(12),
            allowNull: true,
        },
        fufilled : {
            type : DataTypes.BOOLEAN,
            defaultValue : false
        }
        // created_by : {
        //     type: DataTypes.INTEGER,
        //     allowNull: true,
        // },
    })
  
    
    Promises.associate = function(models) {
        Promises.belongsTo(models.Plan, { foreignKey: 'plan_id' });
        Promises.belongsTo(models.User, { foreignKey: 'user_id' });
    };
  
    return Promises
  }