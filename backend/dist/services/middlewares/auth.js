"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAdmin = exports.verifyToken = exports.dataInToken = void 0;

var _data = _interopRequireDefault(require("../../data"));

var Utils = _interopRequireWildcard(require("../utils"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const dataInToken = validator => async (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).send({
      message: "No token provided!"
    });
  }

  token = token.replace('Bearer ', '');
  Utils.verifyToken(token, data => {
    const valid = Object.keys(validator).reduce((valid, key) => {
      if (!valid || !dataInToken.validateKey(validator, data, key)) return false;else return true;
    }, true);

    if (valid) {
      Object.assign(req, {
        auth: data
      });
      if ('userId' in validator) req.user = async _ => await _data.default.user.findOne({
        where: {
          id: data.userId
        },
        attributes: {
          exclude: password
        }
      });
      next();
    } else res.status(401).send({
      message: "Unauthorized!"
    });
  });
};

exports.dataInToken = dataInToken;

dataInToken.validateKey = async (validator, data, key) => {
  if (validator[key] === undefined) return key in data;else if (typeof validator[key] === 'function') return await validator[key](data[key], {
    data,
    validator,
    key,
    db: _data.default
  });else if (Array.isArray(validator[key])) validator[key].find(vkey => vkey == data[key]) !== undefined;else return validator[key] == data[key];
};

const verifyToken = (req, res, next) => {
  dataInToken({
    userId: undefined
  })(req, res, next);
};

exports.verifyToken = verifyToken;

const isAdmin = (req, res, next) => {
  dataInToken({
    userId: undefined
  })(req, res, next);

  _data.default.uder.findByPk(req.userId).then(async user => {
    if (user) {
      const role = await user.getRole();
      if (role && role.name === 'ADMIN') return next();
    }

    res.status(401).send({
      message: "Require Admin Role!"
    });
  });
};

exports.isAdmin = isAdmin;