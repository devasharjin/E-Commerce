import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import User from "../models/userModel.js";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

/**
 * AUTH MIDDLEWARE (COOKIE BASED)
 */
export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token =
    req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new AppError(401, "Unauthorized"));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as {
      userId: string;
      email: string;
      role: string;
    };

    req.user = decoded;
    next();
  } catch {
    return next(new AppError(401, "Invalid or Expired Token"));
  }
}

/**
 * GET FULL USER FROM DB
 */
export async function extractDbUser(req: AuthRequest) {
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError(401, "Unauthorized");
  }

  const dbUser = await User.findById(userId);

  if (!dbUser) {
    throw new AppError(404, "User Not Found");
  }

  return dbUser;
}

/**
 * ADMIN ONLY MIDDLEWARE
 */
export async function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const dbUser = await extractDbUser(req);

    if (dbUser.role !== "admin") {
      return next(new AppError(403, "Admin Access Required"));
    }

    next();
  } catch (err) {
    next(err);
  }
}