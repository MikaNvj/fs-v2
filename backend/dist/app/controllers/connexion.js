"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.remove = exports.save = exports.get = void 0;

var _data = _interopRequireDefault(require("../../data"));

var _utils = require("../../services/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const get = async ({
  data,
  auth,
  files
}) => {
  return await (0, _utils.getEntity)({
    model: _data.default.connexion,
    ...data
  });
};

exports.get = get;

const save = async ({
  data,
  auth,
  files
}) => {
  return await (0, _utils.saveEntity)({
    model: _data.default.connexion,
    data
  });
};

exports.save = save;

const remove = async ({
  data,
  auth,
  files
}) => {
  return await (0, _utils.removeEntity)({
    model: _data.default.connexion,
    id: data.id
  });
};

exports.remove = remove;