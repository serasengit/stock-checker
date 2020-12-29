const Config = require("../db/models/config");

exports.findByClave = async function findByClave(clave) {
  return Config.query().where("clave", clave);
};
