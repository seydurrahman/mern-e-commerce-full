const express = require("express");

const router = express.Router();
const {
  userRegister,
  loginUser,
  logoutUser,
  authMiddleware,
} = require("../../controllers/auth/auth-controller");

router.post("/register", userRegister);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "User is authenticated",
    user,
  });
});

module.exports = router;
