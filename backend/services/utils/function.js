export const get = (obj, field = "") => {
  return field.split(".").reduce((obj, key) => (obj ? obj[key] : obj), obj)
}
