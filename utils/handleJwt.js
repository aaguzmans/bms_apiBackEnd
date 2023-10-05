const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

//firma el token
const tokenSign = async (user) => {
  const sign = jwt.sign(
    {
      id: user.id,
      companyId: user.companyId,
      rol: user.rol,
    },
    JWT_SECRET,
    {
      expiresIn: "2h",
    }
  );

  return sign;
};

const verifyToken = async (tokenJwt) => {
  try {
    return jwt.verify(tokenJwt, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = { tokenSign, verifyToken };
