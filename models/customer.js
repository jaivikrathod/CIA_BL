'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customer extends Model {
    static associate(models) {
      // define association here
      customer.hasMany(models.insurance_common_details, {
        foreignKey: 'customer_id',
        as: 'insurance_common_details'
      });
    }
  }
  customer.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    documents: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    full_name: {
      type: DataTypes.STRING(100)
    },
    gender: {
      type: DataTypes.STRING(10)
    },
    dob: {
      type: DataTypes.DATE
    },
    email: {
      type: DataTypes.STRING(100)
    },
    primary_mobile: {
      type: DataTypes.STRING(15)
    },
    additional_mobile: {
      type: DataTypes.STRING(15)
    },
    full_address: {
      type: DataTypes.TEXT
    },
    city: {
      type: DataTypes.STRING(50)
    },
    state: {
      type: DataTypes.STRING(50)
    },
    is_active: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    modelName: 'customers',
    tableName: 'customers',
    freezeTableName: true,
    underscored: true,
    timestamps: true,
    created_at: 'created_at',
    updated_att: 'update_at'
  });
  return customer;
}; 