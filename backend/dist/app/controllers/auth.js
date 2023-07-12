"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newImages = exports.check = exports.signin = void 0;

var _os = _interopRequireDefault(require("os"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireWildcard(require("fs"));

var _data = _interopRequireDefault(require("../../data"));

var Service = _interopRequireWildcard(require("../../services/utils"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const signin = async ({
  data,
  error
}) => {
  const {
    login,
    password
  } = data;
  let user = null;

  if (login) {
    const t_user = await _data.default.user.findOne({
      where: login.indexOf('@') >= 0 ? {
        email: login
      } : {
        username: login
      }
    });

    if (t_user && Service.comparePassword(password, t_user.password)) {
      user = t_user;
    }
  }

  if (user) {
    var token = Service.createToken({
      userId: user.id,
      userRole: user.role
    }, 365 * 24 * 60 * 60);
    return {
      user: (0, Service.simpleMember)(user),
      token
    };
  } else return error("Bad credentials");
};

exports.signin = signin;

const check = async ({
  user
}) => {
  const me = await user();
  return {
    user: (0, Service.simpleMember)(me)
  };
};

exports.check = check;

const newImages = async ({
  data: {
    date
  },
  req
}) => {
  return _fs.default.readdirSync(_path.default.join('upload', 'images')).filter(name => {
    const stat = _fs.default.lstatSync(_path.default.join('upload', 'images', name));

    return stat.isFile() && stat.birthtime > new Date(0);
  }).map(name => `${req.protocol}://${req.get('host')}/upload/images/${name}`);
};

exports.newImages = newImages;