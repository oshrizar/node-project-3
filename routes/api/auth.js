const express = require("express");
const router = express.Router();
const bcrypt = require("../../config/bcrypt");
const {
  registerUserValidation,
  loginUserValidation,
} = require("../../validation/authValidationService");
const normalizeUser = require("../../model/users/helpers/normalizationUser");
const usersServiceModel = require("../../model/users/usersService");
const { generateToken } = require("../../config/jwt");
const CustomError = require("../../utils/CustomError");
const authmw = require("../../middleware/authMiddleware");
const permissionsUsersMiddleware = require("../../middleware/permissionsUsersMiddleware");
//http://localhost:8181/api/auth/register
router.post("/register", async (req, res) => {
  try {
    await registerUserValidation(req.body);
    req.body.password = await bcrypt.generateHash(req.body.password);
    req.body = normalizeUser(req.body);
    await usersServiceModel.registerUser(req.body);
    res.json({ msg: "register" });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get(
  "/",
  authmw,
  permissionsUsersMiddleware(true, false),
  async (req, res) => {
    try {
      const allUsers = await usersServiceModel.getAllUsers(req.id, {
        password: 0,
        _id: 0,
      });
      res.json(allUsers);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

router.get(
  "/:id",
  authmw,
  permissionsUsersMiddleware(true, true),
  async (req, res) => {
    try {
      await validateIdSchema(req.params.id);
      const getId = await usersServiceModel.getuserById(req.params.id, {
        password: 0,
        _id: 0,
      });

      res.json(getId);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

router.put(
  "/:id",
  authmw,
  permissionsUsersMiddleware(false, true),
  async (req, res) => {
    try {
      await registerUserValidation(req.body);
      await validateIdSchema(req.params.id);
      normalizeUser(req.body);
      const updatUser = await usersServiceModel.updatUser(
        req.params.id,
        req.body
      );

      res.json(updatUser);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

router.patch(
  "/:id",
  authmw,
  permissionsUsersMiddleware(false, true),
  async (req, res) => {
    try {
      await registerUserValidation(req.body);
      await validateIdSchema(req.params.id);
      const Business = req.params.id;
      let userData = await usersServiceModel.getuserById(Business);
      if (userData.isBusiness === true) {
        userData.isBusiness = false;
        userData = await userData.save();
        res.json({ msg: "Editing was done false successfully" });
      } else {
        userData.isBusiness = true;
        userData = await userData.save();
        res.json({ msg: "Editing was done true successfully" });
      }
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

router.delete(
  "/:id",
  authmw,
  permissionsUsersMiddleware(true, true),
  async (req, res) => {
    try {
      await validateIdSchema(req.params.id);
      const DeleteUser = await usersServiceModel.DeleteUser(req.params.id);
      res.json(DeleteUser);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

//http://localhost:8181/api/auth/login

const MAX_LOGIN_ATTEMPTS = 3;
const loginAttempts = new Map();

router.post("/login", async (req, res) => {
  try {
    await loginUserValidation(req.body);
    const userData = await usersServiceModel.getUserByEmail(req.body.email);
    if (!userData) throw new CustomError("invalid email and/or password");
    const isPasswordMatch = await bcrypt.cmpHash(
      req.body.password,
      userData.password
    );
    if (!isPasswordMatch)
      throw new CustomError("invalid email and/or password");
    const token = await generateToken({
      _id: userData._id,
      isAdmin: userData.isAdmin,
      isBusiness: userData.isBusiness,
    });
    res.json({ token });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
