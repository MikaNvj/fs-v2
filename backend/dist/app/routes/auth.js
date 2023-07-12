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
  app.post('/auth/signin', (0, _utils.routeToController)(_controllers.auth.signin));
  app.get('/auth/check', [_middlewares.default.verifyToken], (0, _utils.routeToController)(_controllers.auth.check));
  app.get('/auth/new-images', [_middlewares.default.verifyToken], (0, _utils.routeToController)(_controllers.auth.newImages));
};

exports.default = _default;