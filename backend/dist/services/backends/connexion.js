"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeConnexion = exports.createOrUpdateConnexion = exports.getConnexions = void 0;

var _api = _interopRequireDefault(require("../api"));

var _functions = require("../functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getConnexions = async connexions => {
  const res = await _api.default.get({
    url: '/connexion/get',
    params: {
      ids: connexions.map(_functions.reduceToId).join(',')
    }
  });
  return res.data;
};

exports.getConnexions = getConnexions;

const createOrUpdateConnexion = async connexion => {
  const res = await _api.default.post({
    url: '/connexion/create_or_update',
    data: connexion
  });
  return res.data;
};

exports.createOrUpdateConnexion = createOrUpdateConnexion;

const removeConnexion = async connexion => {
  const res = await _api.default.delete({
    url: '/connexion/remove',
    params: {
      id: (0, _functions.reduceToId)(connexion)
    }
  });
  return res.data;
};

exports.removeConnexion = removeConnexion;