module.exports = (sequelize, DataTypes) => {
    const Tenant =  sequelize.define('Tenant', {
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
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
            unique: true
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
  
    
    Tenant.associate = function(models) {
        Tenant.hasMany(models.Plan)
        Tenant.belongsTo(models.User, { foreignKey: 'user_id' });
    };
  
    return Tenant
  }