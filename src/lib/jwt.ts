import jwt from "jsonwebtoken";

export const jwToken = {
  sign: (payload: any, secret: string = process.env.JWT_SECRET!) => {
    return jwt.sign(payload, secret, { expiresIn: '3h' });
  },
  verify: (token: string, secret: string = process.env.JWT_SECRET!) => {
    return jwt.verify(token, secret);
  }
};
