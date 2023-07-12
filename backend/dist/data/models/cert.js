"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _types = require("../database/types");

var _default = sequelize => sequelize.define("cert", {
  id: (0, _types.id)(),
  mention: (0, _types.string)(100),
  inactive: (0, _types.bool)()
}, {
  freezeTableName: true
});

exports.default = _default;