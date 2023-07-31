const config = require("config");
const bcryptjs = require("./bcrypt");
const bcrytOther = require("./bcrytOther");

const hashOption = "bcryptjs";

const generateHash = (password) => {
  switch (hashOption) {
    case "bcryptjs":
      return bcryptjs.generateHash(password);
    case "bcrytOther":
      return bcrytOther.generateHash(password);
  }
};

const cmpHash = (password, hash) => {
  switch (hashOption) {
    case "bcryptjs":
      return bcryptjs.cmpHash(password, hash);
    case "bcrytOther":
      return bcrytOther.cmpHash(password, hash);
  }
};
module.exports = {
  generateHash,
  cmpHash,
};
