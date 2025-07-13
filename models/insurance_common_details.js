'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class insurance_common_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      insurance_common_details.hasMany(models.insurance_details, {
        foreignKey: 'insurance_id',
        as: 'insurance_details'
      });
      insurance_common_details.belongsTo(models.customers, {
        foreignKey: 'customer_id',
        as: 'customer'
      });
    }
  }
  insurance_common_details.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    segment: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    vehicle_number: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    insurance_type: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    segment_vehicle_type: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    segment_vehicle_detail_type: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    model: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    manufacturer: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    fuel_type: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    yom: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_active: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'insurance_common_details',
    tableName: 'insurance_common_details',
    freezeTableName: true,
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return insurance_common_details;
};