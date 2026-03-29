import { body, query, param } from "express-validator";

export const registerValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("fullName").trim().notEmpty().withMessage("Full Name is required"),
];

export const getUsersValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];

export const loginUserValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const updateUserValidation = [
  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("fullName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Full Name is required"),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either 'user' or 'admin'"),
  body("job_title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Job Title is required"),
  body("stack")
    .optional()
    .isArray()
    .withMessage("Stack must be an array of strings"),
  body("bio").optional().trim().notEmpty().withMessage("Bio is required"),
  body("github_link")
    .optional()
    .isURL()
    .withMessage("GitHub link must be a valid URL"),
  body("linkedin_link")
    .optional()
    .isURL()
    .withMessage("LinkedIn link must be a valid URL"),
  body("twitter_link")
    .optional()
    .isURL()
    .withMessage("Twitter link must be a valid URL"),
];
