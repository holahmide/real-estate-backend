module.exports = (sequelize, DataTypes) => {
    const User =  sequelize.define('User', {
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
        password: {
          type: DataTypes.STRING,
          allowNull: false
        },
        role : {
            type : DataTypes.ENUM,
            values : ['user','admin','developer']
        }
    })
  
    
      User.associate = function(models) {
        User.hasMany(models.Tenant, { targetKey: 'created_by' })
        User.hasMany(models.Section, { targetKey: 'created_by' })
        User.hasMany(models.Promises, { targetKey: 'created_by' })
        User.hasMany(models.Plan, { targetKey: 'created_by' })
        User.hasMany(models.Payment, { targetKey: 'created_by' })
        User.hasMany(models.Building, { targetKey: 'created_by' })
        User.hasMany(models.Token)
      };
  
    return User
  }