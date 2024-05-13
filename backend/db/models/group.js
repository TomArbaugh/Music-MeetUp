'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.hasMany(models.Event, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE'
      });

      // Group.hasMany(models.Membership, {
      //   foreignKey: 'groupId'
      // })

      Group.belongsToMany(models.User, {
        through: models.Membership,
        foreignKey: 'groupId',
        otherKey: 'userId'

      });

      Group.belongsTo(models.User, {
        foreignKey: 'organizerId'
      });

      Group.hasMany(models.Venue, {
        foreignKey: 'groupId'
      });

      Group.hasMany(models.GroupImage, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE'
      });
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER
      
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    about: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM({
        values: ['Online', 'In person']
      })
      
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};