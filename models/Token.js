module.exports = (sequelize, DataTypes) => {
    const Token =  sequelize.define('Token', {
        token : {
          type: DataTypes.TEXT,
          allowNull: false,
        },
    })
  
    
      Token.associate = function(models) {
        Token.belongsTo(models.User, { foreignKey: 'user_id' });
      };
  
    return Token
  }