import { body, query, param } from "express-validator";

export const createProjectValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Project name is required"),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty if provided"),

  body("techStack")
    .optional()
    .isArray()
    .withMessage("Tech stack must be an array"),
  body("techStack.*")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Each tech stack item must be a non-empty string"),

  body("status")
    .optional()
    .isIn(["Live", "Draft", "Archived"])
    .withMessage("Status must be Live, Draft, or Archived"),

  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty if provided"),

  body("links.live_url")
    .optional()
    .isURL()
    .withMessage("Live URL must be a valid URL"),

  body("links.repo")
    .optional()
    .isURL()
    .withMessage("Repo URL must be a valid URL"),

  body("links.code")
    .optional()
    .isURL()
    .withMessage("Code URL must be a valid URL"),
];

export const updateProjectValidation = [

  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Project name cannot be empty if provided"),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty if provided"),

  body("techStack")
    .optional()
    .isArray()
    .withMessage("Tech stack must be an array"),
  body("techStack.*")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Each tech stack item must be a non-empty string"),

  body("status")
    .optional()
    .isIn(["Live", "Draft", "Archived"])
    .withMessage("Status must be Live, Draft, or Archived"),

  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty if provided"),

body("coverImage")
    .optional()
    .isURL()
    .withMessage("Cover image must be a valid URL"),
    

  body("links.live_url")
    .optional()
    .isURL()
    .withMessage("Live URL must be a valid URL"),

  body("links.repo")
    .optional()
    .isURL()
    .withMessage("Repo URL must be a valid URL"),

  body("links.code")
    .optional()
    .isURL()
    .withMessage("Code URL must be a valid URL"),
];

export const getProjectsValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("status")
    .optional()
    .isIn(["Live", "Draft", "Archived"])
    .withMessage("Status must be Live, Draft, or Archived"),

  query("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty if provided"),

  query("search")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Search term cannot be empty if provided"),
];

export const projectIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid project ID"),
];