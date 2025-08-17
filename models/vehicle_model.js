'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class vehicle_model extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      vehicle_model.belongsTo(models.vehicle_company, {
        foreignKey: 'company_id',
        as: 'company'
      });
    }
  }

  vehicle_model.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    model_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    model_launch_year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    other_detail: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'vehicle_model',
    tableName: 'vehicle_model',
    freezeTableName: true,
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return vehicle_model;
}; 