"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _types = require("../database/types");

var _default = sequelize => sequelize.define("connexion", {
  id: (0, _types.id)(),
  key: (0, _types.string)(1),
  start: (0, _types.date)(),
  stop: (0, _types.date)(),
  subscribed: (0, _types.bool)(),
  inactive: (0, _types.bool)() // Other properties

}, {
  freezeTableName: true
});

exports.default = _default;