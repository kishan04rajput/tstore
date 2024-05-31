import { verifyToken } from "./verifyToken.js";

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.send("u r not authorised!");
    }
  });
};
