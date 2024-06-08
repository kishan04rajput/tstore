import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  // console.log(req.cookies);
  if (!token) {
    return res.send("No token is available!");
  }
  jwt.verify(
    req.cookies.tstore_token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, user) => {
      if (err) {
        return res.send("Token not valid!");
      }
      req.user = user;
      // console.log("res.user\n", req.user);
      next();
    }
  );
};
