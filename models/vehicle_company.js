'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class vehicle_company extends Model {
    static associate(models) {
      // define association here
      vehicle_company.hasMany(models.vehicle_model, {
        foreignKey: 'company_id',
        as: 'vehicleModels'
      });
    }
  }
  vehicle_company.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    company_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    extras: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'vehicle_company',
    tableName: 'vehicle_company',
    freezeTableName: true,
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return vehicle_company;
}; 