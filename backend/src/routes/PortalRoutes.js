import express from "express";
import {getAllProjects, createProject, deleteProject, updateProject, getProjectById, updateUIMockup, captureRequirements, downloadUIMockup} from "../controllers/projectController.js"

const router = express.Router();

router.get("/", getAllProjects);

router.get("/:id", getProjectById);
router.post("/", createProject);
router.delete("/:id", deleteProject);
router.put("/:id", updateProject)
router.post('/capture', captureRequirements);
router.put('/:id/ui', updateUIMockup);
router.get("/:id/download", downloadUIMockup);


export default router;

