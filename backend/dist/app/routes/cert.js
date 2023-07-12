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
  app.get('/cert/get', [_middlewares.default.verifyToken()], (0, _utils.routeToController)(_controllers.cert.get));
  app.post('/cert/save', [_middlewares.default.verifyToken], (0, _utils.routeToController)(_controllers.cert.save));
  app.delete('/cert/remove', [_middlewares.default.verifyToken], (0, _utils.routeToController)(_controllers.cert.remove));
};

exports.default = _default;