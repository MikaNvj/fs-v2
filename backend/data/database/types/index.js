import { DataTypes } from "sequelize";

export const id = () => ({
  type: DataTypes.BIGINT,
  primaryKey: true,
  autoIncrement: true
})

export const bigint = () => ({
  type: DataTypes.BIGINT
})

export const string = (nb = 255, nullable = true) => ({
  type: DataTypes.STRING(nb),
  allowNull: nullable
})

export const text = (nullable = true) => ({
  type: DataTypes.TEXT,
  allowNull: nullable
})

export const bool = (defValue = false) => ({
  type: DataTypes.BOOLEAN,
  defaultValue: defValue,
})

export const integer = (defValue) => ({
  type: DataTypes.INTEGER,
  defaultValue: defValue
})

export const double = (defValue) => ({
  type: DataTypes.DOUBLE(11, 2),
  defaultValue: defValue
})

export const enumm = (values, nullable = false) => ({
  type: DataTypes.ENUM(...values),
  allowNull: nullable
})

export const date = (defValue, nullable = true) => ({
  type: DataTypes.DATE,
  allowNull: nullable,
  defaultValue: defValue
})

export const dateOnly = (defValue, nullable = true) => ({
  type: DataTypes.DATEONLY,
  allowNull: nullable,
  defaultValue: defValue
})