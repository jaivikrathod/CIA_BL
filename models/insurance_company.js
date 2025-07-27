'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class insurance_company extends Model {
    static associate(models) {
      // define association here if needed
    }
  }
  insurance_company.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    extras: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'insurance_company',
    tableName: 'insurance_company',
    freezeTableName: true,
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return insurance_company;
}; 