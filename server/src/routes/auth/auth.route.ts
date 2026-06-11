import { Router } from "express";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import { getMe, googleCallback, googleLogin, logoutUser } from "../../utils/auth/google.js";
import { requireAuth } from "../../middleware/auth.js";

export const AuthRouter = Router();

/**
 * STEP 1: Redirect user to Google login page
 */
AuthRouter.get(
  "/google",
  AsyncHandler(async (req, res) => {
    return googleLogin(req, res);
  })
);

/**
 * STEP 2: Google redirects here after login
 */
AuthRouter.get(
  "/google/callback",
  AsyncHandler(async (req, res) => {
    return googleCallback(req, res);
  })
);

AuthRouter.post(
  "/logout",
  requireAuth,
  AsyncHandler(logoutUser)
);

AuthRouter.get(
  "/me",
  requireAuth,
  AsyncHandler(getMe)
);
