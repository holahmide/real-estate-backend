module.exports = (sequelize, DataTypes) => {
    const Guarantor =  sequelize.define('Guarantor', {
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        occupation : {
            type: DataTypes.STRING,
            allowNull: true,
        },
        work_status : {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phone : {
            type: DataTypes.STRING,
            allowNull: false,
        },
        place_of_work : {
            type: DataTypes.STRING,
            allowNull: true,
        },
        state_of_origin : {
            type: DataTypes.STRING,
            allowNull: true,
        },
        marital_status : {
            type: DataTypes.STRING,
            allowNull: true,
        },
    })
  
    
      Guarantor.associate = function(models) {
        Guarantor.belongsTo(models.Tenant, { foreignKey: 'tenant_id' });
      };
  
    return Guarantor
  }