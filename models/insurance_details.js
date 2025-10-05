'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class insurance_details extends Model {
    static associate(models) {
      // Define association here
      insurance_details.belongsTo(models.insurance_common_details, {
        foreignKey: 'insurance_id',
        as: 'insurance_common_detail'
      });
    }
  }

  insurance_details.init({
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
    insurance_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    common_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    agent_code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    insurance_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    documents: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    business_type: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    idv: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    currentncb: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    insurance_company: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    policy_no: {
      type: DataTypes.STRING(20),
      allowNull: true
    },

    // ✅ Converted numeric fields to DECIMAL(15, 2)
    od_premium: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0.00
    },
    tp_premium: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0.00
    },
    package_premium: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0.00
    },
    gst: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0.00
    },
    premium: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0.00
    },

    collection_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    case_type: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    payment_mode: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    policy_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    policy_expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    agent_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },

    // ✅ Converted payout and amount fields to DECIMAL
    payout_percent: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0.00
    },
    net_payout_percent: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    },
    net_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0.00
    },
    difference: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0.00
    },
    net_income: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0.00
    },

    payment_received: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    insurance_count: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    step: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_active: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1
    }
  }, {
    sequelize,
    modelName: 'insurance_details',
    tableName: 'insurance_details',
    freezeTableName: true,
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return insurance_details;
};
