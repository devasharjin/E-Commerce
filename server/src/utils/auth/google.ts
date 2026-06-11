import { OAuth2Client } from "google-auth-library";
import type { Request, Response } from "express";
import User from "../../models/userModel.js";
import { generateAccessToken, generateRefreshToken } from "./jwt.js";
import { extractDbUser, type AuthRequest } from "../../middleware/auth.js";
import { ok } from "../envelope.js";


export const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

/**
 * STEP 1: Redirect to Google login
 */
export const googleLogin = async (req: Request, res: Response) => {
  const url = googleClient.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["openid", "email", "profile"],
  });

  return res.redirect(url);
};

/**
 * STEP 2: Google callback
 */
export const googleCallback = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;

    if (!code) {
      return res.status(400).json({ message: "Authorization code missing" });
    }

    // Exchange code for tokens
    const { tokens } = await googleClient.getToken(code);

    googleClient.setCredentials(tokens);

    if (!tokens.id_token) {
      return res.status(400).json({ message: "Google ID token missing" });
    }

    // Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(401).json({ message: "Invalid Google profile" });
    }

    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name || "";
    const picture = payload.picture || "";

    // Role logic
    const adminEmails = new Set(
      (process.env.ADMIN_USER ?? "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
    );

    const role = adminEmails.has(email.toLowerCase())
      ? "admin"
      : "user";

    // Find or create user
    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.create({
        googleId,
        email,
        name,
        profilePicture: picture,
        role,
      });
    }

    // Generate JWT tokens (YOUR SYSTEM)
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;

    // OPTIONAL: store Google tokens (for Google API access later)
    if (tokens.refresh_token) {
      user.googleRefreshToken = tokens.refresh_token;
    }

    user.googleAccessToken = tokens.access_token || undefined;

    user.googleTokenExpiry = tokens.expiry_date
      ? new Date(tokens.expiry_date)
      : undefined;

    await user.save();

    // 🔐 SET HTTP-ONLY COOKIES (IMPORTANT CHANGE)
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 min
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Redirect frontend WITHOUT tokens in URL
    return res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:5173"}/`
    );

  } catch (err) {
    console.error("Google OAuth error:", err);
    return res.status(500).json({ message: "Google auth failed" });
  }
};


//logout

export const logoutUser = async (req: AuthRequest, res: Response) => {
  const user = await extractDbUser(req);

  user.refreshToken = null;
  await user.save();

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

 return res.json(
  ok({ message: "Logout successful" })
);
};

//me

export const getMe = async (req: Request, res: Response) => {
  const user = await extractDbUser(req);

  res.json(
  ok({
    googleId: user.googleId,
    name: user.name,
    email: user.email,
    role: user.role,
  })
);
};