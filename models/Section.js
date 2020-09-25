module.exports = (sequelize, DataTypes) => {
    const Section =  sequelize.define('Section', {
        description : {
            type: DataTypes.STRING,
            allowNull: true,
        },
        type : {
            type: DataTypes.STRING,
            allowNull: false,
        },
        active : {
            type: DataTypes.BOOLEAN,
            defaultValue : true,
        },
        occupied : {
            type: DataTypes.BOOLEAN,
            defaultValue : false,
        },
        pinned : {
            type: DataTypes.BOOLEAN,
            defaultValue : false,
        },
        code : {
            type: DataTypes.STRING,
            allowNull: true,
            unique : true
        },
        price : {
            type: DataTypes.BIGINT(12),
            allowNull: true,
        },
        // created_by : {
        //     type: DataTypes.INTEGER,
        //     allowNull: true,
        // },
    })
  
    
    Section.associate = function(models) {
        Section.belongsTo(models.Building, { foreignKey: { name : 'building_id', allowNull : false} });
        Section.hasMany(models.Plan)
        Section.belongsTo(models.User, { foreignKey: 'user_id' });
    };
  
    return Section
  }