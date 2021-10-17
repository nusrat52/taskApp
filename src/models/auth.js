const users = require("./users");
const jwt = require("jsonwebtoken");
const { Error } = require("mongoose");

const auth = async (req, res, next) => {
   try {
    const token = req.header("Authorization").replace("Bearer ", "");
     const decoded = jwt.verify(token, "nusretYek");
    const user = await users.findOne({
      _id: decoded.id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;
  } catch (e) {
    res.status(401).send({ error: "autontikate!" });
  }

  next();
};

module.exports = auth;
