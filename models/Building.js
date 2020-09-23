module.exports = (sequelize, DataTypes) => {
    const Building =  sequelize.define('Building', {
        location : {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        description : {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        active : {
          type: DataTypes.BOOLEAN,
          defaultValue : true,
        },
       code : {
          type: DataTypes.STRING,
          allowNull: true,
          unique : true
        },
        // created_by : {
        //   type: DataTypes.INTEGER,
        //   allowNull: true,
        // }
    })
  
    
      Building.associate = function(models) {
        Building.hasMany(models.Section)
        Building.belongsTo(models.User, { foreignKey: 'user_id' });
      };
  
    return Building
  }