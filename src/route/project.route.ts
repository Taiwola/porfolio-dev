import express from "express";
import { createProject, deleteProject, getAllProjects, getProjectById, updateProject } from "../controller/project.controller";
import { protect } from "../middleware/auth.middleware";
import { createProjectValidation, updateProjectValidation } from "../validate/project.validate";
import { validate } from "../common/validate";

const router = express.Router();    

router.get('/', getAllProjects)
router.get('/:id', getProjectById)


router.post('/',  protect, createProjectValidation, validate, createProject)
router.patch('/:id', protect, updateProjectValidation, validate, updateProject)

router.delete('/:id', protect, deleteProject)


export default router;