import express from "express";
import { createProject, deleteProject, getAllProjects, getProjectById, updateProject } from "../controller/project.controller";
import { protect } from "../middleware/auth.middleware";
import { createProjectValidation, updateProjectValidation } from "../validate/project.validate";
import { validate } from "../common/validate";
import { uploadProfileFiles } from "../config/multer.config";

const router = express.Router();    

router.get('/', getAllProjects)
router.get('/:id', getProjectById)


router.post('/',  protect, createProjectValidation, validate, uploadProfileFiles, createProject)
router.patch('/:id', protect, updateProjectValidation, validate, uploadProfileFiles, updateProject)

router.delete('/:id', protect, deleteProject)


export default router;