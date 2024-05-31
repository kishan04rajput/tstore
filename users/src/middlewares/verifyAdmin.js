import { verifyToken } from "./verifyToken.js";

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.send("u r not authorised!");
    }
  });
};
