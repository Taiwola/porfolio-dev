import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import { ENV } from "./env.config";



export interface RefreshTokenPayload extends JwtPayload {
  id: string;
}

// Generate Access Token (Short-lived - e.g., 15m to 24h)
export const generateAccessToken = (user: {
  id: string;
  email: string;
  role?: "user" | "admin";
  fullName?: string;
}): string => {
  const payload: JwtPayload = {
    id: user.id,
    email: user.email.toLowerCase().trim(),
    role: user.role,
    fullName: user.fullName,
  };

  const options: SignOptions = {
    expiresIn: ENV.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] || "24h" ,   // e.g., "15m", "1h", "7d"
  };

  return jwt.sign(payload, ENV.JWT_SECRET, options);
};

// Generate Refresh Token (Long-lived - e.g., 7 to 30 days)
export const generateRefreshToken = (userId: string): string => {
  const payload: RefreshTokenPayload = {
    id: userId,
  };

  const options: SignOptions = {
    expiresIn: ENV.JWT_REFRESH_EXPIRES_IN  as jwt.SignOptions["expiresIn"] || "7d",   // Longer expiry
  };

  return jwt.sign(payload, ENV.JWT_REFRESH_SECRET || ENV.JWT_SECRET, options);
};

// Verify Access Token
export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") throw new Error("Access token expired");
    if (error.name === "JsonWebTokenError") throw new Error("Invalid access token");
    throw new Error("Token verification failed");
  }
};

// Verify Refresh Token
export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  try {
    const secret = ENV.JWT_REFRESH_SECRET || ENV.JWT_SECRET;
    return jwt.verify(token, secret) as RefreshTokenPayload;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") throw new Error("Refresh token expired");
    if (error.name === "JsonWebTokenError") throw new Error("Invalid refresh token");
    throw new Error("Token verification failed");
  }
};

// Optional: Generate both tokens at once
export const generateTokens = (user: {
  id: string;
  email: string;
  role?: "user" | "admin";
  fullName?: string;
}) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user.id);

  return {
    accessToken,
    refreshToken,
  };
};