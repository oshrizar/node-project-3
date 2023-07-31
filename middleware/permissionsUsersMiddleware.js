const CustomError = require("../utils/CustomError");

const permissionsMiddlewareUser = (isAdmin, isOwner) => {
  return (req, res, next) => {
    if (!req.userData) {
      throw new CustomError("user not found");
    }

    if (isAdmin === req.userData.isAdmin && isAdmin === true) {
      return next();
    }
    if (!(req.params.id === req.userData._id)) {
      res.status(401).json({ msg: "you are not the owner" });
    }
    if (req.params.id === req.userData._id && isOwner === true) {
      return next();
    }
    res
      .status(401)
      .json({ msg: "You are not authorized to access this request" });
  };
};

module.exports = permissionsMiddlewareUser;
