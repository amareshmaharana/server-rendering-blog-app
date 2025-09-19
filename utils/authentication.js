import JWT from "jsonwebtoken";

const secret = 'wklbdui3g2ubdjk2nd';

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    profileImgURL: user.profileImgURL,
    role: user.role,
  };
  const token = JWT.sign(payload, secret, { expiresIn: "7d" });
  return token;
}

function verifyToken(token) {
  const payload = JWT.verify(token, secret);
  return payload;
}

export { createTokenForUser, verifyToken };