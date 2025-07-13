'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class insurance_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      insurance_details.belongsTo(models.insurance_common_details, {
        foreignKey: 'insurance_id',
        as: 'insurance_common_detail'
      });
    }
  }
  insurance_details.init({
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
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    insurance_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    common_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    insurance_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    documents: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    business_type: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    idv: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    currentncb: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    insurance_company: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    policy_no: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    od_premium: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tp_premium: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    package_premium: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    gst: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    premium: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    collection_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    case_type: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    exe_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    payment_mode: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    policy_start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    policy_expiry_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    agent_code: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    payout_percent: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tds: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tds_amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    payment_amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    difference: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    final_agent: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    net_income: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    payment_received: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    insurance_count: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    step: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_active: {
      type: DataTypes.TINYINT,
      allowNull: false,
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