import * as axios from "axios"
const qs = require("query-string")
const FD = typeof FormData === 'undefined' ? require("form-data") : FormData
/**
 * @typedef {Object} StrikeOptions
 * @property {string} url URL for the request
 * @property {boolean} [auth=true] Use token authentication
 * @property {Object} [headers] Other headers for the request
 * @property {FD|String|Object} [data] Data for the request
 */

/**
 * Transforms Object to FormData
 * @param {Object} obj Object to transform to FormData
 */
export const toFormData = (obj) =>
  Object.getOwnPropertyNames(obj).reduce((fd, key) => {
    const val = obj[key];
    if (Array.isArray(val))
      val.forEach((data) => {
        if (data !== undefined) fd.append(key, data);
      });
    else if (val !== undefined) fd.append(key, val);
    return fd;
  }, new FD());

/**
 * Transforms Object to url params
 * @param {Object} obj Object to transform to URL
 */
export const toUrl = (obj) => {
  return qs.stringify(obj);
};

/**
 * @param {string} baseURL Base url for your Api
 * @param {Object} axios_options optional options to pass to axios instance
 */
export default (baseURL, axios_options) => {
  const __data = {
    tokenPrefix: 'Bearer',
    token: undefined,
    catchers: []
  };
  const Axios = axios.create({ baseURL, ...axios_options });
  const request = async (method, opt) => {
    let { url, data, headers = {}, auth = true, ...rest } = opt
    const { tokenPrefix, token, catchers: catcher } = __data
    if (auth && token) {
      const tkn = (typeof token === 'function' ? token() : token) || ""
      const tkn_p = (typeof tokenPrefix === 'function' ? tokenPrefix() : tokenPrefix) || ""
      headers = { ...headers, Authorization: `${tkn_p.trim()} ${tkn.trim()}`.trim() }
    }
    if (data instanceof FD) {
      headers = { ...headers, "Content-Type": "multipart/form-data" };
    } else if (typeof data === "string") {
      if (data.startsWith("?")) {
        if (url.indexOf("?") < 0) url += data;
        data = undefined;
      } else
        headers = {
          ...headers,
          "Content-Type": "application/x-www-form-urlencoded",
        }
    }
    let options = { method, url, data, headers, ...rest };
    try{
      let result = await Axios.request(options)
      if(!result.data) {
        return await request(method, opt)
      }
      return result
    }
    catch(e) {
      catcher.forEach(cc => cc(e, { url, data, headers, auth, ...rest }))
      throw(e)
    }
  };
  return {
    /**
     * Strike a GET request
     * @param {StrikeOptions} options
     */
    get: (options) => request("GET", options),
    /**
     * Strike a POST request
     * @param {StrikeOptions} options
     */
    post: (options) => request("POST", options),
    /**
     * Strike a PUT request
     * @param {StrikeOptions} options
     */
    put: (options) => request("PUT", options),
    /**
     * Strike a DELETE request
     * @param {StrikeOptions} options
     */
    delete: (options) => request("DELETE", options),
    toUrl,
    toFormData,
    getToken: () => {
      const { token, tokenPrefix } = __data
      const t = (typeof token === 'function' ? token() : token) || ""
      const prefix = (typeof tokenPrefix === 'function' ? tokenPrefix() : tokenPrefix) || ""
      return `${prefix} ${t}`
    },
    setToken: (val) => {
      __data.token = val
    },
    setTokenPrefix: (val) => {
      __data.tokenPrefix = val
    },
    setCatcher: catcher => {
      __data.catchers.push(catcher)
    }
  };
};