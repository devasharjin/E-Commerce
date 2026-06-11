import jwt from "jsonwebtoken";

export function generateAccessToken(user: any) {
  return jwt.sign(
    {
      userId: user._id, 
      email: user.email,
      role: user.role ?? "user",
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "15m",
    }
  );
}

export function generateRefreshToken(user: any) {
  return jwt.sign(
    {
      userId: user._id, 
    },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "30d",
    }
  );
}