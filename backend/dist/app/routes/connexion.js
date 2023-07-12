"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _middlewares = _interopRequireDefault(require("../../services/middlewares"));

var _utils = require("../../services/utils");

var _controllers = require("../controllers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = app => {
  app.get('/connexion/get', [_middlewares.default.verifyToken], (0, _utils.routeToController)(_controllers.connexion.get));
  app.post('/connexion/save', [_middlewares.default.verifyToken], (0, _utils.routeToController)(_controllers.connexion.save));
  app.delete('/connexion/remove', [_middlewares.default.verifyToken], (0, _utils.routeToController)(_controllers.connexion.remove));
};

exports.default = _default;