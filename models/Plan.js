module.exports = (sequelize, DataTypes) => {
    const Plan =  sequelize.define('Plan', {
        started_at : {
          type: DataTypes.DATE,
          allowNull: false,
        },
        finished_at : {
          type: DataTypes.DATE,
          allowNull: true,
        },
        expires_at : {
          type: DataTypes.DATE,
          allowNull: false,
        },
        active : {
          type: DataTypes.BOOLEAN,
          defaultValue : true,
        },
        cancelled : {
          type: DataTypes.BOOLEAN,
          defaultValue : false,
        },
        amount : {
          type: DataTypes.BIGINT(12),
          allowNull: false,
        },
    })
  
    
      Plan.associate = function(models) {
        Plan.hasMany(models.Payment)
        Plan.hasMany(models.Promises)
        Plan.belongsTo(models.Tenant, { foreignKey: 'tenant_id' });
        Plan.belongsTo(models.Section, { foreignKey: 'section_id' });
        Plan.belongsTo(models.User, { foreignKey: 'user_id' });
      };
  
    return Plan
  }