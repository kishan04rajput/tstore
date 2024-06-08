import { verifyToken } from "./verifyToken.js";

export const verifyUser = (req, res, next) => {
    // console.log("Verify Token hit!");
    // console.log(req.body);
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(400).send("u r not authorised!");
        }
    });
};
